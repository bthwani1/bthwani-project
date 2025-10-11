// app/(driver)/withdraw/index.tsx
import { requestWithdrawal } from "@/api/driver";
import React, { useState } from "react";
import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function WithdrawScreen() {
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("agent");
  const [accountInfo, setAccountInfo] = useState("");

  const handleWithdraw = async () => {
    try {
      await requestWithdrawal({
        amount: parseFloat(amount),
        method,
        accountInfo,
      });
      Alert.alert("✅ تم إرسال طلب السحب");
      setAmount("");
      setAccountInfo("");
    } catch (e) {
      Alert.alert("❌ فشل في الطلب");
    }
  };

  return (
    <View style={{ padding: 16 }}>
      <Text>المبلغ:</Text>
      <TextInput
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
        style={{ borderWidth: 1, marginBottom: 8, padding: 10, borderRadius: 6 }}
      />

      <Text>طريقة السحب:</Text>
      <TextInput
        placeholder="مثلاً: agent أو bank"
        value={method}
        onChangeText={setMethod}
        style={{ borderWidth: 1, marginBottom: 8, padding: 10, borderRadius: 6 }}
      />

      <Text>معلومات الحساب:</Text>
      <TextInput
        placeholder="رقم الحساب أو رمز الوكيل"
        value={accountInfo}
        onChangeText={setAccountInfo}
        style={{ borderWidth: 1, marginBottom: 8, padding: 10, borderRadius: 6 }}
      />

      <TouchableOpacity
        onPress={handleWithdraw}
        style={{ backgroundColor: "#16a34a", padding: 12, borderRadius: 10 }}
      >
        <Text style={{ color: "#fff", textAlign: "center" }}>💸 طلب سحب</Text>
      </TouchableOpacity>
    </View>
  );
}
