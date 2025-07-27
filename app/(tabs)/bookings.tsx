import { db } from "@/common/firebaseConfig";
import { IBooking } from "@/common/interface";
import { useAuth } from "@/context/AuthContext";
import { Colors, Spacing, BorderRadius, Shadows, Typography } from "@/constants/Design";
import { Toast } from "@ant-design/react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { collection, getDocs } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { 
  FlatList, 
  StyleSheet, 
  Text, 
  View, 
  SafeAreaView, 
  RefreshControl,
  ActivityIndicator 
} from "react-native";

export default function Bookings() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<IBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchBookings = async () => {
    try {
      const snapshot = await getDocs(collection(db, "bookings"));
      const allBookings: IBooking[] = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          email: data.email,
          class_id: data.class_id,
          type: data.type,
          day: data.day,
          price: data.price,
          booking_date: data.booking_date?.toDate().toLocaleString() || "N/A",
        };
      });

      const userBookings = user?.email
        ? allBookings.filter((b) => b.email === user.email)
        : allBookings;

      setBookings(userBookings);
    } catch (error) {
      console.error("Fetch bookings error:", error);
      Toast.fail("Failed to fetch bookings", 2);
    }
  };

  useEffect(() => {
    const initializeData = async () => {
      setLoading(true);
      await fetchBookings();
      setLoading(false);
    };

    if (user?.email) {
      initializeData();
    }
  }, [user?.email]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchBookings();
    setRefreshing(false);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Loading your bookings...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inner}>
        {/* Header */}
        <View style={styles.headerContainer}>
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>Your Bookings</Text>
            <Text style={styles.headerSubtitle}>
              {bookings.length} {bookings.length === 1 ? 'booking' : 'bookings'} found
            </Text>
          </View>
          <View style={styles.statsContainer}>
            <MaterialIcons name="event-available" size={24} color={Colors.success} />
            <Text style={styles.statsNumber}>{bookings.length}</Text>
          </View>
        </View>

        {/* Bookings List */}
        <FlatList
          data={bookings}
          keyExtractor={(item) => item.id!}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          renderItem={({ item }) => (
            <View style={styles.bookingCard}>
              {/* Card Header */}
              <View style={styles.cardHeader}>
                <View style={styles.typeContainer}>
                  <MaterialIcons name="self-improvement" size={24} color={Colors.primary} />
                  <Text style={styles.classType}>{item.type}</Text>
                </View>
                <View style={styles.idContainer}>
                  <Text style={styles.idText}>#{item.class_id}</Text>
                </View>
              </View>

              {/* Card Content */}
              <View style={styles.cardContent}>
                <View style={styles.infoRow}>
                  <Ionicons name="calendar-outline" size={16} color={Colors.gray[500]} />
                  <Text style={styles.infoText}>Class Day: {item.day}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Ionicons name="wallet-outline" size={16} color={Colors.gray[500]} />
                  <Text style={styles.infoText}>Amount: ${item?.price?.toFixed(2)}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Ionicons name="time-outline" size={16} color={Colors.gray[500]} />
                  <Text style={styles.infoText}>Booked: {item?.booking_date?.toString()}</Text>
                </View>
              </View>

              {/* Status Badge */}
              <View style={styles.statusContainer}>
                <View style={styles.statusBadge}>
                  <Ionicons name="checkmark-circle" size={16} color={Colors.success} />
                  <Text style={styles.statusText}>Confirmed</Text>
                </View>
              </View>
            </View>
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <MaterialIcons name="event-busy" size={80} color={Colors.gray[300]} />
              <Text style={styles.emptyTitle}>No bookings yet</Text>
              <Text style={styles.emptySubtitle}>
                Start booking yoga classes to see them here
              </Text>
            </View>
          }
          contentContainerStyle={styles.listContainer}
        />
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

  // Loading
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.md,
  },
  loadingText: {
    fontSize: Typography.fontSize.base,
    color: Colors.gray[600],
  },

  // Header
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.lg,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: Typography.fontSize['2xl'],
    fontWeight: Typography.fontWeight.bold,
    color: Colors.gray[900],
  },
  headerSubtitle: {
    fontSize: Typography.fontSize.sm,
    color: Colors.gray[600],
    marginTop: Spacing.xs,
  },
  statsContainer: {
    alignItems: 'center',
    backgroundColor: Colors.white,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    ...Shadows.sm,
  },
  statsNumber: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.gray[900],
    marginTop: Spacing.xs,
  },

  // List
  listContainer: {
    flexGrow: 1,
    paddingBottom: Spacing.xl,
  },

  // Booking Cards
  bookingCard: {
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
  idContainer: {
    backgroundColor: Colors.gray[100],
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
  },
  idText: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.gray[700],
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

  // Status
  statusContainer: {
    padding: Spacing.md,
    backgroundColor: Colors.gray[50],
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    alignSelf: 'flex-start',
    backgroundColor: Colors.success,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
  },
  statusText: {
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.white,
    textTransform: 'uppercase',
  },

  // Empty State
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: Spacing['3xl'],
  },
  emptyTitle: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.gray[900],
    marginTop: Spacing.lg,
  },
  emptySubtitle: {
    fontSize: Typography.fontSize.base,
    color: Colors.gray[600],
    textAlign: 'center',
    marginTop: Spacing.sm,
  },
});
