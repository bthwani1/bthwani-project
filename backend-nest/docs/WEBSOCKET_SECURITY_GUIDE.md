# 🔒 دليل أمان WebSocket
## Bthwani Backend - WebSocket Security Implementation Guide

---

## 📖 نظرة عامة

تم تطبيق حماية شاملة على جميع بوابات WebSocket في النظام. هذا الدليل يشرح كيفية الاتصال الآمن واستخدام WebSockets.

---

## 🔐 المصادقة (Authentication)

### كيفية الاتصال الصحيح

```javascript
import { io } from 'socket.io-client';

// 1. احصل على JWT Token من API المصادقة
const token = await fetch('http://localhost:3000/api/v2/auth/login', {
  method: 'POST',
  body: JSON.stringify({ email, password }),
}).then(res => res.json()).then(data => data.token.accessToken);

// 2. استخدم Token للاتصال بـ WebSocket
const socket = io('http://localhost:3000/orders', {
  auth: {
    token: token  // ✅ الطريقة الصحيحة
  }
});

// أو عبر headers
const socket = io('http://localhost:3000/orders', {
  extraHeaders: {
    Authorization: `Bearer ${token}`  // ✅ طريقة بديلة
  }
});
```

### الاستماع للأحداث

```javascript
// ✅ اتصال ناجح
socket.on('connected', (data) => {
  console.log('Connected successfully:', data);
  // { success: true, userId: 'xxx', role: 'user' }
});

// ❌ خطأ في المصادقة
socket.on('error', (error) => {
  console.error('Auth error:', error);
  // { code: 'INVALID_TOKEN', userMessage: 'رمز الدخول غير صالح' }
});

// قطع الاتصال
socket.on('disconnect', (reason) => {
  console.log('Disconnected:', reason);
});
```

---

## 🏪 استخدام Namespaces

### 1. Orders Namespace (`/orders`)

```javascript
const ordersSocket = io('http://localhost:3000/orders', {
  auth: { token }
});

// الانضمام لغرفة طلب معين
ordersSocket.emit('join:order', { orderId: '507f1f77bcf86cd799439011' }, (response) => {
  if (response.success) {
    console.log('Joined order room');
  } else {
    console.error('Failed:', response.error);
  }
});

// الاستماع لتحديثات الطلب
ordersSocket.on('order:updated', (order) => {
  console.log('Order updated:', order);
});

// الاستماع لتغيير حالة الطلب
ordersSocket.on('order:status_changed', (event) => {
  console.log(`Order ${event.orderId} status: ${event.status}`);
});
```

### 2. Drivers Namespace (`/drivers`)

```javascript
const driversSocket = io('http://localhost:3000/drivers', {
  auth: { token }  // يجب أن يكون token لسائق
});

// إرسال الموقع (للسائقين فقط)
setInterval(() => {
  driversSocket.emit('driver:location', {
    lat: 24.7136,
    lng: 46.6753,
    heading: 90  // اختياري
  }, (response) => {
    if (!response.success) {
      console.error('Location update failed:', response.error);
    }
  });
}, 5000); // كل 5 ثوان

// تغيير حالة التوفر
driversSocket.emit('driver:status', {
  isAvailable: true
}, (response) => {
  console.log('Status updated:', response);
});
```

### 3. Notifications Namespace (`/notifications`)

```javascript
const notificationsSocket = io('http://localhost:3000/notifications', {
  auth: { token }
});

// الاستماع للإشعارات
notificationsSocket.on('notification', (notification) => {
  console.log('New notification:', notification);
  // عرض إشعار للمستخدم
  showNotification(notification.title, notification.body);
});
```

---

## 🛡️ التعامل مع Rate Limiting

### حدود الاستخدام
- **الرسائل العامة**: 20 رسالة كل 10 ثوان
- **تحديثات الموقع**: 120 رسالة كل دقيقة (رسالتين في الثانية)

### مثال على التعامل مع Rate Limit

```javascript
socket.emit('join:order', { orderId: 'xxx' }, (response) => {
  if (response.code === 'RATE_LIMIT_EXCEEDED') {
    console.warn('Too many requests, waiting...');
    // الانتظار قليلاً ثم إعادة المحاولة
    setTimeout(() => {
      socket.emit('join:order', { orderId: 'xxx' });
    }, 5000);
  }
});
```

---

## ✅ Validation - البيانات الصحيحة

### 1. Location Update

```javascript
// ✅ صحيح
socket.emit('driver:location', {
  lat: 24.7136,    // بين -90 و 90
  lng: 46.6753,    // بين -180 و 180
  heading: 90      // بين 0 و 360 (اختياري)
});

// ❌ خطأ
socket.emit('driver:location', {
  lat: 'invalid',  // يجب أن يكون number
  lng: 200         // خارج النطاق
});
// سيرجع: validation errors
```

### 2. Driver Status

```javascript
// ✅ صحيح
socket.emit('driver:status', {
  isAvailable: true  // boolean فقط
});

// ❌ خطأ
socket.emit('driver:status', {
  isAvailable: 'yes'  // يجب أن يكون boolean
});
```

### 3. Join Order

```javascript
// ✅ صحيح
socket.emit('join:order', {
  orderId: '507f1f77bcf86cd799439011'  // MongoDB ObjectId صحيح
});

// ❌ خطأ
socket.emit('join:order', {
  orderId: 'invalid-id'  // ليس ObjectId صحيح
});
```

---

## 🔍 أمثلة كاملة

### مثال 1: تطبيق عميل (Customer App)

```javascript
class OrderTracking {
  constructor(token) {
    this.socket = io('http://localhost:3000/orders', {
      auth: { token }
    });
    this.setupListeners();
  }

  setupListeners() {
    this.socket.on('connected', (data) => {
      console.log('Connected as user:', data.userId);
    });

    this.socket.on('order:updated', (order) => {
      this.updateOrderUI(order);
    });

    this.socket.on('driver:assigned', (event) => {
      this.showDriverInfo(event.order.driver);
    });

    this.socket.on('order:status_changed', (event) => {
      this.updateOrderStatus(event.status);
    });
  }

  trackOrder(orderId) {
    this.socket.emit('join:order', { orderId }, (response) => {
      if (response.success) {
        console.log('Tracking order:', orderId);
      } else {
        console.error('Failed to track:', response.error);
      }
    });
  }

  stopTracking(orderId) {
    this.socket.emit('leave:order', { orderId });
  }

  disconnect() {
    this.socket.disconnect();
  }
}

// الاستخدام
const tracker = new OrderTracking(userToken);
tracker.trackOrder('507f1f77bcf86cd799439011');
```

### مثال 2: تطبيق سائق (Driver App)

```javascript
class DriverService {
  constructor(token) {
    this.socket = io('http://localhost:3000/drivers', {
      auth: { token }
    });
    this.setupListeners();
    this.startLocationTracking();
  }

  setupListeners() {
    this.socket.on('connected', (data) => {
      console.log('Driver connected:', data.driverId);
    });

    this.socket.on('order:new', (data) => {
      this.handleNewOrder(data.order);
    });

    this.socket.on('order:cancelled', (data) => {
      this.handleOrderCancelled(data);
    });
  }

  startLocationTracking() {
    // إرسال الموقع كل 5 ثوان
    this.locationInterval = setInterval(() => {
      navigator.geolocation.getCurrentPosition((position) => {
        this.socket.emit('driver:location', {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          heading: position.coords.heading || 0
        }, (response) => {
          if (!response.success) {
            console.error('Location update failed:', response);
          }
        });
      });
    }, 5000);
  }

  setAvailability(isAvailable) {
    this.socket.emit('driver:status', { isAvailable }, (response) => {
      if (response.success) {
        console.log('Status updated successfully');
      }
    });
  }

  stopLocationTracking() {
    if (this.locationInterval) {
      clearInterval(this.locationInterval);
    }
  }

  disconnect() {
    this.stopLocationTracking();
    this.socket.disconnect();
  }
}

// الاستخدام
const driverService = new DriverService(driverToken);
driverService.setAvailability(true);
```

### مثال 3: لوحة التحكم (Admin Dashboard)

```javascript
class AdminDashboard {
  constructor(token) {
    this.socket = io('http://localhost:3000/orders', {
      auth: { token }  // token يجب أن يكون لـ admin
    });
    this.setupAdminListeners();
  }

  setupAdminListeners() {
    // الاشتراك في قناة الإدارة
    this.socket.emit('admin:subscribe', (response) => {
      if (response.success) {
        console.log('Subscribed to admin channel');
      }
    });

    // الاستماع لجميع الطلبات الجديدة
    this.socket.on('order:created', (order) => {
      this.addOrderToList(order);
    });

    // الاستماع لتحديثات جميع الطلبات
    this.socket.on('order:updated', (order) => {
      this.updateOrderInList(order);
    });

    // الاستماع لتحديثات مواقع السائقين
    this.socket.on('driver:location_updated', (data) => {
      this.updateDriverLocation(data.driverId, data.location);
    });

    // الاستماع لتغييرات حالة السائقين
    this.socket.on('driver:status_changed', (data) => {
      this.updateDriverStatus(data.driverId, data.isAvailable);
    });
  }

  addOrderToList(order) {
    // إضافة طلب جديد للقائمة
    console.log('New order:', order);
  }

  updateOrderInList(order) {
    // تحديث طلب في القائمة
    console.log('Order updated:', order);
  }

  updateDriverLocation(driverId, location) {
    // تحديث موقع سائق على الخريطة
    console.log(`Driver ${driverId} at:`, location);
  }

  updateDriverStatus(driverId, isAvailable) {
    // تحديث حالة سائق
    console.log(`Driver ${driverId} available:`, isAvailable);
  }
}

// الاستخدام
const adminDashboard = new AdminDashboard(adminToken);
```

---

## 🚨 معالجة الأخطاء

### الأخطاء الشائعة

```javascript
socket.on('error', (error) => {
  switch (error.code) {
    case 'NO_TOKEN':
      // لا يوجد token
      redirectToLogin();
      break;
      
    case 'INVALID_TOKEN':
      // token غير صالح أو منتهي
      refreshToken().then(newToken => {
        reconnectWithNewToken(newToken);
      });
      break;
      
    case 'RATE_LIMIT_EXCEEDED':
      // تجاوز الحد المسموح
      showMessage('الرجاء الانتظار قليلاً');
      break;
      
    case 'UNAUTHORIZED':
      // ليس لديك صلاحية
      showMessage('ليس لديك صلاحية للوصول');
      break;
      
    default:
      showMessage(error.userMessage || 'حدث خطأ');
  }
});
```

### إعادة الاتصال التلقائي

```javascript
const socket = io('http://localhost:3000/orders', {
  auth: { token },
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionAttempts: 5
});

socket.on('reconnect', (attemptNumber) => {
  console.log(`Reconnected after ${attemptNumber} attempts`);
});

socket.on('reconnect_error', (error) => {
  console.error('Reconnection failed:', error);
});

socket.on('reconnect_failed', () => {
  console.error('Failed to reconnect after all attempts');
  // طلب من المستخدم تسجيل الدخول مرة أخرى
});
```

---

## 🔧 Testing

### اختبار في بيئة التطوير

```bash
# تشغيل السيرفر
npm run start:dev

# في terminal آخر، تشغيل اختبار
node test-websocket.js
```

**test-websocket.js:**
```javascript
const io = require('socket.io-client');

// احصل على token من API
const token = 'your-jwt-token-here';

const socket = io('http://localhost:3000/orders', {
  auth: { token }
});

socket.on('connected', (data) => {
  console.log('✅ Connected:', data);
  
  // اختبار join order
  socket.emit('join:order', { 
    orderId: '507f1f77bcf86cd799439011' 
  }, (response) => {
    console.log('Join order response:', response);
  });
});

socket.on('error', (error) => {
  console.error('❌ Error:', error);
});

socket.on('disconnect', () => {
  console.log('Disconnected');
  process.exit(0);
});
```

---

## 📝 Notes

### ⚠️ مهم:
1. **لا تشارك JWT tokens** - احفظها بشكل آمن
2. **استخدم HTTPS/WSS في الإنتاج** - ليس HTTP/WS
3. **تحقق من expiry** - تأكد من تجديد token قبل انتهاء صلاحيته
4. **احترم Rate Limits** - لا ترسل رسائل بشكل مفرط

### ✅ أفضل الممارسات:
1. أغلق connections عند عدم الحاجة
2. استخدم reconnection للاتصالات طويلة الأمد
3. تعامل مع جميع الأخطاء المحتملة
4. اختبر في بيئة staging أولاً

---

## 📚 Resources

- [Socket.IO Client Documentation](https://socket.io/docs/v4/client-api/)
- [NestJS WebSocket Documentation](https://docs.nestjs.com/websockets/gateways)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)

---

**آخر تحديث:** 14 أكتوبر 2025  
**الإصدار:** 2.0  
**الحالة:** ✅ جاهز للاستخدام

