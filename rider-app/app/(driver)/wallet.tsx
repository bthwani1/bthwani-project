// app/(driver)/wallet.tsx
import { getWalletSummary } from "@/api/driver";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { COLORS } from "../../constants/colors";

interface WalletData {
  balance: number;
  totalEarnings: number;
  todayEarnings: number;
  weeklyEarnings: number;
  pendingPayments: number;
}

export default function WalletScreen() {
  const [walletData, setWalletData] = useState<WalletData>({
    balance: 0,
    totalEarnings: 0,
    todayEarnings: 0,
    weeklyEarnings: 0,
    pendingPayments: 0,
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadWalletData = async () => {
    try {
      setLoading(true);
      const data = await getWalletSummary();

      setWalletData({
        balance: data.balance || 0,
        totalEarnings: data.totalEarnings || 0,
        todayEarnings: data.todayEarnings || 0,
        weeklyEarnings: data.weeklyEarnings || 0,
        pendingPayments: data.pendingPayments || 0,
      });
    } catch (error) {
      console.error("❌ خطأ في تحميل بيانات المحفظة:", error);
      Alert.alert("خطأ", "فشل في تحميل بيانات المحفظة");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadWalletData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadWalletData();
  };

  const handleWithdraw = () => {
    Alert.alert(
      "سحب الأموال",
      "هذه الميزة ستكون متاحة قريباً",
      [{ text: "حسناً" }]
    );
  };

  const handleTransactionHistory = () => {
    Alert.alert(
      "سجل المعاملات",
      "هذه الميزة ستكون متاحة قريباً",
      [{ text: "حسناً" }]
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>جارٍ تحميل بيانات المحفظة...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={[COLORS.primary]}
          tintColor={COLORS.primary}
        />
      }
      showsVerticalScrollIndicator={false}
    >
      {/* Balance Card */}
      <View style={styles.balanceCard}>
        <View style={styles.balanceHeader}>
          <Ionicons name="wallet" size={28} color="#fff" />
          <Text style={styles.balanceTitle}>رصيدك الحالي</Text>
        </View>
        <Text style={styles.balanceAmount}>
          {walletData.balance.toLocaleString()} ﷼
        </Text>
        <Text style={styles.balanceSubtitle}>متاح للسحب</Text>
      </View>

      {/* Stats Cards */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Ionicons name="today" size={24} color={COLORS.primary} />
          <Text style={styles.statLabel}>اليوم</Text>
          <Text style={styles.statValue}>
            {walletData.todayEarnings.toFixed(2)} ﷼
          </Text>
        </View>

        <View style={styles.statCard}>
          <Ionicons name="calendar" size={24} color={COLORS.success} />
          <Text style={styles.statLabel}>هذا الأسبوع</Text>
          <Text style={styles.statValue}>
            {walletData.weeklyEarnings.toFixed(2)} ﷼
          </Text>
        </View>

        <View style={styles.statCard}>
          <Ionicons name="time" size={24} color={COLORS.orangeDark} />
          <Text style={styles.statLabel}>معلق</Text>
          <Text style={styles.statValue}>
            {walletData.pendingPayments.toFixed(2)} ﷼
          </Text>
        </View>
      </View>

      {/* Total Earnings */}
      <View style={styles.totalCard}>
        <Ionicons name="trophy" size={24} color={COLORS.primary} />
        <View style={styles.totalContent}>
          <Text style={styles.totalLabel}>إجمالي الأرباح</Text>
          <Text style={styles.totalValue}>
            {walletData.totalEarnings.toLocaleString()} ﷼
          </Text>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleWithdraw}
          activeOpacity={0.8}
        >
          <Ionicons name="arrow-down-circle" size={20} color="#fff" />
          <Text style={styles.actionButtonText}>سحب الأموال</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButtonSecondary}
          onPress={handleTransactionHistory}
          activeOpacity={0.8}
        >
          <Ionicons name="document-text" size={20} color={COLORS.primary} />
          <Text style={styles.actionButtonTextSecondary}>سجل المعاملات</Text>
        </TouchableOpacity>
      </View>

      {/* Info Section */}
      <View style={styles.infoContainer}>
        <Text style={styles.infoTitle}>معلومات مهمة</Text>
        <View style={styles.infoItem}>
          <Ionicons name="information-circle" size={20} color={COLORS.blue} />
          <Text style={styles.infoText}>
            يتم تحديث الرصيد يومياً في الساعة 12:00 صباحاً
          </Text>
        </View>
        <View style={styles.infoItem}>
          <Ionicons name="shield-checkmark" size={20} color={COLORS.success} />
          <Text style={styles.infoText}>
            جميع المعاملات محمية وآمنة
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.background,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: COLORS.gray,
    fontFamily: "Cairo-Regular",
  },
  balanceCard: {
    backgroundColor: COLORS.primary,
    margin: 20,
    padding: 24,
    borderRadius: 20,
    alignItems: "center",
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  balanceHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  balanceTitle: {
    color: "#fff",
    fontSize: 18,
    fontFamily: "Cairo-Bold",
    marginLeft: 12,
  },
  balanceAmount: {
    color: "#fff",
    fontSize: 42,
    fontFamily: "Cairo-Bold",
    fontWeight: "700",
    marginBottom: 8,
  },
  balanceSubtitle: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 14,
    fontFamily: "Cairo-Regular",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 20,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.background,
    marginHorizontal: 4,
    padding: 16,
    borderRadius: 16,
    alignItems: "center",
    shadowColor: COLORS.blue,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.gray,
    fontFamily: "Cairo-Regular",
    marginTop: 8,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 16,
    fontFamily: "Cairo-Bold",
    color: COLORS.text,
  },
  totalCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.lightGray,
    marginHorizontal: 20,
    marginBottom: 24,
    padding: 20,
    borderRadius: 16,
  },
  totalContent: {
    flex: 1,
    marginLeft: 16,
  },
  totalLabel: {
    fontSize: 14,
    color: COLORS.gray,
    fontFamily: "Cairo-Regular",
    marginBottom: 4,
  },
  totalValue: {
    fontSize: 20,
    fontFamily: "Cairo-Bold",
    color: COLORS.primary,
  },
  actionsContainer: {
    marginHorizontal: 20,
    marginBottom: 24,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.success,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: COLORS.success,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  actionButtonSecondary: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.background,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  actionButtonText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Cairo-Bold",
    marginLeft: 8,
  },
  actionButtonTextSecondary: {
    color: COLORS.primary,
    fontSize: 16,
    fontFamily: "Cairo-Bold",
    marginLeft: 8,
  },
  infoContainer: {
    marginHorizontal: 20,
    marginBottom: 40,
  },
  infoTitle: {
    fontSize: 18,
    fontFamily: "Cairo-Bold",
    color: COLORS.text,
    marginBottom: 16,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
    padding: 12,
    backgroundColor: COLORS.lightGray,
    borderRadius: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: COLORS.text,
    fontFamily: "Cairo-Regular",
    marginLeft: 12,
    lineHeight: 20,
  },
});
