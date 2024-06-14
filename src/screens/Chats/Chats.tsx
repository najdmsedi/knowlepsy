import { Button, FlatList, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { Avatar, Icon, ListItem } from 'react-native-elements';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import ConstantBar from '../../components/BleutoothButton';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AddAnotherButton from '../../components/messenger/AddAnotherButton';
import { AuthContext } from '../../context/AuthContext';
import { BASE_URL } from '../../config';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/TabNavigator';

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

interface Connection {
  _id: string;
  patientId: string;
  patientEmail: string;
  patientName: string;
  doctorId: string;
  doctorEmail: string;
  doctorName: string;
  lastMessage: string;
  lastMessageTime: Date;
}

const Chats = () => {
  const { userInfo } = useContext(AuthContext);
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const [notificationCount, setNotificationCount] = useState(0);
  const [Connection, setConnection] = useState<[]>([]);

  useEffect(() => {
    navigation.setOptions({
      title: '',
      headerRight: () => <ConstantBar />,
    });
  }, []);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useFocusEffect(
    React.useCallback(() => {
      const fetchPendingConnectionsForPatient = async () => {
        try {
          const response = await fetch(`${BASE_URL}/connection/getPendingPatientConnection/?patientId=${userInfo._id}`);
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          const data = await response.json();
          setNotificationCount(data.length);
          console.log("notificationCount", notificationCount);

        } catch (error: any) {
          setError(error.message);
        } finally {
          setLoading(false);
        }
      };

      const fetchPendingConnectionsForDoctor = async () => {
        try {
          const response = await fetch(`${BASE_URL}/connection/getPendingDoctorConnection/?doctorId=${userInfo._id}`);
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          const data = await response.json();
          setNotificationCount(data.length);
          console.log("notificationCount", notificationCount);

        } catch (error: any) {
          setError(error.message);
        } finally {
          setLoading(false);
        }
      };

      const fetchConnectionsForPatient = async () => {
        try {
          const response = await fetch(`${BASE_URL}/connection/getPatientConnection/?patientId=${userInfo._id}`);
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          const data = await response.json();
          setConnection(data);
          console.log("Connection", Connection);

        } catch (error: any) {
          setError(error.message);
        } finally {
          setLoading(false);
        }
      };

      const fetchConnectionsForDoctor = async () => {
        try {
          const response = await fetch(`${BASE_URL}/connection/getDoctorConnection/?doctorId=${userInfo._id}`);
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          const data = await response.json();
          setConnection(data);
          console.log("Connection", Connection);

        } catch (error: any) {
          setError(error.message);
        } finally {
          setLoading(false);
        }
      };

      if (userInfo.role == "patient") { fetchPendingConnectionsForPatient(); fetchConnectionsForPatient() }
      if (userInfo.role == "doctor") { fetchPendingConnectionsForDoctor(); fetchConnectionsForDoctor() }
      
      return () => {};
    }, [userInfo])
  );
  const formatTime = (isoString: string | number | Date) => {
    const date = new Date(isoString);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };
  
  const GoToChat = (item:any) =>{
console.log(item.lastMessageTime)

    console.log("renderPatientItem",item);
    navigation.navigate('ChatScreen', { item });
  }

  const renderPatientItem = ({ item }: { item: Connection }) => (
    <TouchableOpacity onPress={() => GoToChat(item)}>
      <ListItem bottomDivider>
        <View style={styles.circle}>
          <Text style={styles.initials}>
            {item.doctorName.charAt(0).toUpperCase()}{item.doctorName.charAt(1).toUpperCase()}
          </Text>
        </View>
        <ListItem.Content>
          <ListItem.Title>{item.doctorName}</ListItem.Title>
          <ListItem.Subtitle>{item.lastMessage} </ListItem.Subtitle>
        </ListItem.Content>
        <Text style={styles.time}>{item.lastMessageTime ? formatTime(item.lastMessageTime) : ''} </Text>
      </ListItem>
    </TouchableOpacity>
  );

  const renderDoctorItem = ({ item }: { item: Connection }) => (
    <TouchableOpacity onPress={() => GoToChat(item)}>
      <ListItem bottomDivider>
        <View style={styles.circle}>
          <Text style={styles.initials}>
            {item.patientName.charAt(0).toUpperCase()}{item.patientName.charAt(1).toUpperCase()}
          </Text>
        </View>
        <ListItem.Content>
          <ListItem.Title>{item.patientName}</ListItem.Title>
          <ListItem.Subtitle>{item.lastMessage} </ListItem.Subtitle>
        </ListItem.Content>
        <Text style={styles.time}>{item.lastMessageTime ? formatTime(item.lastMessageTime) : ''} </Text>
      </ListItem>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.navigate('InvitationPage')}>
          <View style={styles.iconContainer}>
            <Ionicons name="people-outline" size={35} color="#8A57ED" style={styles.icon} />
            {notificationCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{notificationCount}</Text>
              </View>
            )}
          </View>
        </Pressable>
      </View>
      {userInfo.role === "patient" && userInfo.doctorIds.length < 5 &&
        <FlatList
          data={Connection}
          keyExtractor={(item) => item._id}
          renderItem={renderPatientItem}
          ListFooterComponent={<AddAnotherButton />}
        />
      }

      {userInfo.role === "doctor" &&
        <FlatList
          data={Connection}
          keyExtractor={(item) => item._id}
          renderItem={renderDoctorItem}
        />
      }
    </View>
  );
};

export default Chats

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 10,
  },
  iconContainer: {
    position: 'relative',
  },
  icon: {
    // transform: [{ rotate: '15deg' }],
  },
  badge: {
    position: 'absolute',
    right: -6,
    top: -3,
    backgroundColor: 'red',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  time: {
    fontSize: 12,
    color: 'gray',
  },
  circle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#007AFF', // Adjust color as needed
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  initials: {
    color: '#FFFFFF', // Adjust text color as needed
    fontSize: 18,
    fontWeight: 'bold',
  },
});
