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
} from "react-native";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";

import { RootStackParamList } from "@/types/navigation";
import { KawaderItem } from "@/types/types";
import { getKawaderDetails, deleteKawader } from "@/api/kawaderApi";
import { useAuth } from "@/auth/AuthContext";
import COLORS from "@/constants/colors";

type RouteProps = RouteProp<RootStackParamList, "KawaderDetails">;
type NavigationProp = NativeStackNavigationProp<RootStackParamList, "KawaderDetails">;

const KawaderDetailsScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProps>();
  const { itemId } = route.params;
  const { user } = useAuth();

  const [item, setItem] = useState<KawaderItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  const loadItem = useCallback(async () => {
    try {
      setLoading(true);
      const itemData = await getKawaderDetails(itemId);
      setItem(itemData);
    } catch (error) {
      console.error("خطأ في تحميل تفاصيل الكادر:", error);
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
      case 'confirmed': return 'مؤكد';
      case 'completed': return 'مكتمل';
      case 'cancelled': return 'ملغي';
      default: return status;
    }
  };

  const formatCurrency = (amount?: number) => {
    if (!amount) return 'غير محدد';
    return `${amount.toLocaleString('ar-SA')} ريال`;
  };

  const handleEdit = () => {
    if (item) {
      navigation.navigate('KawaderEdit', { itemId: item._id });
    }
  };

  const handleDelete = () => {
    Alert.alert(
      "تأكيد الحذف",
      "هل أنت متأكد من حذف هذا العرض الوظيفي؟ لا يمكن التراجع عن هذا الإجراء.",
      [
        { text: "إلغاء", style: "cancel" },
        {
          text: "حذف",
          style: "destructive",
          onPress: async () => {
            if (!item) return;

            setDeleting(true);
            try {
              await deleteKawader(item._id);
              Alert.alert("نجح", "تم حذف العرض الوظيفي بنجاح", [
                {
                  text: "موافق",
                  onPress: () => navigation.goBack(),
                },
              ]);
            } catch (error) {
              console.error("خطأ في حذف الكادر:", error);
              Alert.alert("خطأ", "حدث خطأ أثناء حذف العرض الوظيفي");
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
      const message = `عرض وظيفي: ${item.title}\n\n${item.description || ''}\n\nالنطاق: ${item.scope || 'غير محدد'}\nالميزانية: ${formatCurrency(item.budget)}\n${item.metadata?.location ? `الموقع: ${item.metadata.location}\n` : ''}${item.metadata?.remote ? 'متاح العمل عن بعد\n' : ''}${item.metadata?.experience ? `الخبرة المطلوبة: ${item.metadata.experience}\n` : ''}${item.metadata?.skills && item.metadata.skills.length > 0 ? `المهارات: ${item.metadata.skills.join(', ')}\n` : ''}\nالحالة: ${getStatusText(item.status)}\n\nتاريخ النشر: ${new Date(item.createdAt).toLocaleDateString('ar-SA')}`;

      await Share.share({
        message,
        title: item.title,
      });
    } catch (error) {
      console.error("خطأ في المشاركة:", error);
    }
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
        <Text style={styles.errorText}>لم يتم العثور على العرض الوظيفي</Text>
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
        <Text style={styles.headerTitle}>تفاصيل العرض الوظيفي</Text>
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
            <View style={styles.budgetContainer}>
              <Text style={styles.budgetText}>{formatCurrency(item.budget)}</Text>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
              <Text style={styles.statusText}>{getStatusText(item.status)}</Text>
            </View>
          </View>

          {/* Title */}
          <Text style={styles.title}>{item.title}</Text>

          {/* Description */}
          {item.description && (
            <Text style={styles.description}>{item.description}</Text>
          )}

          {/* Scope */}
          {item.scope && (
            <View style={styles.scopeSection}>
              <Text style={styles.sectionTitle}>نطاق العمل</Text>
              <View style={styles.scopeContainer}>
                <Ionicons name="briefcase-outline" size={20} color={COLORS.primary} />
                <Text style={styles.scopeText}>{item.scope}</Text>
              </View>
            </View>
          )}

          {/* Metadata */}
          {item.metadata && (
            <View style={styles.metadataSection}>
              <Text style={styles.sectionTitle}>متطلبات العمل</Text>

              {item.metadata.experience && (
                <View style={styles.metadataItem}>
                  <Ionicons name="school-outline" size={16} color={COLORS.textLight} />
                  <Text style={styles.metadataLabel}>الخبرة المطلوبة:</Text>
                  <Text style={styles.metadataValue}>{item.metadata.experience}</Text>
                </View>
              )}

              {item.metadata.skills && item.metadata.skills.length > 0 && (
                <View style={styles.skillsContainer}>
                  <Ionicons name="construct-outline" size={16} color={COLORS.textLight} />
                  <Text style={styles.skillsTitle}>المهارات المطلوبة:</Text>
                  <View style={styles.skillsList}>
                    {item.metadata.skills.map((skill, index) => (
                      <Text key={index} style={styles.skill}>
                        {skill}
                      </Text>
                    ))}
                  </View>
                </View>
              )}

              {item.metadata.location && (
                <View style={styles.metadataItem}>
                  <Ionicons name="location-outline" size={16} color={COLORS.textLight} />
                  <Text style={styles.metadataLabel}>الموقع:</Text>
                  <Text style={styles.metadataValue}>
                    {item.metadata.location}
                    {item.metadata.remote && ' (متاح العمل عن بعد)'}
                  </Text>
                </View>
              )}

              {item.metadata.remote && !item.metadata.location && (
                <View style={styles.metadataItem}>
                  <Ionicons name="home-outline" size={16} color={COLORS.textLight} />
                  <Text style={styles.metadataLabel}>نوع العمل:</Text>
                  <Text style={styles.metadataValue}>عن بعد</Text>
                </View>
              )}
            </View>
          )}

          {/* Dates */}
          <View style={styles.datesSection}>
            <Text style={styles.sectionTitle}>تواريخ مهمة</Text>
            <View style={styles.dateItem}>
              <Text style={styles.dateLabel}>تاريخ النشر:</Text>
              <Text style={styles.dateValue}>
                {new Date(item.createdAt).toLocaleDateString('ar-SA', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </Text>
            </View>
            <View style={styles.dateItem}>
              <Text style={styles.dateLabel}>آخر تحديث:</Text>
              <Text style={styles.dateValue}>
                {new Date(item.updatedAt).toLocaleDateString('ar-SA', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
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
  budgetContainer: {
    backgroundColor: COLORS.lightGreen,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  budgetText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.success,
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
  description: {
    fontSize: 16,
    color: COLORS.text,
    lineHeight: 24,
    marginBottom: 24,
  },
  scopeSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 12,
  },
  scopeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.lightGray,
    padding: 12,
    borderRadius: 8,
  },
  scopeText: {
    fontSize: 16,
    color: COLORS.primary,
    fontWeight: '500',
    marginLeft: 8,
  },
  metadataSection: {
    marginBottom: 24,
  },
  metadataItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    padding: 8,
    backgroundColor: COLORS.white,
    borderRadius: 6,
  },
  metadataLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginLeft: 8,
    flex: 1,
  },
  metadataValue: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '500',
  },
  skillsContainer: {
    backgroundColor: COLORS.white,
    padding: 12,
    borderRadius: 8,
  },
  skillsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 8,
    marginLeft: 24,
  },
  skillsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginLeft: 24,
  },
  skill: {
    fontSize: 12,
    color: COLORS.primary,
    backgroundColor: COLORS.lightBlue,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 6,
    marginBottom: 4,
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

export default KawaderDetailsScreen;
