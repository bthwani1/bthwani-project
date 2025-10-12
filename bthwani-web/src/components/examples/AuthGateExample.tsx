import React from "react";
import { Button, Box, Typography, Card, CardContent } from "@mui/material";
import { useAuthGate } from "../../hooks/useAuthGate";
import AuthRequiredModal from "../auth/AuthRequiredModal";
import { Favorite, ShoppingCart } from "@mui/icons-material";

/**
 * مثال على استخدام useAuthGate و AuthRequiredModal
 *
 * هذا المكون يوضح كيفية استخدام نظام التحقق من المصادقة
 * في الأزرار التي تحتاج إلى تسجيل دخول المستخدم
 */
const AuthGateExample: React.FC = () => {
  const { ensureAuth, askAuthOpen, setAskAuthOpen } = useAuthGate();

  const handleAddToFavorites = (productId: string) => {
    ensureAuth(() => {
      // الفعل الفعلي هنا للمستخدم المسجّل
      console.log("Adding to favorites:", productId);
      // هنا يمكنك استدعاء API لإضافة المنتج للمفضلة
      // addToFavorites(productId);
    });
  };

  const handleProceedToPayment = () => {
    ensureAuth(() => {
      // الفعل الفعلي هنا للمستخدم المسجّل
      console.log("Proceeding to payment");
      // هنا يمكنك توجيه المستخدم لصفحة الدفع
      // navigate("/checkout");
    });
  };

  const handleAddToCart = (productId: string, quantity: number) => {
    ensureAuth(() => {
      // الفعل الفعلي هنا للمستخدم المسجّل
      console.log("Adding to cart:", productId, "quantity:", quantity);
      // هنا يمكنك استدعاء API لإضافة المنتج للسلة
      // addToCart(productId, quantity);
    });
  };

  return (
    <Box sx={{ p: 3, maxWidth: 600, mx: 'auto' }}>
      <Typography variant="h5" gutterBottom>
        مثال استخدام نظام التحقق من المصادقة
      </Typography>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            منتج تجريبي: هاتف ذكي
          </Typography>
          <Typography variant="body1" color="text.secondary" gutterBottom>
            سعر: 2,500 ريال
          </Typography>

          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mt: 2 }}>
            <Button
              onClick={() => handleAddToFavorites("product123")}
              variant="outlined"
              startIcon={<Favorite />}
              color="error"
            >
              إضافة للمفضلة
            </Button>

            <Button
              onClick={() => handleAddToCart("product123", 1)}
              variant="outlined"
              startIcon={<ShoppingCart />}
            >
              إضافة للسلة
            </Button>

            <Button
              onClick={handleProceedToPayment}
              variant="contained"
              color="primary"
              size="large"
            >
              متابعة للدفع
            </Button>
          </Box>
        </CardContent>
      </Card>

      <Typography variant="body2" color="text.secondary">
        <strong>كيف يعمل:</strong><br />
        • إذا كان المستخدم مسجل دخوله: يتم تنفيذ الفعل مباشرة<br />
        • إذا لم يكن المستخدم مسجل دخوله: يظهر مودال يطلب منه تسجيل الدخول أو إنشاء حساب<br />
        • بعد تسجيل الدخول، يتم إعادة توجيه المستخدم لنفس الصفحة وسيتم حفظ العمل المطلوب للتنفيذ
      </Typography>

      {/* مودال التحقق من المصادقة */}
      <AuthRequiredModal
        open={askAuthOpen}
        onClose={() => setAskAuthOpen(false)}
      />
    </Box>
  );
};

export default AuthGateExample;
