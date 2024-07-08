import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/Home/HomeScreen';
import Ionicons from 'react-native-vector-icons/Ionicons';
import DeviceScreen from '../screens/Device/DeviceScreen';
import SettingsScreen from '../screens/settings/SettingsScreen';
import ScanScreen from '../components/ScanScreen';
import { useContext, useEffect, useState } from 'react';
import BleManager from 'react-native-ble-manager';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { ConnectedAtom, DominantLevelAtom, TimeLevelAtom } from '../atoms';
import Temperature from '../screens/Temperature';
import { NavigatorScreenParams, getFocusedRouteNameFromRoute } from '@react-navigation/native';
import Steps from '../screens/Steps';
import HeartRate from '../screens/HeartRate';
import CustomBackButton from '../components/button/CustomBackButton';
import EditProfile from '../screens/EditProfile';
import ChangePassword from '../screens/ChangePassword';
import Stress from '../screens/Stress';
import { AuthContext } from '../context/AuthContext';
import ChatScreen from '../components/messenger/ChatScreen';
import Chats from '../screens/Chats/Chats';
import Map from '../screens/Map/Map';
import Notification from '../screens/Notification/Notification';

import InvitecaireGiver from '../screens/InvitecaireGiver';
import PushNotificationConfig from './../../src/services/NotificationService';
// import createNotificationChannel from './ServiceNotification'
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import messaging from '@react-native-firebase/messaging';
import PushNotification from 'react-native-push-notification';
import Toast from 'react-native-toast-message';
import { BASE_URL } from '../config';
import InvitationPage from '../components/messenger/InvitationPage';
import LocationComponent from '../components/location/LocationComponent';
import axios from 'axios';
import AddDoctor from '../screens/AddDoctor';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator<RootStackParamList>();

const homeName = "HomeScreen";
const deviceName = "DeviceScreen";
const settingsName = "Settings";
const sleepTracking = "SleepTrackScreen";

export type RootStackParamList = {
  Home: undefined;
  ScanScreen: undefined;
  Temperature: undefined;
  Steps: undefined;
  HeartRate: undefined;
  EditProfile: undefined;
  ChangePassword: undefined;
  Stress: undefined;
  TabNavigator: NavigatorScreenParams<RootTabParamList>;
  ChatScreen: { item: any };
  InvitecaireGiver: undefined;
  InvitationPage: undefined;
  Map: undefined;
  Notification: undefined;
  AddDoctor: undefined;
};

type RootTabParamList = {
  HomeScreen: undefined;
  DeviceScreen: undefined;
  Settings: undefined;
  Chats: undefined;
};
const HomeStack = ({ navigation }: any) => {
  const setConnected = useSetRecoilState(ConnectedAtom);

  const checkConnectedDevice = async () => {
    return await BleManager.getConnectedPeripherals()
  }
  useEffect(() => {
    const unsubscribe = navigation.addListener('tabPress', (e: { preventDefault: () => void; }) => {
      e.preventDefault();
      navigation.navigate('Home');
    });

    return unsubscribe;
  }, [navigation]);
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="ScanScreen" component={ScanScreen} options={{ headerLeft: () => <CustomBackButton /> }} />
      <Stack.Screen name="Temperature" component={Temperature} options={{ headerLeft: () => <CustomBackButton />, title: 'Temperature' }} />
      <Stack.Screen name="Steps" component={Steps} options={{ headerLeft: () => <CustomBackButton />, title: '' }} />
      <Stack.Screen name="HeartRate" component={HeartRate} options={{ headerLeft: () => <CustomBackButton />, title: 'Heart Rate' }} />
      <Stack.Screen name="Stress" component={Stress} options={{ headerLeft: () => <CustomBackButton />, title: '' }} />
      <Stack.Screen name="EditProfile" component={EditProfile} options={{
        headerLeft: () => <CustomBackButton destination='Settings' />, title: 'Edit profile', headerTitleStyle: {
          color: '#5e2a89',
          fontSize: 24,
          fontWeight: 'bold',
        },
      }}
      />
      <Stack.Screen name="ChangePassword" component={ChangePassword} options={{
        headerLeft: () => <CustomBackButton destination='Settings' />, title: 'Change Password', headerTitleStyle: {
          color: '#5e2a89',
          fontSize: 24,
          fontWeight: 'bold',
        },
      }}
      />
      <Stack.Screen name="InvitecaireGiver" component={InvitecaireGiver} options={{ headerLeft: () => <CustomBackButton destination='Chats' />, title: '' }} />
      <Stack.Screen name="ChatScreen" component={ChatScreen} options={{ headerLeft: () => <CustomBackButton destination='Chats' />, title: '' }} />
      <Stack.Screen name="InvitationPage" component={InvitationPage} options={{ headerLeft: () => <CustomBackButton destination='Chats' />, title: '' }} />
      <Stack.Screen name="AddDoctor" component={AddDoctor} options={{ headerLeft: () => <CustomBackButton destination='Settings' />, title: '' }} />
    </Stack.Navigator>
  );
};

function TabNavigator() {
  const { userInfo } = useContext(AuthContext);
  const [fcmToken, setFcmToken] = useState<string | null>(null);
  const [ppgData, setPpgData] = useState([]);
  const [EDAData, setEDAData] = useState([]);
  const [concatenatedData, setConcatenatedData] = useState<any>();
  const [concatenatedresponse, setConcatenatedresponse] = useState<any>();
  const [dominantStressLevel, setDominantStressLevel] = useState<string | null>(null);
  const setDominantLevel = useSetRecoilState(DominantLevelAtom);
  const setTimeLevel = useSetRecoilState(TimeLevelAtom);
  const isConnected = useRecoilValue(ConnectedAtom)

  const { patientId } = useContext(AuthContext);
  const { userGuestInfo } = useContext(AuthContext);

  useEffect(() => {
    PushNotificationConfig.configure();

    const handleNotificationClick = (data: any) => {
      if (data && data.redirectUrl) {
        console.log('Notification clicked! Redirect URL:', data.redirectUrl);
      } else {
        console.log('Notification clicked without redirect URL.');
      }
    };

    const unsubscribeOnMessage = messaging().onMessage(async (remoteMessage) => {
      const { notification, data } = remoteMessage;
      PushNotification.localNotification({
        channelId: "default-channel-id",
        title: notification?.title || 'Notification',
        message: notification?.body || 'You have received a new message',
        userInfo: data,
      });
      Toast.show({
        type: 'customSuccessToast',
        text1: notification?.title,
        text2: notification?.body,
        onPress() {
          handleNotificationClick(data);
        },
      });
    });

    const unsubscribeOnNotificationOpenedApp = messaging().onNotificationOpenedApp(remoteMessage => {
      const { data } = remoteMessage;
      handleNotificationClick(data);
    });

    messaging().getInitialNotification().then(remoteMessage => {

      if (remoteMessage && remoteMessage.data) {
        console.log("remoteMessage", remoteMessage);

        handleNotificationClick(remoteMessage.data);
      }
    });

    const getToken = async () => {
      const token = await messaging().getToken();
      console.log("tokentoken", token);

      return token;
    };

    const updateTokenOnServer = async (userId: any, token: any) => {
      const response = await fetch(`${BASE_URL}/user/setFCMToken/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fcmToken: token }),
      });
      const result = await response.json();

      if (response.ok) {
        console.log('FCM token updated successfully:', result);
      } else {
        console.error('Failed to update FCM token:', result.message);
      }
    };

    const checkAndUpdateToken = async (userId: any) => {
      const token = await getToken();
      setFcmToken(token);
      console.log("Updating token on the server");
      await updateTokenOnServer(userId, token);
    };

    checkAndUpdateToken(userInfo._id);

    // Handle token refresh
    const unsubscribeOnTokenRefresh = messaging().onTokenRefresh(async (newToken) => {
      setFcmToken(newToken);
      await updateTokenOnServer(userInfo._id, newToken);
    });

    return () => {
      unsubscribeOnMessage();
      unsubscribeOnNotificationOpenedApp();
      unsubscribeOnTokenRefresh();
    };
  }, [userInfo]);

  useEffect(() => {
    if (isConnected) {
      const fetchPpgAndEDAData = async () => {
        try {
          const [responsePpg, responseEDA] = await Promise.all([
            axios.get(`${BASE_URL}/risk-cron/getLatestPpgDataForFiveMinute/${patientId}`),
            axios.get(`${BASE_URL}/risk-cron/getLatestEDADataForFiveMinute/${patientId}`)
          ]);

          const ppgData = responsePpg.data;
          const EDAData = responseEDA.data;

          const extractedDataPpg = ppgData.map((entry: { PPG: { heart_rate: any; }; }) => ({
            heart_rate: entry.PPG.heart_rate,
          }));

          const extractedDataEDA = EDAData.map((entry: { EDA: { EDA: any; }[]; }) => ({
            EDA: entry.EDA[0].EDA,
          }));
          // console.log("EDAData",EDAData[0].time);
          setTimeLevel(EDAData[0].time)
          const minLength = Math.min(extractedDataEDA.length, extractedDataPpg.length);
          const data = [];
          for (let i = 0; i < minLength; i++) {
            data.push({
              EDA: extractedDataEDA[i].EDA,
              heart_rate: extractedDataPpg[i].heart_rate
            });
          }
          setConcatenatedData(data);

        } catch (error) {
          console.error('Error fetching PPG or EDA data:', error);
        }
      };

      const determineDominantStressLevel = (dataresponse: any[]) => {
        const countMap = dataresponse.reduce((acc, level) => {
          acc[level] = (acc[level] || 0) + 1;
          return acc;
        }, {});

        let maxCount = 0;
        let dominantLevel = null;

        for (const level in countMap) {
          if (countMap[level] > maxCount) {
            maxCount = countMap[level];
            dominantLevel = level;
          }
        }

        setDominantStressLevel(dominantLevel);
      };

      const processDataAndDetermineStress = async () => {
        await fetchPpgAndEDAData();
        console.log("concatenatedData", concatenatedData);

        if (concatenatedData?.length > 0) {
          const dataresponse = await Promise.all(
            concatenatedData?.map(async (dataPoint: { EDA: any; heart_rate: any; }) => {
              const response = await axios.post('http://172.187.93.156:5000/Young_predict', {
                EDA: dataPoint.EDA,
                HeartRate: dataPoint.heart_rate,
              });
              return response.data.stress_level;
            })
          );

          setConcatenatedresponse(dataresponse);
          determineDominantStressLevel(dataresponse);
          setDominantLevel(dominantStressLevel as any);
          console.log("dominantStressLevel", dominantStressLevel);

        }
      };

      processDataAndDetermineStress();
      const intervalId = setInterval(processDataAndDetermineStress, 5 * 60 * 1000);

      return () => clearInterval(intervalId);
    }
  }, [patientId]);

  return (
    <Tab.Navigator
      initialRouteName="HomeScreen"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused }) => {
          let iconName;
          switch (route.name) {
            case "HomeScreen":
              iconName = focused ? 'home' : 'home-outline';
              break;
            case "DeviceScreen":
              iconName = focused ? 'watch' : 'watch-outline';
              break;
            case "Settings":
              iconName = focused ? 'settings' : 'settings-outline';
              break;
            case "Chats":
              iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
              break;
            case "Map":
              iconName = focused ? 'map' : 'map-outline';
              break;
            case "Notification":
              iconName = focused ? 'notifications' : 'notifications-outline';
              break;
            default:
              iconName = 'circle';
              break;
          }
          return <Ionicons name={iconName} size={focused ? 35 : 25} color="#8A57ED" />;
        },
        tabBarStyle: ((route) => {
          const routeName = getFocusedRouteNameFromRoute(route) ?? "";
          if (routeName === 'ScanScreen' || routeName === 'Temperature' || routeName === 'HeartRate' || routeName === 'Steps' || routeName === 'EditProfile' || routeName === 'Stress' || routeName === 'ChatScreen' || routeName === 'InvitecaireGiver' || routeName === 'InvitationPage' || routeName === 'Settings' || routeName === 'AddDoctor' || routeName === 'ChangePassword') {
            return { display: 'none' };
          }
          return {};
        })(route),
      })}
    >
      {userInfo.role === 'caireGiver' && (
        <>
          <Tab.Screen name="HomeScreen" component={HomeStack} options={{ headerShown: false, tabBarLabel: '' }} />
          <Tab.Screen name="Map" component={Map} options={{ headerShown: false, tabBarLabel: '' }} />
          <Tab.Screen name="Chats" component={Chats} options={{ headerShown: false, tabBarLabel: '' }} />
          <Tab.Screen name="Notification" component={Notification} options={{ headerShown: false, tabBarLabel: '' }} />
          <Tab.Screen name="Settings" component={SettingsScreen} options={{ headerShown: false,tabBarLabel: '' }} />
        </>
      )}
      {userInfo.role === 'patient' && (
        <>
          <Tab.Screen name="HomeScreen" component={HomeStack} options={{ headerShown: false, tabBarLabel: '' }} />
          <Tab.Screen name="DeviceScreen" component={DeviceScreen} options={{ tabBarLabel: '' }} />
          <Tab.Screen name="Chats" component={Chats} options={{ tabBarLabel: '' }} />
          <Tab.Screen name="Settings" component={SettingsScreen} options={{ tabBarLabel: '' }} />

        </>
      )}
    </Tab.Navigator>
  );
}

export default TabNavigator;
