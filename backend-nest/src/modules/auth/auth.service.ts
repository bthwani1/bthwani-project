import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SignOptions } from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as admin from 'firebase-admin';
import { User } from './entities/user.entity';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  // المصادقة عبر Firebase (الطريقة الرئيسية)
  async loginWithFirebase(idToken: string) {
    try {
      // التحقق من Firebase token
      const decodedToken = await admin.auth().verifyIdToken(idToken, true);

      // البحث عن المستخدم أو إنشاءه
      let user = await this.userModel.findOne({
        firebaseUID: decodedToken.uid,
      });

      if (!user) {
        // إنشاء مستخدم جديد من Firebase
        user = await this.userModel.create({
          firebaseUID: decodedToken.uid,
          email: decodedToken.email,
          fullName: String(decodedToken.name) || 'مستخدم جديد',
          phone: decodedToken.phone_number || '',
          emailVerified: decodedToken.email_verified,
          authProvider: 'firebase',
          profileImage: decodedToken.picture || '',
        });
      } else {
        // تحديث بيانات المستخدم من Firebase
        await this.userModel.findByIdAndUpdate(user._id, {
          lastLoginAt: new Date(),
          emailVerified: decodedToken.email_verified,
        });
      }

      // التحقق من حالة المستخدم
      if (!user.isActive) {
        throw new UnauthorizedException({
          code: 'ACCOUNT_INACTIVE',
          message: 'Account is not active',
          userMessage: 'الحساب غير نشط',
          suggestedAction: 'يرجى التواصل مع الدعم الفني',
        });
      }

      if (user.isBlacklisted || user.isBanned) {
        throw new UnauthorizedException({
          code: 'ACCOUNT_BANNED',
          message: 'Account is banned',
          userMessage: 'الحساب محظور',
          suggestedAction: 'يرجى التواصل مع الدعم الفني',
        });
      }

      // إنشاء JWT Token
      const token = await this.generateToken(user);

      return {
        user: this.sanitizeUser(user),
        token,
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException({
        code: 'INVALID_FIREBASE_TOKEN',
        message: error instanceof Error ? error.message : 'Unknown error',
        userMessage: 'رمز Firebase غير صالح أو منتهي الصلاحية',
        suggestedAction: 'يرجى تسجيل الدخول مرة أخرى',
      });
    }
  }

  // إنشاء JWT Token
  private async generateToken(user: {
    _id?: any;
    id?: string;
    email?: string;
    role?: string;
    firebaseUID?: string;
  }) {
    const payload = {
      sub: user._id ? String(user._id) : user.id,
      email: user.email,
      role: user.role,
      firebaseUID: user.firebaseUID,
    };

    const secret =
      this.configService.get<string>('jwt.secret') || 'default-secret';
    const expiresIn = this.configService.get<string>('jwt.expiresIn') || '7d';

    const accessToken = await this.jwtService.signAsync(payload, {
      secret,
      expiresIn,
    } as SignOptions);

    return {
      accessToken,
      tokenType: 'Bearer',
      expiresIn,
    };
  }

  // تنظيف بيانات المستخدم (إزالة البيانات الحساسة)
  private sanitizeUser(user: { toObject?: () => any } & Record<string, any>) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const userObject: Record<string, any> = user.toObject
      ? user.toObject()
      : user;

    // لا نحتاج لحذف password لأنه غير موجود في النموذج
    // فقط نعيد البيانات الآمنة

    /* eslint-disable @typescript-eslint/no-unsafe-assignment */
    return {
      id: userObject._id,
      fullName: userObject.fullName,
      aliasName: userObject.aliasName,
      email: userObject.email,
      phone: userObject.phone,
      profileImage: userObject.profileImage,
      emailVerified: userObject.emailVerified,
      classification: userObject.classification,
      role: userObject.role,
      addresses: userObject.addresses,
      defaultAddressId: userObject.defaultAddressId,
      language: userObject.language,
      theme: userObject.theme,
      wallet: userObject.wallet,
      isActive: userObject.isActive,
      createdAt: userObject.createdAt,
      updatedAt: userObject.updatedAt,
    };
    /* eslint-enable @typescript-eslint/no-unsafe-assignment */
  }
}
