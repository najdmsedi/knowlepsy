import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/Home/HomeScreen';
import Ionicons from 'react-native-vector-icons/Ionicons';
import DeviceScreen from '../screens/Device/DeviceScreen';
import SettingsScreen from '../screens/settings/SettingsScreen';
import ScanScreen from '../components/ScanScreen';
import { useContext, useEffect, useState } from 'react';
import BleManager from 'react-native-ble-manager';
import { useSetRecoilState } from 'recoil';
import { ConnectedAtom } from '../atoms';
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

import InviteDoctor from '../screens/InviteDoctor';
import PushNotificationConfig from './../../src/services/NotificationService';
// import createNotificationChannel from './ServiceNotification'
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import messaging from '@react-native-firebase/messaging';
import PushNotification from 'react-native-push-notification';
import Toast from 'react-native-toast-message';
import { BASE_URL } from '../config';
import InvitationPage from '../components/messenger/InvitationPage';

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
  InviteDoctor: undefined;
  InvitationPage: undefined;
  Map: undefined;
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
      <Stack.Screen name="Temperature" component={Temperature} options={{ headerLeft: () => <CustomBackButton />, title: '' }} />
      <Stack.Screen name="Steps" component={Steps} options={{ headerLeft: () => <CustomBackButton />, title: '' }} />
      <Stack.Screen name="HeartRate" component={HeartRate} options={{ headerLeft: () => <CustomBackButton />, title: '' }} />
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
      <Stack.Screen name="InviteDoctor" component={InviteDoctor} options={{ headerLeft: () => <CustomBackButton destination='Chats' />, title: '' }} />
      <Stack.Screen name="ChatScreen" component={ChatScreen} options={{ headerLeft: () => <CustomBackButton destination='Chats' />, title: '' }} />
      <Stack.Screen name="InvitationPage" component={InvitationPage} options={{ headerLeft: () => <CustomBackButton destination='Chats' />, title: '' }} />
    </Stack.Navigator>
  );
};

function TabNavigator() {
  const { userInfo } = useContext(AuthContext);
  const [fcmToken, setFcmToken] = useState<string | null>(null);

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
          console.log("pressssssssssss", data);
        },
      });
    });

    const unsubscribeOnNotificationOpenedApp = messaging().onNotificationOpenedApp(remoteMessage => {
      console.log("unsubscribeOnNotificationOpenedApp");

      const { data } = remoteMessage;
      handleNotificationClick(data);
    });

    messaging().getInitialNotification().then(remoteMessage => {
      console.log("messaging().getInitialNotification()");

      if (remoteMessage && remoteMessage.data) {
        handleNotificationClick(remoteMessage.data);
      }
    });

    const getToken = async () => {
      const token = await messaging().getToken() as any;
      setFcmToken(token);
      console.log("Tokens =", token.token);
    };

    const checkAndUpdateToken = async (userId: string) => {
      console.log("lezm netada hna");

      const token = await messaging().getToken() as any;
      setFcmToken(token.token);
      console.log("en route f thniaaaa");

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
    checkAndUpdateToken(userInfo._id)

    return () => {
      unsubscribeOnMessage();
      unsubscribeOnNotificationOpenedApp();
      getToken();
      checkAndUpdateToken(userInfo._id)
    };
  }, [userInfo]);

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
            default:
              iconName = 'circle';
              break;
          }
          return <Ionicons name={iconName} size={focused ? 35 : 25} color="#8A57ED" />;
        },
        tabBarStyle: ((route) => {
          const routeName = getFocusedRouteNameFromRoute(route) ?? "";
          if (routeName === 'ScanScreen' || routeName === 'Temperature' || routeName === 'HeartRate' || routeName === 'Steps' || routeName === 'EditProfile' || routeName === 'Stress' || routeName === 'ChatScreen' || routeName === 'InviteDoctor' || routeName === 'InvitationPage') {
            return { display: 'none' };
          }
          return {};
        })(route),
      })}
    >
      {userInfo.role === 'doctor' && (
        <>
          <Tab.Screen name="HomeScreen" component={HomeStack} options={{ headerShown: false, tabBarLabel: '' }} />
          <Tab.Screen name="Map" component={Map} options={{ headerShown: false, tabBarLabel: '' }} />
          <Tab.Screen name="Chats" component={Chats} options={{ headerShown: false, tabBarLabel: '' }} />

          <Tab.Screen name="Settings" component={SettingsScreen} options={{ tabBarLabel: '' }} />
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
