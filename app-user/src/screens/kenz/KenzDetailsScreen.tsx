import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Share,
  Linking,
} from "react-native";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";

import { RootStackParamList } from "@/types/navigation";
import { KenzItem } from "@/types/types";
import { getKenzDetails, deleteKenz } from "@/api/kenzApi";
import { useAuth } from "@/auth/AuthContext";
import COLORS from "@/constants/colors";

type RouteProps = RouteProp<RootStackParamList, "KenzDetails">;
type NavigationProp = NativeStackNavigationProp<RootStackParamList, "KenzDetails">;

const KenzDetailsScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProps>();
  const { itemId } = route.params;
  const { user } = useAuth();

  const [item, setItem] = useState<KenzItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  const loadItem = useCallback(async () => {
    try {
      setLoading(true);
      const itemData = await getKenzDetails(itemId);
      setItem(itemData);
    } catch (error) {
      console.error("خطأ في تحميل تفاصيل الإعلان:", error);
      Alert.alert("خطأ", "حدث خطأ في تحميل البيانات");
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  }, [itemId, navigation]);

  useEffect(() => {
    loadItem();
  }, [loadItem]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return COLORS.gray;
      case 'pending': return COLORS.orangeDark;
      case 'confirmed': return COLORS.primary;
      case 'completed': return COLORS.success;
      case 'cancelled': return COLORS.danger;
      default: return COLORS.gray;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'draft': return 'مسودة';
      case 'pending': return 'في الانتظار';
      case 'confirmed': return 'متاح';
      case 'completed': return 'مباع';
      case 'cancelled': return 'ملغي';
      default: return status;
    }
  };

  const formatCurrency = (price?: number) => {
    if (!price) return 'غير محدد';
    return `${price.toLocaleString('ar-SA')} ريال`;
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'غير محدد';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('ar-SA', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateString;
    }
  };

  const getCategoryIcon = (category?: string) => {
    if (!category) return "storefront-outline";

    switch (category) {
      case 'إلكترونيات': return "phone-portrait-outline";
      case 'سيارات': return "car-outline";
      case 'عقارات': return "home-outline";
      case 'أثاث': return "bed-outline";
      case 'ملابس': return "shirt-outline";
      case 'رياضة': return "football-outline";
      case 'كتب': return "book-outline";
      case 'خدمات': return "briefcase-outline";
      case 'وظائف': return "business-outline";
      case 'حيوانات': return "paw-outline";
      default: return "storefront-outline";
    }
  };

  const handleEdit = () => {
    if (item) {
      navigation.navigate('KenzEdit', { itemId: item._id });
    }
  };

  const handleDelete = () => {
    Alert.alert(
      "تأكيد الحذف",
      "هل أنت متأكد من حذف هذا الإعلان؟ لا يمكن التراجع عن هذا الإجراء.",
      [
        { text: "إلغاء", style: "cancel" },
        {
          text: "حذف",
          style: "destructive",
          onPress: async () => {
            if (!item) return;

            setDeleting(true);
            try {
              await deleteKenz(item._id);
              Alert.alert("نجح", "تم حذف الإعلان بنجاح", [
                {
                  text: "موافق",
                  onPress: () => navigation.goBack(),
                },
              ]);
            } catch (error) {
              console.error("خطأ في حذف الإعلان:", error);
              Alert.alert("خطأ", "حدث خطأ أثناء حذف الإعلان");
            } finally {
              setDeleting(false);
            }
          },
        },
      ]
    );
  };

  const handleShare = async () => {
    if (!item) return;

    try {
      const message = `إعلان في كنز: ${item.title}\n\n${item.description || ''}\n\nالسعر: ${formatCurrency(item.price)}\nالفئة: ${item.category || 'غير محدد'}\n${item.metadata ? `\nالتفاصيل: ${Object.entries(item.metadata).map(([key, value]) => `${key}: ${value}`).join(', ')}` : ''}\n\nالحالة: ${getStatusText(item.status)}\n\nتاريخ النشر: ${formatDate(item.createdAt)}`;

      await Share.share({
        message,
        title: item.title,
      });
    } catch (error) {
      console.error("خطأ في المشاركة:", error);
    }
  };

  const handleCall = () => {
    if (!item?.metadata?.contact) return;

    const phoneNumber = item.metadata.contact.replace(/\D/g, '');
    const url = `tel:+966${phoneNumber}`;

    Linking.canOpenURL(url)
      .then((supported) => {
        if (supported) {
          Linking.openURL(url);
        } else {
          Alert.alert("خطأ", "لا يمكن إجراء المكالمة من هذا الجهاز");
        }
      })
      .catch((err) => console.error("خطأ في فتح تطبيق الهاتف:", err));
  };

  const isOwner = user && item && item.ownerId === user.uid;

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>جاري تحميل التفاصيل...</Text>
      </View>
    );
  }

  if (!item) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>لم يتم العثور على الإعلان</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>تفاصيل الإعلان</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
            <Ionicons name="share-outline" size={20} color={COLORS.text} />
          </TouchableOpacity>
          {isOwner && (
            <>
              <TouchableOpacity style={styles.actionButton} onPress={handleEdit}>
                <Ionicons name="pencil" size={20} color={COLORS.text} />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={handleDelete}
                disabled={deleting}
              >
                {deleting ? (
                  <ActivityIndicator size="small" color={COLORS.danger} />
                ) : (
                  <Ionicons name="trash-outline" size={20} color={COLORS.danger} />
                )}
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Header Info */}
          <View style={styles.infoHeader}>
            <View style={styles.categoryContainer}>
              <Ionicons
                name={getCategoryIcon(item.category)}
                size={20}
                color={COLORS.primary}
              />
              <Text style={styles.categoryText}>{item.category || 'غير مصنف'}</Text>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
              <Text style={styles.statusText}>{getStatusText(item.status)}</Text>
            </View>
          </View>

          {/* Title */}
          <Text style={styles.title}>{item.title}</Text>

          {/* Price */}
          {item.price && (
            <View style={styles.priceSection}>
              <Text style={styles.sectionTitle}>السعر</Text>
              <Text style={styles.priceText}>{formatCurrency(item.price)}</Text>
            </View>
          )}

          {/* Description */}
          {item.description && (
            <Text style={styles.description}>{item.description}</Text>
          )}

          {/* Category */}
          {item.category && (
            <View style={styles.categorySection}>
              <Text style={styles.sectionTitle}>الفئة</Text>
              <View style={styles.categoryDisplay}>
                <Ionicons
                  name={getCategoryIcon(item.category)}
                  size={20}
                  color={COLORS.primary}
                />
                <Text style={styles.categoryValue}>{item.category}</Text>
              </View>
            </View>
          )}

          {/* Metadata */}
          {item.metadata && Object.keys(item.metadata).length > 0 && (
            <View style={styles.metadataSection}>
              <Text style={styles.sectionTitle}>تفاصيل إضافية</Text>
              {Object.entries(item.metadata).map(([key, value]) => (
                <View key={key} style={styles.metadataItem}>
                  <Text style={styles.metadataLabel}>{key}:</Text>
                  <Text style={styles.metadataValue}>{String(value)}</Text>
                </View>
              ))}
              {item.metadata.contact && (
                <TouchableOpacity style={styles.contactButton} onPress={handleCall}>
                  <Ionicons name="call-outline" size={16} color={COLORS.primary} />
                  <Text style={styles.contactText}>اتصال بالبائع</Text>
                  <Ionicons name="open-outline" size={16} color={COLORS.primary} />
                </TouchableOpacity>
              )}
            </View>
          )}

          {/* Dates */}
          <View style={styles.datesSection}>
            <Text style={styles.sectionTitle}>تواريخ مهمة</Text>
            <View style={styles.dateItem}>
              <Text style={styles.dateLabel}>تاريخ النشر:</Text>
              <Text style={styles.dateValue}>
                {formatDate(item.createdAt)}
              </Text>
            </View>
            <View style={styles.dateItem}>
              <Text style={styles.dateLabel}>آخر تحديث:</Text>
              <Text style={styles.dateValue}>
                {formatDate(item.updatedAt)}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: COLORS.textLight,
  },
  errorText: {
    fontSize: 16,
    color: COLORS.danger,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    textAlign: 'center',
  },
  headerActions: {
    flexDirection: 'row',
  },
  actionButton: {
    padding: 8,
    marginLeft: 8,
  },
  scrollContainer: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  infoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  categoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.lightBlue,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.primary,
    marginLeft: 6,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.white,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 16,
    lineHeight: 32,
  },
  priceSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 12,
  },
  priceText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.success,
    textAlign: 'center',
    backgroundColor: COLORS.lightGreen,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  description: {
    fontSize: 16,
    color: COLORS.text,
    lineHeight: 24,
    marginBottom: 24,
  },
  categorySection: {
    marginBottom: 24,
  },
  categoryDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.lightGray,
    padding: 12,
    borderRadius: 8,
  },
  categoryValue: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.primary,
    marginLeft: 8,
  },
  metadataSection: {
    marginBottom: 24,
  },
  metadataItem: {
    flexDirection: 'row',
    marginBottom: 8,
    padding: 8,
    backgroundColor: COLORS.white,
    borderRadius: 6,
  },
  metadataLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    width: 80,
  },
  metadataValue: {
    fontSize: 14,
    color: COLORS.textLight,
    flex: 1,
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.lightBlue,
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  contactText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.primary,
    marginHorizontal: 8,
  },
  datesSection: {
    marginBottom: 24,
  },
  dateItem: {
    flexDirection: 'row',
    marginBottom: 8,
    padding: 8,
    backgroundColor: COLORS.white,
    borderRadius: 6,
  },
  dateLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    width: 100,
  },
  dateValue: {
    fontSize: 14,
    color: COLORS.textLight,
    flex: 1,
  },
});

export default KenzDetailsScreen;
