import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  Linking,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS } from "../constants/colors";
interface FAQ {
  id: string;
  question: string;
  answer: string;
}

interface ChatMessage {
  id: string;
  text: string;
  sender: "user" | "support";
  timestamp: Date;
}

interface SupportChat {
  id: string;
  title: string;
  messages: ChatMessage[];
  lastMessage: Date;
  status: "open" | "closed";
}

const SupportScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"faq" | "chat" | "history">("faq");
  const [chatModalVisible, setChatModalVisible] = useState(false);
  const [currentChat, setCurrentChat] = useState<SupportChat | null>(null);
  const [messageText, setMessageText] = useState("");
  const [chats, setChats] = useState<SupportChat[]>([]);
  const [historyModalVisible, setHistoryModalVisible] = useState(false);
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);

  const faqs: FAQ[] = [
    {
      id: "1",
      question: "كيف أطلب تصفية رصيدي؟",
      answer:
        'يمكنك طلب التصفية من خلال صفحة "المحفظة" ثم اختيار "تصفية الرصيد". سيتم تحويل المبلغ إلى حسابك البنكي خلال 3-5 أيام عمل.',
    },
    {
      id: "2",
      question: "ماذا أفعل إذا لم يصل الرصيد إلى حسابي؟",
      answer:
        "يرجى التحقق من رقم الحساب البنكي المسجل لدينا. إذا كان صحيحًا، تواصل مع الدعم الفني وسنقوم بالتحقق من العملية خلال 24 ساعة.",
    },
    {
      id: "3",
      question: "ما هو الحد الأدنى للتصفية؟",
      answer: "الحد الأدنى للتصفية هو 100 ريال سعودي.",
    },
    {
      id: "4",
      question: "كم تستغرق عملية التصفية؟",
      answer: "عادةً ما تستغرق عملية التصفية من 3-5 أيام عمل، حسب سياسة البنك.",
    },
    {
      id: "5",
      question: "هل يمكنني تغيير رقم حسابي البنكي؟",
      answer:
        'نعم، يمكنك تغيير رقم الحساب البنكي من خلال صفحة "الملف الشخصي" ثم "معلومات الحساب البنكي".',
    },
  ];

  useEffect(() => {
    // Load saved chats from AsyncStorage in real app
    loadChats();
  }, []);

  const loadChats = async () => {
    // Mock data - in real app, load from AsyncStorage or API
    const mockChats: SupportChat[] = [
      {
        id: "1",
        title: "استفسار عن التصفية",
        messages: [
          {
            id: "1",
            text: "مرحباً، لدي استفسار عن عملية التصفية",
            sender: "user",
            timestamp: new Date("2024-01-15"),
          },
          {
            id: "2",
            text: "مرحباً! كيف يمكنني مساعدتك؟",
            sender: "support",
            timestamp: new Date("2024-01-15"),
          },
        ],
        lastMessage: new Date("2024-01-15"),
        status: "closed",
      },
    ];
    setChats(mockChats);
  };

  const handleStartChat = () => {
    const newChat: SupportChat = {
      id: Date.now().toString(),
      title: "محادثة جديدة",
      messages: [],
      lastMessage: new Date(),
      status: "open",
    };
    setCurrentChat(newChat);
    setChatModalVisible(true);
  };

  const handleSendMessage = () => {
    if (!messageText.trim()) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      text: messageText,
      sender: "user",
      timestamp: new Date(),
    };

    if (currentChat) {
      const updatedChat = {
        ...currentChat,
        messages: [...currentChat.messages, newMessage],
        lastMessage: new Date(),
      };
      setCurrentChat(updatedChat);

      // Save to chats array
      const updatedChats = chats.filter((chat) => chat.id !== currentChat.id);
      setChats([updatedChat, ...updatedChats]);

      // Simulate support response after 2 seconds
      setTimeout(() => {
        const supportResponse: ChatMessage = {
          id: (Date.now() + 1).toString(),
          text: "شكراً لتواصلك معنا. سيتم الرد عليك خلال وقت قصير من قبل فريق الدعم الفني.",
          sender: "support",
          timestamp: new Date(),
        };

        const chatWithResponse = {
          ...updatedChat,
          messages: [...updatedChat.messages, supportResponse],
        };
        setCurrentChat(chatWithResponse);
        setChats([chatWithResponse, ...updatedChats]);
      }, 2000);
    }

    setMessageText("");
  };

  const handleCallSupport = () => {
    const phoneNumber = "8001234567"; // Replace with actual support number
    Linking.openURL(`tel:${phoneNumber}`);
  };

  const handleEmailSupport = () => {
    const email = "support@bthwina.com"; // Replace with actual support email
    Linking.openURL(`mailto:${email}`);
  };

  const renderFAQ = ({ item }: { item: FAQ }) => {
    const expanded = expandedFAQ === item.id;
    return (
      <TouchableOpacity
        style={styles.faqItem}
        onPress={() => setExpandedFAQ(expanded ? null : item.id)}
      >
        <View style={styles.faqQuestion}>
          <Text style={styles.faqQuestionText}>{item.question}</Text>
          <Ionicons
            name={expanded ? "chevron-up" : "chevron-down"}
            size={20}
            color="#666"
          />
        </View>
        {expanded && (
          <View style={styles.faqAnswer}>
            <Text style={styles.faqAnswerText}>{item.answer}</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const renderChatMessage = ({ item }: { item: ChatMessage }) => (
    <View
      style={[
        styles.messageContainer,
        item.sender === "user" ? styles.userMessage : styles.supportMessage,
      ]}
    >
      <Text style={styles.messageText}>{item.text}</Text>
      <Text style={styles.messageTime}>
        {item.timestamp.toLocaleTimeString("ar-SA")}
      </Text>
    </View>
  );

  const renderChatHistory = ({ item }: { item: SupportChat }) => (
    <TouchableOpacity
      style={styles.historyItem}
      onPress={() => {
        setCurrentChat(item);
        setHistoryModalVisible(false);
        setChatModalVisible(true);
      }}
    >
      <View style={styles.historyHeader}>
        <Text style={styles.historyTitle}>{item.title}</Text>
        <Text
          style={[
            styles.status,
            item.status === "open" ? styles.openStatus : styles.closedStatus,
          ]}
        >
          {item.status === "open" ? "مفتوح" : "مغلق"}
        </Text>
      </View>
      <Text style={styles.historyDate}>
        {item.lastMessage.toLocaleDateString("ar-SA")}
      </Text>
      <Text style={styles.historyPreview}>
        {item.messages[item.messages.length - 1]?.text || "لا توجد رسائل"}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={[COLORS.primary, COLORS.primary]}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>الدعم الفني</Text>
        <Text style={styles.headerSubtitle}>نحن هنا لمساعدتك في أي وقت</Text>
        <TouchableOpacity style={styles.chatButton} onPress={handleStartChat}>
          <LinearGradient
            colors={["#FFFFFF", "#F8F9FA"]}
            style={styles.chatButtonGradient}
          >
            <Ionicons name="chatbubble" size={20} color={COLORS.primary} />
            <Text style={styles.chatButtonText}>تواصل معنا الآن</Text>
          </LinearGradient>
        </TouchableOpacity>
      </LinearGradient>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === "faq" && styles.activeTabButton,
          ]}
          onPress={() => setActiveTab("faq")}
        >
          <Text
            style={[
              styles.tabButtonText,
              activeTab === "faq" && styles.activeTabButtonText,
            ]}
          >
            الأسئلة الشائعة
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === "chat" && styles.activeTabButton,
          ]}
          onPress={() => setActiveTab("chat")}
        >
          <Text
            style={[
              styles.tabButtonText,
              activeTab === "chat" && styles.activeTabButtonText,
            ]}
          >
            المحادثة
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === "history" && styles.activeTabButton,
          ]}
          onPress={() => setActiveTab("history")}
        >
          <Text
            style={[
              styles.tabButtonText,
              activeTab === "history" && styles.activeTabButtonText,
            ]}
          >
            السجل
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {activeTab === "faq" && (
          <View>
            <Text style={styles.sectionTitle}>معلومات التواصل</Text>
            <View style={styles.contactInfo}>
              <TouchableOpacity
                style={styles.contactItem}
                onPress={handleCallSupport}
              >
                <Ionicons name="call" size={24} color={COLORS.primary} />
                <Text style={styles.contactText}>784646014</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.contactItem}
                onPress={handleEmailSupport}
              >
                <Ionicons name="mail" size={24} color={COLORS.primary} />
                <Text style={styles.contactText}>support@bthwina.com</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.sectionTitle}>الأسئلة الشائعة</Text>
            <FlatList
              data={faqs}
              renderItem={renderFAQ}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
            />
          </View>
        )}

        {activeTab === "chat" && (
          <View style={styles.emptyChat}>
            <Ionicons name="chatbubble-outline" size={64} color="#ccc" />
            <Text style={styles.emptyText}>
              ابدأ محادثة جديدة مع فريق الدعم
            </Text>
            <TouchableOpacity
              style={styles.startChatButton}
              onPress={handleStartChat}
            >
              <Text style={styles.startChatText}>ابدأ المحادثة</Text>
            </TouchableOpacity>
          </View>
        )}

        {activeTab === "history" && (
          <View>
            {chats.length === 0 ? (
              <View style={styles.emptyHistory}>
                <Ionicons name="document-text-outline" size={64} color="#ccc" />
                <Text style={styles.emptyText}>لا توجد محادثات سابقة</Text>
              </View>
            ) : (
              <FlatList
                data={chats}
                renderItem={renderChatHistory}
                keyExtractor={(item) => item.id}
              />
            )}
          </View>
        )}
      </ScrollView>

      {/* Chat Modal */}
      <Modal
        animationType="slide"
        transparent={false}
        visible={chatModalVisible}
        onRequestClose={() => setChatModalVisible(false)}
      >
        <View style={styles.chatModalContainer}>
          <View style={styles.chatHeader}>
            <TouchableOpacity onPress={() => setChatModalVisible(false)}>
              <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
            </TouchableOpacity>
            <Text style={styles.chatHeaderTitle}>الدعم الفني</Text>
            <TouchableOpacity onPress={() => setChatModalVisible(false)}>
              <Ionicons name="close" size={24} color={COLORS.primary} />
            </TouchableOpacity>
          </View>

          <FlatList
            data={currentChat?.messages || []}
            renderItem={renderChatMessage}
            keyExtractor={(item) => item.id}
            style={styles.chatMessages}
            inverted
          />

          <View style={styles.chatInputContainer}>
            <TextInput
              style={styles.input}
              placeholder="اكتب رسالتك..."
              value={messageText}
              onChangeText={setMessageText}
              onSubmitEditing={handleSendMessage}
              multiline
            />
            <TouchableOpacity
              style={styles.sendButton}
              onPress={handleSendMessage}
              disabled={!messageText.trim()}
            >
              <Ionicons name="send" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    direction: "rtl",
  },
  header: {
    paddingTop: 50,
    paddingBottom: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  headerTitle: {
    fontSize: 28,
    color: "white",
    marginBottom: 4,
    textAlign: "center",
    fontFamily: "Cairo-Bold",
  },
  headerSubtitle: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.8)",
    fontFamily: "Cairo-Regular",
    textAlign: "center",
    marginBottom: 20,
  },
  chatButton: {
    alignSelf: "center",
    borderRadius: 25,
    overflow: "hidden",
    elevation: 3,
  },
  chatButtonGradient: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  chatButtonText: {
    color: COLORS.primary,
    fontFamily: "Cairo-Bold",
    marginRight: 8,
    fontSize: 16,
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "#fff",
    marginHorizontal: 15,
    marginTop: 15,
    borderRadius: 12,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    overflow: "hidden",
  },
  tabButton: {
    flex: 1,
    paddingVertical: 16,
    alignItems: "center",
    borderBottomWidth: 3,
    borderBottomColor: "transparent",
  },
  activeTabButton: {
    borderBottomColor: COLORS.primary,
    backgroundColor: COLORS.primary + "10",
  },
  tabButtonText: {
    fontSize: 16,
    color: "#666",
    fontFamily: "Cairo-Regular",
  },
  activeTabButtonText: {
    color: COLORS.primary,
    fontFamily: "Cairo-Bold",
  },
  content: {
    flex: 1,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: "Cairo-Bold",
    marginBottom: 15,
    color: COLORS.text,
  },
  contactInfo: {
    marginBottom: 30,
  },
  contactItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  contactText: {
    fontSize: 16,
    color: COLORS.text,
    marginLeft: 10,
    fontFamily: "Cairo-SemiBold",
  },
  faqItem: {
    backgroundColor: "#fff",
    marginBottom: 12,
    borderRadius: 16,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    overflow: "hidden",
  },
  faqQuestion: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 18,
  },
  faqQuestionText: {
    fontSize: 16,
    flex: 1,
    color: COLORS.text,
    fontFamily: "Cairo-SemiBold",
  },
  faqAnswer: {
    padding: 18,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    backgroundColor: "#f8f9fa",
  },
  faqAnswerText: {
    fontSize: 14,
    color: "#666",
    lineHeight: 22,
    fontFamily: "Cairo-Regular",
  },
  emptyChat: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 50,
  },
  emptyHistory: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 50,
  },
  emptyText: {
    textAlign: "center",
    color: "#666",
    fontSize: 16,
    marginTop: 20,
    fontFamily: "Cairo-Regular",
  },
  startChatButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    marginTop: 20,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  startChatText: {
    color: "#fff",
    fontFamily: "Cairo-Bold",
    fontSize: 16,
  },
  historyItem: {
    padding: 18,
    marginBottom: 12,
    borderRadius: 16,
    backgroundColor: "#fff",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  historyHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  historyTitle: {
    fontSize: 16,
    color: COLORS.text,
    fontFamily: "Cairo-SemiBold",
  },
  status: {
    fontSize: 12,
    color: "#666",
    fontFamily: "Cairo-Regular",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  openStatus: {
    backgroundColor: "#10B981",
    color: "#fff",
  },
  closedStatus: {
    backgroundColor: "#6B7280",
    color: "#fff",
  },
  historyDate: {
    fontSize: 12,
    color: "#666",
    marginTop: 5,
    fontFamily: "Cairo-Regular",
  },
  historyPreview: {
    fontSize: 14,
    color: "#666",
    marginTop: 8,
    fontFamily: "Cairo-Regular",
  },
  chatModalContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  chatHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#fff",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  chatHeaderTitle: {
    fontSize: 18,
    fontFamily: "Cairo-Bold",
    color: COLORS.text,
  },
  chatMessages: {
    flex: 1,
    padding: 10,
  },
  messageContainer: {
    maxWidth: "80%",
    padding: 12,
    borderRadius: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  userMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#fff",
  },
  supportMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#fff",
  },
  messageText: {
    fontSize: 14,
    color: "#333",
    fontFamily: "Cairo-Regular",
  },
  messageTime: {
    fontSize: 12,
    color: "#666",
    marginTop: 5,
    fontFamily: "Cairo-Regular",
  },
  chatInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    backgroundColor: "#fff",
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 12,
    maxHeight: 100,
    fontFamily: "Cairo-Regular",
    backgroundColor: "#f8f9fa",
  },
  sendButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 25,
    padding: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
});

export default SupportScreen;
