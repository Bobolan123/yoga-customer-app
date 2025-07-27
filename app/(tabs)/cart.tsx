import { db } from '@/common/firebaseConfig';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import {
  Button,
  List,
  Toast,
  WhiteSpace,
  WingBlank,
} from '@ant-design/react-native';
import Feather from '@expo/vector-icons/Feather';
import { useRouter } from 'expo-router';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import React, { useState } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
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

  return (
    <WingBlank style={{ paddingTop: 50 }}>
      <WhiteSpace size="lg" />
      <Text style={styles.header}>🧘‍♀️ Your Cart</Text>

      {cart.length > 0 && (
        <View style={styles.clearButtonWrapper}>
          <TouchableOpacity onPress={clearCart}>
            <Text style={styles.clearButton}>Remove All</Text>
          </TouchableOpacity>
        </View>
      )}

      <List>
        <FlatList
          data={cart}
          keyExtractor={(item) => item.classId.toString()}
          renderItem={({ item }) => (
            <List.Item
              extra={
                <TouchableOpacity onPress={() => removeFromCart(item.classId)}>
                  <Feather name="trash-2" size={18} color="red" />
                </TouchableOpacity>
              }
              style={styles.classItem}
            >
              <Text style={styles.classTitle}>{item.classData.type}</Text>
              <List.Item.Brief>
                👩‍🏫 Teacher: {item.classData.instances?.[0]?.teacher}
              </List.Item.Brief>
              <List.Item.Brief>
                📅 Date: {item.classData.instances?.[0]?.date}
              </List.Item.Brief>
            </List.Item>
          )}
          ListEmptyComponent={
            <List.Item>
              <Text style={{ textAlign: 'center', color: '#888' }}>
                No classes in cart.
              </Text>
            </List.Item>
          }
        />
      </List>

      <WhiteSpace size="lg" />
      <View style={styles.emailContainer}>
        <Text style={styles.emailText}>📧 Booking Email: {user?.email}</Text>
      </View>

      <WhiteSpace size="lg" />
      <Button
        type="primary"
        loading={loading}
        disabled={cart.length === 0}
        onPress={handleSubmit}
      >
        Book Now ({cart.length})
      </Button>
      <WhiteSpace size="lg" />
    </WingBlank>
  );
}

const styles = StyleSheet.create({
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  classItem: {
    backgroundColor: '#fdfdfd',
  },
  classTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  clearButtonWrapper: {
    alignItems: 'flex-end',
    marginBottom: 6,
  },
  clearButton: {
    color: 'red',
    fontSize: 13,
    marginRight: 6,
  },
  emailContainer: {
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 8,
    marginHorizontal: 16,
  },
  emailLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 4,
  },
  emailText: {
    fontSize: 18,
    color: '#333',
    fontWeight: '500',
  },
});
