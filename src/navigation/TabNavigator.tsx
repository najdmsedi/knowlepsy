import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/Home/HomeScreen';
import Ionicons from 'react-native-vector-icons/Ionicons';
import SleepTrackScreen from '../screens/sleepTracking/SleepTrackScreen';
import DeviceScreen from '../screens/Device/DeviceScreen';
import SettingsScreen from '../screens/settings/SettingsScreen';
import ScanScreen from '../components/ScanScreen';
import { useContext, useEffect } from 'react';
import BleManager from 'react-native-ble-manager';
import PushNotification from 'react-native-push-notification';
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

const Tab = createBottomTabNavigator();
// const Stack = createNativeStackNavigator();
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
};

type RootTabParamList = {
  HomeScreen: undefined;
  DeviceScreen: undefined;
  Settings: undefined;
  SleepTrackScreen: undefined;
};
const HomeStack = ({ navigation }:any) => {
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
      <Stack.Screen name="ScanScreen" component={ScanScreen} options={{ headerLeft: () => <CustomBackButton />}}/>
      <Stack.Screen name="Temperature" component={Temperature} options={{ headerLeft: () => <CustomBackButton />,title: ''}}/>
      <Stack.Screen name="Steps" component={Steps} options={{ headerLeft: () => <CustomBackButton />,title: ''}} />
      <Stack.Screen name="HeartRate" component={HeartRate} options={{ headerLeft: () => <CustomBackButton />,title: ''}}/>
      <Stack.Screen name="Stress" component={Stress} options={{ headerLeft: () => <CustomBackButton />,title: ''}}/>
      <Stack.Screen name="EditProfile" component={EditProfile} options={{ headerLeft: () => <CustomBackButton destination='Settings'/>,title: ''}}/>
      <Stack.Screen name="ChangePassword" component={ChangePassword} options={{ headerLeft: () => <CustomBackButton destination='Settings'/>,title: ''}}/>
    </Stack.Navigator>
  );
};

function TabNavigator() {
  const { userInfo } = useContext(AuthContext);
console.log("useuse",userInfo);

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
            default:
              iconName = 'circle'; // Default icon
              break;
          }
          return <Ionicons name={iconName} size={focused ? 35 : 25} color="#8A57ED" />;
        },
      })}
    >
      { userInfo.role === 'doctor' && (
        <>
          <Tab.Screen name="HomeScreen" component={HomeStack} options={{ headerShown: false, tabBarLabel: '' }} />
          <Tab.Screen name="Settings" component={SettingsScreen} options={{ tabBarLabel: '' }} />
        </>
      )}
      { userInfo.role === 'patient' && (
        <>
          <Tab.Screen name="HomeScreen" component={HomeStack} options={{ headerShown: false, tabBarLabel: '' }} />
          <Tab.Screen name="DeviceScreen" component={DeviceScreen} options={{ tabBarLabel: '' }} />
          <Tab.Screen name="Settings" component={SettingsScreen} options={{ tabBarLabel: '' }} />
        </>
      )}
    </Tab.Navigator>
  );
}

export default TabNavigator;
