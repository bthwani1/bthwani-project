import { Request, Response } from "express";
import UtilityPricing from "../../models/delivery_marketplace_v1/UtilityPricing";

export const getUtilityOptions = async (req: Request, res: Response) => {
  try {
    const city = (req.query.city as string) || "صنعاء";
    const cfg = await UtilityPricing.findOne({ city, isActive: true }).lean();
    if (!cfg) {
      res.status(404).json({ message: "لا توجد إعدادات تسعير لهذه المدينة" });
      return;
    }

    res.json({
      city,
      gas: cfg.gas?.enabled
        ? {
            city, // ✅ مهم لواجهة الأدمن
            cylinderSizeLiters: cfg.gas.cylinderSizeLiters,
            pricePerCylinder: cfg.gas.pricePerCylinder,
            minQty: cfg.gas.minQty ?? 1,
            deliveryPolicy: cfg.gas.deliveryOverride?.policy ?? "strategy",
            flatFee: cfg.gas.deliveryOverride?.flatFee ?? null,
          }
        : null,
      water: cfg.water?.enabled
        ? {
            city, // ✅ مهم لواجهة الأدمن
            sizes: cfg.water.sizes,
            allowHalf: cfg.water.allowHalf,
            halfPolicy: cfg.water.halfPricingPolicy,
            deliveryPolicy: cfg.water.deliveryOverride?.policy ?? "strategy",
            flatFee: cfg.water.deliveryOverride?.flatFee ?? null,
          }
        : null,
    });
  } catch (e: any) {
    res.status(500).json({ message: e.message });
  }
};
