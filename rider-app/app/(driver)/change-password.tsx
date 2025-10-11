// app/(driver)/change-password.tsx
import React, { useState } from "react";
import { Alert, Button, StyleSheet, TextInput, View } from "react-native";
import { changePassword } from "@/api/profile";

export default function ChangePasswordScreen() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleSubmit = async () => {
    try {
      await changePassword(oldPassword, newPassword);
      Alert.alert("تم التحديث", "تم تغيير كلمة المرور بنجاح");
    } catch {
      Alert.alert("خطأ", "فشل في تغيير كلمة المرور");
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="كلمة المرور القديمة"
        secureTextEntry
        style={styles.input}
        value={oldPassword}
        onChangeText={setOldPassword}
      />
      <TextInput
        placeholder="كلمة المرور الجديدة"
        secureTextEntry
        style={styles.input}
        value={newPassword}
        onChangeText={setNewPassword}
      />
      <Button title="تغيير كلمة المرور" onPress={handleSubmit} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
  },
});
