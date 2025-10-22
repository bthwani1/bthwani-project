export interface FirebaseAuthDto;
export interface ConsentDto;
export interface BulkConsentDto;
export interface ForgotPasswordDto;
export interface VerifyResetCodeDto;
export interface ResetPasswordDto;
export interface VerifyOtpDto;
export interface CreateTransactionDto;
export interface OrderItemDto;
export interface AddressDto;
export interface CreateOrderDto;
export interface UpdateOrderStatusDto;
export interface CreateDriverDto;
export interface UpdateLocationDto;
export interface CreateVendorDto;
export interface UpdateVendorDto;
export interface LocationDto;
export interface CreateStoreDto;
export interface CreateProductDto;
export interface UpdateUserDto;
export interface AddAddressDto;
export interface SetPinDto;
export interface VerifyPinDto;
export interface CreateNotificationDto;
export interface CreateSuppressionDto;
export interface CreateCommissionDto;
export interface ApprovePayoutBatchDto;
export interface CreateSettlementDto;
export interface ApproveSettlementDto;
export interface CreateFinancialCouponDto;
export interface ValidateCouponDto;
export interface UpdateFinancialCouponDto;
export interface AddToCartDto;
export interface UpdateCartItemDto;
export interface AddNoteDto;
export interface AddDeliveryAddressDto;
export interface AddToSheinCartDto;
export interface UpdateSheinCartItemDto;
export interface UpdateSheinShippingDto;
export interface CalculateUtilityPriceDto;
export interface CreateUtilityPricingDto;
export interface UpdateUtilityPricingDto;
export interface CreateDailyPriceDto;
export interface CreateUtilityOrderDto;
export interface PointDto;
export interface CalculateFeeDto;
export interface CreateErrandDto;
export interface RateErrandDto;
export interface UpdateErrandStatusDto;
export interface AssignDriverDto;
export interface CreatePromotionDto;
export interface UpdatePromotionDto;
export interface CreateMerchantDto;
export interface UpdateMerchantDto;
export interface CreateProductCatalogDto;
export interface UpdateProductCatalogDto;
export interface CreateMerchantProductDto;
export interface UpdateMerchantProductDto;
export interface CreateMerchantCategoryDto;
export interface UpdateMerchantCategoryDto;
export interface CreateAttributeDto;
export interface UpdateAttributeDto;
export interface CreateBannerDto;
export interface UpdateBannerDto;
export interface CreateStoreSectionDto;
export interface UpdateStoreSectionDto;
export interface CreateSubscriptionPlanDto;
export interface SubscribeDto;
export interface CreateEmployeeDto;
export interface UpdateEmployeeDto;
export interface CreateLeaveRequestDto;
export interface CreateChartAccountDto;
export interface JournalLineDto;
export interface CreateJournalEntryDto;
export interface RecordConsentDto;
export interface CreatePrivacyPolicyDto;
export interface CreateTermsOfServiceDto;

export { AppApi } from './AppApi';
export { AuthApi } from './AuthApi';
export { WalletApi } from './WalletApi';
export { Wallet V2Api } from './Wallet V2Api';
export { OrderApi } from './OrderApi';
export { Orders (CQRS)Api } from './Orders (CQRS)Api';
export { DriverApi } from './DriverApi';
export { VendorApi } from './VendorApi';
export { Admin - StoresApi } from './Admin - StoresApi';
export { Delivery - StoresApi } from './Delivery - StoresApi';
export { UserApi } from './UserApi';
export { NotificationApi } from './NotificationApi';
export { AdminApi } from './AdminApi';
export { Admin CMSApi } from './Admin CMSApi';
export { FinanceApi } from './FinanceApi';
export { CartApi } from './CartApi';
export { UtilityApi } from './UtilityApi';
export { AkhdimniApi } from './AkhdimniApi';
export { ErrandsApi } from './ErrandsApi';
export { PromotionApi } from './PromotionApi';
export { MerchantApi } from './MerchantApi';
export { ContentApi } from './ContentApi';
export { ER SystemApi } from './ER SystemApi';
export { MarketerApi } from './MarketerApi';
export { AnalyticsApi } from './AnalyticsApi';
export { LegalApi } from './LegalApi';
export { HealthApi } from './HealthApi';
export { MetricsApi } from './MetricsApi';

// Error types
export interface ApiError {
  status: number;
  message: string;
  details?: any;
}

// Utility functions
export function isApiError(error: unknown): error is ApiError {
  return typeof error === 'object' &&
         error !== null &&
         'status' in error &&
         'message' in error;
}

export async function apiCall<T>(fn: () => Promise<T>): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    if (isApiError(error)) {
      throw new Error(`API Error [${error.status}]: ${error.message}`);
    }
    throw error;
  }
}