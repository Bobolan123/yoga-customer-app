import { db } from '@/common/firebaseConfig';
import { useCart } from '@/context/CartContext';
import { Button, InputItem, List, Toast, WhiteSpace, WingBlank } from '@ant-design/react-native';
import { useRouter } from 'expo-router';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import React, { useState } from 'react';
import { FlatList, Text } from 'react-native';

export default function CartScreen() {
  const { cart, clearCart } = useCart();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async () => {
    if (!email) {
      Toast.fail('Please enter your email', 1);
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
          email,
          class_instance_id: item.classId,
          type: item.classData.type,
          teacher: item.classData.instances?.[0]?.teacher || '',
          date: item.classData.instances?.[0]?.date || '',
          booking_date: serverTimestamp(),
        });
      }

      Toast.success('Booking completed!', 2);
      clearCart();
      router.replace({ pathname: '/bookings', params: { email } });
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
      <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 12 }}>Your Cart</Text>
      <List>
        <FlatList
          data={cart}
          keyExtractor={(item) => item.classId.toString()}
          renderItem={({ item }) => (
            <List.Item>
              <Text style={{ fontWeight: 'bold' }}>{item.classData.type}</Text>
              <List.Item.Brief>{item.classData.instances?.[0]?.teacher}</List.Item.Brief>
              <List.Item.Brief>{item.classData.instances?.[0]?.date}</List.Item.Brief>
            </List.Item>
          )}
          ListEmptyComponent={<List.Item>No classes in cart.</List.Item>}
        />
      </List>

      <WhiteSpace size="lg" />
      <InputItem
        clear
        type="text"
        value={email}
        onChange={setEmail}
        placeholder="Your email"
      >
        Email
      </InputItem>

      <WhiteSpace size="lg" />
      <Button type="primary" loading={loading} onPress={handleSubmit}>
        Book Now
      </Button>
      <WhiteSpace size="lg" />
    </WingBlank>
  );
}
