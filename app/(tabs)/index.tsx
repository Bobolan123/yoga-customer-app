import { db } from "@/common/firebaseConfig";
import { IClassInstance, IYogaClass } from "@/common/interface";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { Colors, Spacing, BorderRadius, Shadows, Typography } from "@/constants/Design";
import { Toast } from "@ant-design/react-native";
import { AntDesign, MaterialIcons, Ionicons } from "@expo/vector-icons";
import Feather from "@expo/vector-icons/Feather";
import { useRouter } from "expo-router";
import { collection, getDocs } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  RefreshControl,
} from "react-native";

export default function ClassesScreen() {
  const { cart, addToCart, removeFromCart } = useCart();
  const { logout } = useAuth();
  const [classes, setClasses] = useState<IYogaClass[]>([]);
  const [search, setSearch] = useState("");
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [expanded, setExpanded] = useState<number | null>(null);

  useEffect(() => {
    const initializeData = async () => {
      setLoading(true);
      await fetchData();
      setLoading(false);
    };

    initializeData();
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

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await fetchData();
    } finally {
      setRefreshing(false);
    }
  };

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
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inner}>
        {/* Header Section */}
        <View style={styles.headerContainer}>
          <View style={styles.headerContent}>
            <Text style={styles.welcomeText}>Welcome!</Text>
            <Text style={styles.headerTitle}>Find Your Perfect Class</Text>
          </View>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <Ionicons name="log-out-outline" size={24} color={Colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Search Section */}
        <View style={styles.searchContainer}>
          <View style={styles.searchWrapper}>
            <Ionicons name="search" size={20} color={Colors.gray[400]} style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search classes, teachers, or days..."
              value={search}
              onChangeText={setSearch}
              placeholderTextColor={Colors.gray[400]}
            />
            {search.length > 0 && (
              <TouchableOpacity onPress={() => setSearch("")} style={styles.clearButton}>
                <Ionicons name="close-circle" size={20} color={Colors.gray[400]} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Stats Section */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <MaterialIcons name="fitness-center" size={24} color={Colors.primary} />
            <Text style={styles.statNumber}>{filteredClasses.length}</Text>
            <Text style={styles.statLabel}>Classes</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="bag-outline" size={24} color={Colors.success} />
            <Text style={styles.statNumber}>{cart.length}</Text>
            <Text style={styles.statLabel}>In Cart</Text>
          </View>
        </View>
        {/* Classes List */}
        <FlatList
          data={filteredClasses}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          renderItem={({ item }) => (
            <View style={styles.classCard}>
              {/* Card Header */}
              <View style={styles.cardHeader}>
                <View style={styles.typeContainer}>
                  <MaterialIcons name="self-improvement" size={24} color={Colors.primary} />
                  <Text style={styles.classType}>{item.type}</Text>
                </View>
                <View style={styles.priceContainer}>
                  <Text style={styles.priceText}>${item.price.toFixed(2)}</Text>
                </View>
              </View>

              {/* Card Content */}
              <View style={styles.cardContent}>
                <View style={styles.infoRow}>
                  <Ionicons name="calendar-outline" size={16} color={Colors.gray[500]} />
                  <Text style={styles.infoText}>{item.day} at {item.time}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Ionicons name="time-outline" size={16} color={Colors.gray[500]} />
                  <Text style={styles.infoText}>{item.duration}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Ionicons name="people-outline" size={16} color={Colors.gray[500]} />
                  <Text style={styles.infoText}>Max {item.capacity} people</Text>
                </View>
              </View>

              {/* Instances Section */}
              {item.instances.length > 0 && (
                <TouchableOpacity
                  onPress={() => toggleExpand(item.id)}
                  style={styles.instancesToggle}
                >
                  <Text style={styles.instancesText}>
                    {item.instances.length} session{item.instances.length > 1 ? 's' : ''} available
                  </Text>
                  <Ionicons 
                    name={expanded === item.id ? "chevron-up" : "chevron-down"} 
                    size={20} 
                    color={Colors.primary} 
                  />
                </TouchableOpacity>
              )}

              {/* Expanded Instances */}
              {expanded === item.id && item.instances.map((inst) => (
                <View key={inst.id} style={styles.instanceCard}>
                  <View style={styles.instanceInfo}>
                    <Text style={styles.instanceTitle}>Session #{inst.id}</Text>
                    <Text style={styles.teacherName}>with {inst.teacher}</Text>
                    <Text style={styles.instanceDate}>{inst.date}</Text>
                  </View>
                </View>
              ))}

              {/* Action Button */}
              <TouchableOpacity
                style={[
                  styles.actionButton,
                  isInCart(item.id) && styles.actionButtonAdded,
                  item.instances.length === 0 && styles.actionButtonDisabled
                ]}
                onPress={() => toggleClassInCart(item)}
                disabled={item.instances.length === 0}
              >
                <Ionicons 
                  name={isInCart(item.id) ? "checkmark-circle" : "add-circle-outline"} 
                  size={20} 
                  color={item.instances.length === 0 ? Colors.gray[400] : 
                         isInCart(item.id) ? Colors.white : Colors.primary} 
                />
                <Text style={[
                  styles.actionButtonText,
                  isInCart(item.id) && styles.actionButtonTextAdded,
                  item.instances.length === 0 && styles.actionButtonTextDisabled
                ]}>
                  {item.instances.length === 0 ? 'No Sessions' : 
                   isInCart(item.id) ? 'Added to Cart' : 'Add to Cart'}
                </Text>
              </TouchableOpacity>
            </View>
          )}
          contentContainerStyle={styles.listContainer}
        />

        {/* Cart Button */}
        {cart.length > 0 && (
          <View style={styles.cartButtonContainer}>
            <TouchableOpacity
              style={styles.cartButton}
              onPress={() => router.push("/cart")}
            >
              <Ionicons name="bag-outline" size={20} color={Colors.white} />
              <Text style={styles.cartButtonText}>
                Go to Cart ({cart.length})
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.gray[50],
  },
  inner: {
    flex: 1,
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.xl,
  },
  
  // Header Styles
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: Spacing.lg,
  },
  headerContent: {
    flex: 1,
  },
  welcomeText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.gray[600],
    fontWeight: Typography.fontWeight.medium,
  },
  headerTitle: {
    fontSize: Typography.fontSize['2xl'],
    fontWeight: Typography.fontWeight.bold,
    color: Colors.gray[900],
    marginTop: Spacing.xs,
  },
  logoutButton: {
    padding: Spacing.sm,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.md,
    ...Shadows.sm,
  },

  // Search Styles
  searchContainer: {
    marginBottom: Spacing.lg,
  },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    ...Shadows.sm,
  },
  searchIcon: {
    marginRight: Spacing.sm,
  },
  searchInput: {
    flex: 1,
    paddingVertical: Spacing.md,
    fontSize: Typography.fontSize.base,
    color: Colors.gray[900],
  },
  clearButton: {
    padding: Spacing.xs,
  },

  // Stats Styles
  statsContainer: {
    flexDirection: 'row',
    marginBottom: Spacing.lg,
    gap: Spacing.md,
  },
  statItem: {
    flex: 1,
    backgroundColor: Colors.white,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    ...Shadows.sm,
  },
  statNumber: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.gray[900],
    marginTop: Spacing.xs,
  },
  statLabel: {
    fontSize: Typography.fontSize.sm,
    color: Colors.gray[600],
    marginTop: Spacing.xs,
  },

  // List Styles
  listContainer: {
    paddingBottom: Spacing.xl,
  },

  // Card Styles
  classCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.md,
    overflow: 'hidden',
    ...Shadows.md,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray[100],
  },
  typeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  classType: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.gray[900],
    marginLeft: Spacing.sm,
  },
  priceContainer: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
  },
  priceText: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.white,
  },

  // Card Content
  cardContent: {
    padding: Spacing.md,
    gap: Spacing.sm,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  infoText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.gray[600],
  },

  // Instances
  instancesToggle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.md,
    backgroundColor: Colors.gray[50],
    borderTopWidth: 1,
    borderTopColor: Colors.gray[100],
  },
  instancesText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.primary,
    fontWeight: Typography.fontWeight.medium,
  },
  instanceCard: {
    padding: Spacing.md,
    backgroundColor: Colors.gray[50],
    borderTopWidth: 1,
    borderTopColor: Colors.gray[100],
  },
  instanceInfo: {
    gap: Spacing.xs,
  },
  instanceTitle: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.gray[900],
  },
  teacherName: {
    fontSize: Typography.fontSize.sm,
    color: Colors.gray[600],
  },
  instanceDate: {
    fontSize: Typography.fontSize.xs,
    color: Colors.gray[500],
  },

  // Action Button
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.md,
    margin: Spacing.md,
    borderRadius: BorderRadius.sm,
    borderWidth: 2,
    borderColor: Colors.primary,
    gap: Spacing.sm,
  },
  actionButtonAdded: {
    backgroundColor: Colors.success,
    borderColor: Colors.success,
  },
  actionButtonDisabled: {
    borderColor: Colors.gray[300],
    backgroundColor: Colors.gray[100],
  },
  actionButtonText: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.primary,
  },
  actionButtonTextAdded: {
    color: Colors.white,
  },
  actionButtonTextDisabled: {
    color: Colors.gray[400],
  },

  // Cart Button
  cartButtonContainer: {
    padding: Spacing.md,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.gray[200],
  },
  cartButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    gap: Spacing.sm,
    ...Shadows.md,
  },
  cartButtonText: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.white,
  },
});
