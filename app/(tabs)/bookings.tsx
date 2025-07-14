import { db } from "@/common/firebaseConfig";
import { IBooking } from "@/common/interface";
import { List, Toast, WhiteSpace, WingBlank } from "@ant-design/react-native";
import {
  AntDesign,
  FontAwesome5,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { collection, getDocs } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";

export default function Bookings() {
  const { email } = useLocalSearchParams<{ email: string }>();
  const [bookings, setBookings] = useState<IBooking[]>([]);

  useEffect(() => {
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

        const userBookings = email
          ? allBookings.filter((b) => b.email === email)
          : allBookings;

        setBookings(userBookings);
      } catch (error) {
        console.error("Fetch bookings error:", error);
        Toast.fail("Failed to fetch bookings", 2);
      }
    };

    fetchBookings();
  }, [email]);

  return (
    <WingBlank style={styles.container}>
      <Text style={styles.title}>Your Bookings</Text>

      <FlatList
        data={bookings}
        keyExtractor={(item) => item.id!}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No bookings found.</Text>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <List>
              <List.Item extra={<Text style={styles.instance}>#{item.class_id}</Text>} multipleLine>
                <View style={styles.row}>
                  <MaterialCommunityIcons
                    name="yoga"
                    size={18}
                    color="#5E72E4"
                    style={styles.icon}
                  />
                  <Text style={styles.type}>{item.type}</Text>
                </View>

                <List.Item.Brief>
                  <View style={styles.row}>
                    <AntDesign
                      name="calendar"
                      size={14}
                      color="#FB6340"
                      style={styles.icon}
                    />
                    <Text style={styles.briefText}>Day: {item.day}</Text>
                  </View>
                </List.Item.Brief>

                <List.Item.Brief>
                  <View style={styles.row}>
                    <FontAwesome5
                      name="money-bill"
                      size={14}
                      color="#11CDEF"
                      style={styles.icon}
                    />
                    <Text style={styles.briefText}>Price: ${item?.price?.toFixed(2)}</Text>
                  </View>
                </List.Item.Brief>

                <List.Item.Brief>
                  <View style={styles.row}>
                    <AntDesign
                      name="clockcircleo"
                      size={14}
                      color="#2DCE89"
                      style={styles.icon}
                    />
                    <Text style={styles.briefText}>
                      Booked at: {item?.booking_date?.toLocaleString()
                      }
                    </Text>
                  </View>
                </List.Item.Brief>
              </List.Item>
            </List>
            <WhiteSpace size="sm" />
          </View>
        )}
      />
    </WingBlank>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 50,
    paddingBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 16,
    color: "#999",
    textAlign: "center",
    marginTop: 30,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 6,
    overflow: "hidden",
    elevation: 1,
    marginBottom: 12,
  },
  type: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#222",
  },
  instance: {
    fontSize: 14,
    color: "#555",
  },
  briefText: {
    fontSize: 13,
    color: "#444",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 2,
  },
  icon: {
    marginRight: 6,
  },
});
