import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/Home/HomeScreen';
import Ionicons from 'react-native-vector-icons/Ionicons';
import SleepTrackScreen from '../screens/sleepTracking/SleepTrackScreen';
import DeviceScreen from '../screens/Device/DeviceScreen';
import SettingsScreen from '../screens/settings/SettingsScreen';
import ScanScreen from '../components/ScanScreen';
import { useEffect } from 'react';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const homeName = "HomeScreen";
const deviceName = "DeviceScreen";
const settingsName = "Settings";
const sleepTracking = "SleepTrackScreen";

const HomeStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="ScanScreen" component={ScanScreen} />
    </Stack.Navigator>
  );
};

function TabNavigator() {
  return (
    <Tab.Navigator initialRouteName={"TabNavigator"}
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused }) => {
          let iconName; let rn = route.name;
          if (route.name === homeName) {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === sleepTracking) {
            iconName = focused ? 'moon' : 'moon-outline';
          } else if (route.name === deviceName) {
            iconName = focused ? 'watch' : 'watch-outline';
          } else if (route.name === settingsName) {
            iconName = focused ? 'settings' : 'settings-outline';
          }
          return <Ionicons name={iconName!} size={focused ? 35 : 25} color="#8A57ED" />;
        },
      })}
    >
      {/* options={{ headerShown: false}} */}
      <Tab.Screen name={homeName} component={HomeStack} options={{  headerShown: false,tabBarLabel: '' }} />
      <Tab.Screen name={sleepTracking} component={SleepTrackScreen} options={{ tabBarLabel: '' }} />
      <Tab.Screen name={deviceName} component={DeviceScreen} options={{ tabBarLabel: '' }} />
      <Tab.Screen name={settingsName} component={SettingsScreen} options={{ tabBarLabel: '' }} />
    </Tab.Navigator>
  )
}

export default TabNavigator;