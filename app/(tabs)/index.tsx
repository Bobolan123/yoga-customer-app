import { db } from "@/common/firebaseConfig";
import { Button, Input, Toast, WhiteSpace } from "@ant-design/react-native";
import { AntDesign } from "@expo/vector-icons";
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

interface IClassInstance {
  id: number;
  date: string;
  teacher: string;
  comment?: string;
}

interface IYogaClass {
  id: number;
  day: string;
  time: string;
  capacity: number;
  duration: string;
  price: number;
  type: string;
  description?: string;
  instances: IClassInstance[];
}

export default function ClassesScreen() {
  const [classes, setClasses] = useState<IYogaClass[]>([]);
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState<number[]>([]);
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

  const toggleClassInCart = (classItem: IYogaClass) => {
    const instanceIds = classItem.instances.map((inst) => inst.id);

    if (instanceIds.length === 0) {
      Toast.info("This class has no available instances", 1);
      return;
    }

    const allInCart = instanceIds.every((id) => cart.includes(id));

    if (allInCart) {
      setCart((prev) => prev.filter((id) => !instanceIds.includes(id)));
      Toast.info("Removed class from cart", 1);
    } else {
      setCart((prev) => [...new Set([...prev, ...instanceIds])]);
      Toast.success("Class and its instances added to cart", 1);
    }
  };

  const toggleExpand = (id: number) => {
    setExpanded((prev) => (prev === id ? null : id));
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inner}>
        <Text style={styles.header}>Browse Yoga Classes</Text>
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
                <Text style={styles.classTitle}>Class: {item.id}</Text>
                <TouchableOpacity
                  onPress={() => toggleClassInCart(item)}
                  disabled={item.instances.length === 0}
                >
                  {item.instances.length > 0 ? (
                    <AntDesign
                      name={
                        item.instances.every((inst) => cart.includes(inst.id))
                          ? "checkcircle"
                          : "pluscircleo"
                      }
                      size={20}
                      color={
                        item.instances.every((inst) => cart.includes(inst.id))
                          ? "green"
                          : "gray"
                      }
                    />
                  ) : (
                    <Text style={{ fontSize: 12, color: "gray" }}>
                      No instances
                    </Text>
                  )}
                </TouchableOpacity>
              </TouchableOpacity>
              <Text style={styles.classDetails}>Type: {item.type}</Text>
              <Text style={styles.classDetails}>
                Day: {item.day} at {item.time}
              </Text>
              <Text style={styles.classDetails}>
                Price: ${item.price.toFixed(2)}
              </Text>
              <Text style={styles.classDetails}>
                Duration: {item.duration}
              </Text>
              <Text style={styles.classDetails}>
                Capacity: {item.capacity}
              </Text>
              {expanded === item.id &&
                item.instances.map((inst) => (
                  <View key={inst.id} style={styles.tableRow}>
                    <View style={styles.tableTextContainer}>
                      <Text style={{ fontSize: 14, fontWeight: "600" }}>
                        - Class Instance: {inst.id}
                      </Text>
                      <Text style={styles.teacherText}>
                        Teacher: {inst.teacher}
                      </Text>
                      <Text style={styles.dateText}>Date: {inst.date}</Text>
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
          onPress={() =>
            router.push({
              pathname: "/cart",
              params: { cart: JSON.stringify(cart) },
            })
          }
        >
          Go to Cart ({cart.length})
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
  header: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
  },
  classCard: {
    marginBottom: 16,
    backgroundColor: "#f9f9f9",
    padding: 12,
    borderRadius: 8,
  },
  classHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  classTitle: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 4,
  },
  classDetails: {
    marginBottom: 4,
  },
  tableRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    marginLeft: 10,
  },
  tableTextContainer: {
    flexDirection: "column",
  },
  teacherText: {
    fontSize: 14,
  },
  dateText: {
    fontSize: 12,
    color: "#666",
  },
});
