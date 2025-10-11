# توصيات تحسين نظام الإشعارات الحية في تطبيق التاجر

## الوضع الحالي
- التاجر يعتمد على `fetch` requests دورية لتحديث البيانات
- لا يوجد تحديث فوري عند حدوث تغييرات في الطلبات أو السحوبات
- زمن الاستجابة الحالي: ~3 ثواني أو أكثر حسب دورية الـ fetch

## التوصيات المقترحة

### 1. تفعيل Socket.IO في التاجر
```typescript
// في شاشة الطلبات OrdersScreen.tsx
import { ensureSocket, getSocket } from '../realtime/socket';

useEffect(() => {
  const initSocket = async () => {
    const socket = await ensureSocket();

    // الاستماع لتحديثات الطلبات
    socket.on('order_updated', (data) => {
      console.log('Order updated:', data);
      // تحديث قائمة الطلبات فوراً
      fetchOrders();
    });

    // الاستماع لتحديثات السحوبات
    socket.on('settlement_updated', (data) => {
      console.log('Settlement updated:', data);
      // تحديث كشف الحساب فوراً
      // يمكن إعادة جلب البيانات أو تحديث الحالة مباشرة
    });
  };

  initSocket();

  return () => {
    const socket = getSocket();
    if (socket) {
      socket.off('order_updated');
      socket.off('settlement_updated');
    }
  };
}, []);
```

### 2. إضافة Events في الباك إند
في `Backend/src/sockets/vendorSocket.ts` أو مسار مشابه:

```typescript
// عند تحديث حالة طلب
socket.emit('order_updated', {
  orderId: order._id,
  newStatus: order.status,
  vendorId: order.vendor,
  timestamp: new Date()
});

// عند تحديث حالة سحب
socket.emit('settlement_updated', {
  settlementId: settlement._id,
  newStatus: settlement.status,
  vendorId: settlement.vendor,
  timestamp: new Date()
});
```

### 3. تحسين تجربة المستخدم
- إضافة مؤشر تحديث فوري عند وصول إشعار جديد
- إمكانية تعطيل الإشعارات في إعدادات التاجر
- عرض آخر وقت تحديث للبيانات

### 4. تحسين الأداء
- استخدام `useCallback` للدوال المعاد استخدامها
- تجنب إعادة جلب البيانات غير الضرورية
- إضافة `debounce` للتحديثات المتكررة

## مثال تطبيقي في OrdersScreen

```typescript
// إضافة هذا في OrdersScreen.tsx
const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

useEffect(() => {
  const initRealtime = async () => {
    const socket = await ensureSocket();

    socket.on('order_updated', (data) => {
      if (data.vendorId === user?.vendorId) {
        setLastUpdate(new Date());
        fetchOrders(); // إعادة جلب البيانات فوراً
      }
    });
  };

  initRealtime();

  return () => {
    const socket = getSocket();
    if (socket) {
      socket.off('order_updated');
    }
  };
}, [user?.vendorId]);

// عرض آخر تحديث في الواجهة
<Text style={styles.lastUpdate}>
  آخر تحديث: {lastUpdate.toLocaleTimeString('ar-SA')}
</Text>
```

## الخطوات المطلوبة للتفعيل

1. **تفعيل Socket في الباك إند**:
   - إضافة مسار `/vendor` في `Backend/src/sockets/`
   - ربط الـ vendor بالـ socket عند تسجيل الدخول

2. **تحديث شاشات التاجر**:
   - `OrdersScreen.tsx` - تحديثات الطلبات
   - `VendorAccountStatementScreen.tsx` - تحديثات السحوبات
   - `StatisticsScreen.tsx` - تحديثات الإحصائيات

3. **اختبار شامل**:
   - اختبار في بيئة التطوير أولاً
   - التأكد من عدم تأثير الأداء
   - اختبار في الشبكات البطيئة

## النتيجة المتوقعة
- **زمن استجابة**: من ~3 ثواني إلى فوري (< 1 ثانية)
- **تجربة مستخدم محسنة**: تحديثات فورية بدون إعادة تحميل
- **موثوقية أعلى**: عدم فقدان التحديثات المهمة

## ملاحظة مهمة
هذا التحسين اختياري وليس مطلوب لإغلاق المشروع، لكنه سيحسن تجربة المستخدم بشكل ملحوظ.
