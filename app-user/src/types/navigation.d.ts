export type RootStackParamList = {
  // الحساب والموقع
  UserProfile: undefined;
  MainApp: undefined;
  EditProfile: undefined;
  WalletStack: undefined;
  PaymentStack: undefined;
  AbsherForm: { category: string };
  AkhdimniScreen: undefined;
  OrderDetails: { orderId: string };
  SheinScreen: undefined;
  Subscriptions: undefined;
  HowToUse: undefined;
  WebPage: { title: string; url: string };
  Support: undefined;
  WasliScreen: undefined;
  UtilityGasScreen: undefined; // واجهة الغاز
  UtilityWaterScreen: undefined; // واجهة الوايت
  FazaaScreen: undefined;
  AbsherCategory: undefined;
  ReviewScreen: { freelancerId: string };
  SelectLocation: { storageKey: string; title: string };
  RateDriver: { id: string };
  DeliveryAddresses: {
    selectedLocation?: { latitude: number; longitude: number };
  };

  // التوصيل
  CartScreen: undefined;
  MyOrdersScreen: undefined;
  OrderDetailsScreen: { order: any };
  CategoryDetails: { categoryName: string; categoryId: string };
  BusinessDetails:
    | { businessId: string }
    | { storeId: string }
    | { business: any };
  GroceryMainScreen: { categoryId: string };

  // المعروف (المفقودات والموجودات)
  MaaroufList: undefined;
  MaaroufCreate: undefined;
  MaaroufDetails: { itemId: string };
  MaaroufEdit: { itemId: string };

  // السند (خدمات متخصصة + فزعة + خيري)
  SanadList: undefined;
  SanadCreate: undefined;
  SanadDetails: { itemId: string };
  SanadEdit: { itemId: string };

  // الأماني (النقل النسائي للعائلات)
  AmaniList: undefined;
  AmaniCreate: undefined;
  AmaniDetails: { itemId: string };
  AmaniEdit: { itemId: string };

  // العربون (العروض والحجوزات بعربون)
  ArabonList: undefined;
  ArabonCreate: undefined;
  ArabonDetails: { itemId: string };
  ArabonEdit: { itemId: string };

  // كنز (السوق المفتوح)
  KenzList: undefined;
  KenzCreate: undefined;
  KenzDetails: { itemId: string };
  KenzEdit: { itemId: string };

  // اسعفني (تبرع بالدم عاجل)
  Es3afniList: undefined;
  Es3afniCreate: undefined;
  Es3afniDetails: { itemId: string };
  Es3afniEdit: { itemId: string };

  // أخرى
  Login: undefined;
  Register: undefined;
  Settings: undefined;
  Notifications: undefined;
  InvoiceScreen: { items: any[] };

  // التنقل العام
  MainApp: undefined;
};
