// src/controllers/field/onboardingMy.controller.ts
import { Request, Response } from "express";
import DeliveryStore from "../../models/delivery_marketplace_v1/DeliveryStore";
import Vendor from "../../models/vendor_app/Vendor";
import mongoose from "mongoose";
import Onboarding from "../../models/fieldMarketingV1/Onboarding";

// controllers/field/onboardingMy.controller.ts
export const getMyOnboarding = async (req: Request, res: Response) => {
  try {
    const marketerId = (req.user as any)?.id; // JWT فقط
    if (!marketerId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    // ادعم الحقلين (قديم وجديد) كي تظهر البيانات القديمة:
    const stores = await DeliveryStore.find({
      $or: [
        { createdByMarketerId: marketerId },   // الجديد
        { createdByMarketerUid: marketerId },  // القديم (كما في بياناتك)
      ],
    })
      .select("_id name address isActive image logo createdAt")
      .lean();

    const storeIds = stores.map((s) => s._id);
    const vendors = await Vendor.find({ store: { $in: storeIds } })
      .select("_id fullName phone email isActive store")
      .lean();

    const byStore: Record<string, any[]> = {};
    for (const v of vendors) {
      const k = String(v.store);
      (byStore[k] ||= []).push(v);
    }

    const items = stores.map((s) => ({
      store: s,
      vendors: byStore[String(s._id)] || [],
      activation: {
        store: !!s.isActive,
        vendor: (byStore[String(s._id)] || []).some((v) => v.isActive),
      },
    }));

    res.json({ items });
  } catch (e: any) {
    res.status(500).json({ message: e.message });
  }
};
export const getOneFlexible = async (req: Request, res: Response) => {
  try {
    const marketerId = (req.user as any)?.id;
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      res.status(400).json({ message: "Invalid id" });
      return;
    }

    // 1) Onboarding أولاً
    const onb = await Onboarding.findById(id).lean();
    if (onb) {
      const isOwner =
        onb.createdByMarketerId === marketerId ||
        (onb as any).createdByUid === marketerId; // دعم القديم
      const isParticipant = (onb.participants || []).some(
        (p: any) => p.marketerId === marketerId || p.uid === marketerId // دعم القديم
      );
      if (!isOwner && !isParticipant) {
        res.status(403).json({ message: "Forbidden" });
        return;
      }
      // أرسل و اخرج
      res.json({ kind: "onboarding", ...onb });
      return;
    }

    // 2) Store إن لم يكن Onboarding
    const store = await DeliveryStore.findById(id).lean();
    if (store) {
      const isOwner =
        (store as any).createdByMarketerId === marketerId ||
        (store as any).createdByMarketerUid === marketerId; // دعم القديم
      if (!isOwner) {
        res.status(403).json({ message: "Forbidden" });
        return;
      }

      const vendors = await Vendor.find({ store: store._id })
        .select("_id fullName phone email isActive store")
        .lean();

      const activation = {
        store: !!store.isActive,
        vendor: vendors.some((v) => v.isActive),
      };

      // تطبيع بسيط لتستطيع شاشة التفاصيل العرض مباشرة
      res.json({
        kind: "store",
        store,
        vendors,
        activation,
        storeDraft: { name: store.name, address: store.address },
        status: undefined,
        participants: (store as any).participants || [],
        attachments: [],
        createdAt: (store as any).createdAt,
        _id: store._id,
      });
    }

    // 3) لا شيء
    res.status(404).json({ message: "Not found" });
    return;
  } catch (e: any) {
    // تأكد أن هذا المسار الوحيد الذي يرسل في الكاتش
    if (!res.headersSent) {
      res.status(500).json({ message: e.message || "Server error" });
      return;
    }
    // لو كانت الهيدر مُرسلة بالفعل، لا ترسل مرة ثانية
  }
};

// POST /api/v1/field/onboarding - Create draft onboarding
export const createOnboarding = async (req: Request, res: Response) => {
  try {
    const marketerId = (req.user as any)?.id;
    if (!marketerId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const {
      storeDraft,
      ownerDraft,
      attachments,
      participants
    } = req.body;

    // تطبيع participants
    const normalizedParticipants = Array.isArray(participants) && participants.length
      ? participants.map((p: any) => ({
          marketerId: p.uid || marketerId,
          role: p.role || "lead",
          weight: typeof p.weight === "number" ? p.weight : 1,
        }))
      : [{ marketerId, role: "lead", weight: 1 }];

    const onboarding = new Onboarding({
      storeDraft,
      ownerDraft,
      attachments: attachments || [],
      participants: normalizedParticipants,
      status: "draft",
      createdByMarketerId: marketerId,
    });

    await onboarding.save();

    res.status(201).json({
      id: onboarding._id,
      status: onboarding.status,
      createdAt: onboarding.createdAt,
    });
  } catch (e: any) {
    if (!res.headersSent) {
      res.status(500).json({ message: e.message || "Server error" });
    }
  }
};

// PATCH /api/v1/field/onboarding/:id - Update onboarding
export const updateOnboarding = async (req: Request, res: Response) => {
  try {
    const marketerId = (req.user as any)?.id;
    const { id } = req.params;

    if (!marketerId || !mongoose.isValidObjectId(id)) {
      res.status(401).json({ message: "Unauthorized or invalid id" });
      return;
    }

    const {
      storeDraft,
      ownerDraft,
      attachments,
      participants
    } = req.body;

    const onboarding = await Onboarding.findById(id);
    if (!onboarding) {
      res.status(404).json({ message: "Onboarding not found" });
      return;
    }

    // تحقق من الملكية
    if (onboarding.createdByMarketerId !== marketerId) {
      res.status(403).json({ message: "Forbidden" });
      return;
    }

    // تحقق من أنه لا يزال draft
    if (onboarding.status !== "draft") {
      res.status(400).json({ message: "Can only update draft onboarding" });
      return;
    }

    // تطبيع participants إذا قدمت
    if (participants) {
      const normalizedParticipants = Array.isArray(participants) && participants.length
        ? participants.map((p: any) => ({
            marketerId: p.uid || marketerId,
            role: p.role || "lead",
            weight: typeof p.weight === "number" ? p.weight : 1,
          }))
        : [{ marketerId, role: "lead", weight: 1 }];

      onboarding.participants = normalizedParticipants;
    }

    if (storeDraft) onboarding.storeDraft = storeDraft;
    if (ownerDraft) onboarding.ownerDraft = ownerDraft;
    if (attachments) onboarding.attachments = attachments;

    await onboarding.save();

    res.json({
      id: onboarding._id,
      status: onboarding.status,
      updatedAt: onboarding.updatedAt,
    });
  } catch (e: any) {
    if (!res.headersSent) {
      res.status(500).json({ message: e.message || "Server error" });
    }
  }
};

// POST /api/v1/field/onboarding/:id/submit - Submit onboarding for review
export const submitOnboarding = async (req: Request, res: Response) => {
  try {
    const marketerId = (req.user as any)?.id;
    const { id } = req.params;

    if (!marketerId || !mongoose.isValidObjectId(id)) {
      res.status(401).json({ message: "Unauthorized or invalid id" });
      return;
    }

    const onboarding = await Onboarding.findById(id);
    if (!onboarding) {
      res.status(404).json({ message: "Onboarding not found" });
      return;
    }

    // تحقق من الملكية
    if (onboarding.createdByMarketerId !== marketerId) {
      res.status(403).json({ message: "Forbidden" });
      return;
    }

    // تحقق من أنه لا يزال draft
    if (onboarding.status !== "draft") {
      res.status(400).json({ message: "Onboarding is not in draft status" });
      return;
    }

    // تحقق من البيانات المطلوبة
    if (!onboarding.storeDraft?.name || !onboarding.storeDraft?.address) {
      res.status(400).json({ message: "Store name and address are required" });
      return;
    }

    // تحديث الحالة
    onboarding.status = "submitted";
    onboarding.submittedAt = new Date();
    await onboarding.save();

    res.json({
      id: onboarding._id,
      status: onboarding.status,
      submittedAt: onboarding.submittedAt,
    });
  } catch (e: any) {
    if (!res.headersSent) {
      res.status(500).json({ message: e.message || "Server error" });
    }
  }
};