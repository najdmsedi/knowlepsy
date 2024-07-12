import { StyleSheet, Text, View, FlatList } from 'react-native';
import React, { useEffect, useState } from 'react';

const Notification = () => {
  const [notifications, setNotifications] = useState<any>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      // Simulate a network request
      setLoading(true);
      setTimeout(() => {
        const fakeNotifications = [
          { id: 1, message: 'You have a new message from John.' },
          { id: 2, message: 'Your appointment is scheduled for tomorrow.' },
          { id: 3, message: 'Don’t forget to complete your daily survey.' },
        ];
        setNotifications(fakeNotifications);
        setLoading(false);
      }, 2000); // Simulating a 2 seconds delay
    };

    fetchNotifications();
  }, []);

  const renderItem = ({ item }:any) => (
    <View style={styles.notificationItem}>
      <Text style={styles.notificationText}>{item.message}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <Text style={styles.loadingText}>Loading...</Text>
      ) : notifications.length === 0 ? (
        <Text style={styles.noDataText}>No Notifications found</Text>
      ) : (
        <FlatList
          data={notifications}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </View>
  );
};

export default Notification;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  listContainer: {
    paddingBottom: 20,
  },
  noDataText: {
    color: 'black',
    fontSize: 16,
    textAlign: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  loadingText: {
    color: 'black',
    fontSize: 16,
    textAlign: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  notificationItem: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
    marginHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  notificationText: {
    color: 'black',
    fontSize: 14,
  },
});
