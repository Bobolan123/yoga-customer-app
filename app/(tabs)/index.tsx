import { db } from "@/common/firebaseConfig";
import { IClassInstance, IYogaClass } from "@/common/interface";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { Button, Input, Toast, WhiteSpace } from "@ant-design/react-native";
import { AntDesign } from "@expo/vector-icons";
import Feather from "@expo/vector-icons/Feather";
import { useRouter } from "expo-router";
import { collection, getDocs } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function ClassesScreen() {
  const { cart, addToCart, removeFromCart } = useCart();
  const { logout } = useAuth();
  const [classes, setClasses] = useState<IYogaClass[]>([]);
  const [search, setSearch] = useState("");
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const classSnapshot = await getDocs(collection(db, "classes"));
        const result: IYogaClass[] = [];

        for (const classDoc of classSnapshot.docs) {
          const classData = classDoc.data();
          const classId = parseInt(classDoc.id);

          const instancesSnapshot = await getDocs(
            collection(db, "classes", classDoc.id, "instances")
          );

          const instances: IClassInstance[] = instancesSnapshot.docs.map((doc) => {
            const data = doc.data();
            return {
              id: parseInt(doc.id),
              date: data.date,
              teacher: data.teacher,
              comment: data.comment,
            };
          });

          result.push({
            id: classId,
            day: classData.day,
            time: classData.time,
            capacity: classData.capacity,
            duration: classData.duration,
            price: classData.price,
            type: classData.type,
            description: classData.description,
            instances,
          });
        }

        setClasses(result);
      } catch (err) {
        console.error("Fetch error:", err);
        Toast.fail("Failed to load data", 2);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredClasses = classes.filter((c) => {
    const term = search.toLowerCase();
    return (
      c.day.toLowerCase().includes(term) ||
      c.time.toLowerCase().includes(term) ||
      c.type.toLowerCase().includes(term) ||
      c.instances.some((i) => i.teacher.toLowerCase().includes(term))
    );
  });

  const isInCart = (classId: number) => cart.some((item) => item.classId === classId);

  const toggleClassInCart = (classItem: IYogaClass) => {
    if (classItem.instances.length === 0) {
      Toast.info("This class has no available instances", 1);
      return;
    }

    if (isInCart(classItem.id)) {
      removeFromCart(classItem.id);
      Toast.info("Removed class from cart", 1);
    } else {
      addToCart({ classId: classItem.id, classData: classItem });
      Toast.success("Class added to cart", 1);
    }
  };

  const toggleExpand = (id: number) => {
    setExpanded((prev) => (prev === id ? null : id));
  };

  const handleLogout = async () => {
    await logout();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inner}>
        <View style={styles.headerContainer}>
          <Text style={styles.header}>🧘 Browse Yoga Classes</Text>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <Feather name="log-out" size={24} color="#666" />
          </TouchableOpacity>
        </View>
        <Input
          placeholder="Search by type, teacher, day or time"
          value={search}
          onChangeText={setSearch}
        />
        <WhiteSpace size="lg" />
        <FlatList
          data={filteredClasses}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.classCard}>
              <TouchableOpacity
                onPress={() => toggleExpand(item.id)}
                style={styles.classHeader}
              >
                <Text style={styles.classTitle}>Class #{item.id}</Text>
                <TouchableOpacity
                  onPress={() => toggleClassInCart(item)}
                  disabled={item.instances.length === 0}
                >
                  {item.instances.length > 0 ? (
                    <AntDesign
                      name={isInCart(item.id) ? "checkcircle" : "pluscircleo"}
                      size={22}
                      color={isInCart(item.id) ? "green" : "gray"}
                    />
                  ) : (
                    <Text style={{ fontSize: 12, color: "gray" }}>
                      No instances
                    </Text>
                  )}
                </TouchableOpacity>
              </TouchableOpacity>

              <Text style={styles.classDetails}>🧘 Type: {item.type}</Text>
              <Text style={styles.classDetails}>📅 {item.day} at {item.time}</Text>
              <Text style={styles.classDetails}>💰 ${item.price.toFixed(2)}</Text>
              <Text style={styles.classDetails}>⏱ Duration: {item.duration}</Text>
              <Text style={styles.classDetails}>👥 Capacity: {item.capacity}</Text>

              {expanded === item.id &&
                item.instances.map((inst) => (
                  <View key={inst.id} style={styles.tableRow}>
                    <View style={styles.tableTextContainer}>
                      <Text style={styles.instanceText}>
                        ▶️ Instance #{inst.id}
                      </Text>
                      <Text style={styles.teacherText}>👩‍🏫 {inst.teacher}</Text>
                      <Text style={styles.dateText}>📅 {inst.date}</Text>
                    </View>
                  </View>
                ))}
            </View>
          )}
        />
        <WhiteSpace size="lg" />
        <Button
          type="primary"
          style={{ alignSelf: "center", width: "100%" }}
          onPress={() => router.push("/cart")}
        >
          Go to Cart
        </Button>
        <WhiteSpace size="lg" />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    paddingBottom: 20,
    backgroundColor: "#fff",
  },
  inner: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
  },
  logoutButton: {
    padding: 8,
  },
  classCard: {
    marginBottom: 16,
    backgroundColor: "#f9f9f9",
    padding: 14,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  classHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  classTitle: {
    fontWeight: "bold",
    fontSize: 17,
  },
  classDetails: {
    marginBottom: 4,
    fontSize: 14,
  },
  tableRow: {
    paddingVertical: 6,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    marginTop: 6,
    marginLeft: 4,
  },
  tableTextContainer: {
    flexDirection: "column",
    paddingLeft: 4,
  },
  instanceText: {
    fontWeight: "600",
    fontSize: 14,
  },
  teacherText: {
    fontSize: 13,
    marginTop: 2,
  },
  dateText: {
    fontSize: 12,
    color: "#666",
    marginTop: 1,
  },
});
