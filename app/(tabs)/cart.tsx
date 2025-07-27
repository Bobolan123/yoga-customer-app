import { db } from '@/common/firebaseConfig';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { Colors, Spacing, BorderRadius, Shadows, Typography } from "@/constants/Design";
import { Toast } from '@ant-design/react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import React, { useState } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';

export default function CartScreen() {
  const { cart, clearCart, removeFromCart } = useCart();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async () => {
    if (!user?.email) {
      Toast.fail('User not authenticated', 1);
      return;
    }

    if (cart.length === 0) {
      Toast.info('Your cart is empty', 1);
      return;
    }

    setLoading(true);

    try {
      for (const item of cart) {
        await addDoc(collection(db, 'bookings'), {
          email: user.email,
          class_id: item.classId,
          price: item.classData.price,
          type: item.classData.type,
          day: item.classData.day,
          booking_date: serverTimestamp(),
        });
      }

      Toast.success('Booking completed!', 2);
      clearCart();
      router.replace({ pathname: '/bookings', params: { email: user.email } });
    } catch (err) {
      console.error('Booking error:', err);
      Toast.fail('Failed to submit booking', 2);
    } finally {
      setLoading(false);
    }
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.classData.price, 0);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inner}>
        {/* Header */}
        <View style={styles.headerContainer}>
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>Your Cart</Text>
            <Text style={styles.headerSubtitle}>
              {cart.length} {cart.length === 1 ? 'class' : 'classes'} selected
            </Text>
          </View>
          {cart.length > 0 && (
            <TouchableOpacity onPress={clearCart} style={styles.clearAllButton}>
              <Ionicons name="trash-outline" size={20} color={Colors.error} />
              <Text style={styles.clearAllText}>Clear All</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Cart Items */}
        <FlatList
          data={cart}
          keyExtractor={(item) => item.classId.toString()}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <View style={styles.cartItem}>
              <View style={styles.itemHeader}>
                <View style={styles.typeContainer}>
                  <MaterialIcons name="self-improvement" size={24} color={Colors.primary} />
                  <Text style={styles.itemType}>{item.classData.type}</Text>
                </View>
                <TouchableOpacity 
                  onPress={() => removeFromCart(item.classId)}
                  style={styles.removeButton}
                >
                  <Ionicons name="close" size={20} color={Colors.error} />
                </TouchableOpacity>
              </View>

              <View style={styles.itemContent}>
                <View style={styles.infoRow}>
                  <Ionicons name="calendar-outline" size={16} color={Colors.gray[500]} />
                  <Text style={styles.infoText}>{item.classData.day} at {item.classData.time}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Ionicons name="time-outline" size={16} color={Colors.gray[500]} />
                  <Text style={styles.infoText}>{item.classData.duration}</Text>
                </View>
                {item.classData.instances?.[0] && (
                  <>
                    <View style={styles.infoRow}>
                      <Ionicons name="person-outline" size={16} color={Colors.gray[500]} />
                      <Text style={styles.infoText}>{item.classData.instances[0].teacher}</Text>
                    </View>
                    <View style={styles.infoRow}>
                      <Ionicons name="location-outline" size={16} color={Colors.gray[500]} />
                      <Text style={styles.infoText}>{item.classData.instances[0].date}</Text>
                    </View>
                  </>
                )}
              </View>

              <View style={styles.priceContainer}>
                <Text style={styles.priceText}>${item.classData.price.toFixed(2)}</Text>
              </View>
            </View>
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <MaterialIcons name="shopping-cart" size={80} color={Colors.gray[300]} />
              <Text style={styles.emptyTitle}>Your cart is empty</Text>
              <Text style={styles.emptySubtitle}>Add some yoga classes to get started</Text>
            </View>
          }
          contentContainerStyle={styles.listContainer}
        />

        {/* Summary Section */}
        {cart.length > 0 && (
          <View style={styles.summaryContainer}>
            {/* User Email */}
            <View style={styles.emailContainer}>
              <Ionicons name="mail-outline" size={20} color={Colors.primary} />
              <View style={styles.emailContent}>
                <Text style={styles.emailLabel}>Booking Email</Text>
                <Text style={styles.emailText}>{user?.email}</Text>
              </View>
            </View>

            {/* Total */}
            <View style={styles.totalContainer}>
              <Text style={styles.totalLabel}>Total Amount</Text>
              <Text style={styles.totalAmount}>${getTotalPrice().toFixed(2)}</Text>
            </View>

            {/* Book Button */}
            <TouchableOpacity
              style={[styles.bookButton, loading && styles.bookButtonDisabled]}
              onPress={handleSubmit}
              disabled={loading || cart.length === 0}
            >
              {loading ? (
                <ActivityIndicator size="small" color={Colors.white} />
              ) : (
                <>
                  <Ionicons name="checkmark-circle" size={20} color={Colors.white} />
                  <Text style={styles.bookButtonText}>
                    Book {cart.length} {cart.length === 1 ? 'Class' : 'Classes'}
                  </Text>
                </>
              )}
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
  clearAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    padding: Spacing.sm,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    borderColor: Colors.error,
    ...Shadows.sm,
  },
  clearAllText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.error,
    fontWeight: Typography.fontWeight.medium,
  },

  // List
  listContainer: {
    flexGrow: 1,
    paddingBottom: Spacing.lg,
  },

  // Cart Items
  cartItem: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.md,
    overflow: 'hidden',
    ...Shadows.md,
  },
  itemHeader: {
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
  itemType: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.gray[900],
    marginLeft: Spacing.sm,
  },
  removeButton: {
    padding: Spacing.sm,
    backgroundColor: Colors.gray[100],
    borderRadius: BorderRadius.sm,
  },
  itemContent: {
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
  priceContainer: {
    backgroundColor: Colors.primary,
    padding: Spacing.md,
    alignItems: 'center',
  },
  priceText: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.white,
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

  // Summary
  summaryContainer: {
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.gray[200],
    padding: Spacing.md,
    gap: Spacing.md,
  },
  emailContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    padding: Spacing.md,
    backgroundColor: Colors.gray[50],
    borderRadius: BorderRadius.sm,
  },
  emailContent: {
    flex: 1,
  },
  emailLabel: {
    fontSize: Typography.fontSize.xs,
    color: Colors.gray[500],
    textTransform: 'uppercase',
    fontWeight: Typography.fontWeight.semibold,
  },
  emailText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.gray[900],
    fontWeight: Typography.fontWeight.medium,
    marginTop: Spacing.xs,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.gray[200],
  },
  totalLabel: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.gray[900],
  },
  totalAmount: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.primary,
  },
  bookButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    gap: Spacing.sm,
    ...Shadows.md,
  },
  bookButtonDisabled: {
    backgroundColor: Colors.gray[400],
  },
  bookButtonText: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.white,
  },
});
