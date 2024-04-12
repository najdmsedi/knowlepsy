import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from './src/screens/Home/HomeScreen';
import ScanScreen from './src/screens/Device/ScanScreen';
import SleepTrackScreen from './src/screens/sleepTracking/SleepTrackScreen';
import DeviceScreen from './src/screens/Device/DeviceScreen';
import SettingsScreen from './src/screens/settings/SettingsScreen';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { PermissionsAndroid, Platform } from 'react-native';
import BleManager from 'react-native-ble-manager';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const homeName = "Home";
const detailsName = "Details";
const settingsName = "Settings";
const sleepTracking = "Sleep Tracking";

function TabNavigator() {
  return (
    <Tab.Navigator initialRouteName={homeName}
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused }) => {
          let iconName; let rn = route.name;
          if (route.name === homeName) {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === sleepTracking) {
            iconName = focused ? 'moon' : 'moon-outline';
          } else if (route.name === detailsName) {
            iconName = focused ? 'watch' : 'watch-outline';
          } else if (route.name === settingsName) {
            iconName = focused ? 'settings' : 'settings-outline';
          }
          return <Ionicons name={iconName!} size={focused ? 35 : 25} color="#8A57ED" />;
        },
      })}>
      <Tab.Screen name={homeName} component={StackNavigator} options={{ headerShown: false, tabBarLabel: '' }} />
      <Tab.Screen name={sleepTracking} component={SleepTrackScreen} options={{ tabBarLabel: '' }} />
      <Tab.Screen name={detailsName} component={DeviceScreen} options={{ tabBarLabel: '' }} />
      <Tab.Screen name={settingsName} component={SettingsScreen} options={{ tabBarLabel: '' }} />
    </Tab.Navigator>
  )
}
function StackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name='HomeScreen' component={HomeScreen} />
      <Stack.Screen name='ScanScreen' component={ScanScreen} />
    </Stack.Navigator>
  )
}


function App() {
  async function requestPermissions() {
    try {
      const result = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
      ]);
      if (
        result[PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN] !==
        PermissionsAndroid.RESULTS.GRANTED
      ) {
        // Nearby device permission denied, guide user to enable it manually
        console.log('Nearby device permission denied. Please enable it manually in app settings.');
      }
      console.log('Permissions granted successfully.');
    } catch (error) {
      console.error('Error requesting permissions:', error);
    }
  }
  
  
  BleManager.enableBluetooth()
  // Call the function to request permissions
  requestPermissions();

  return (
    <NavigationContainer>
      <TabNavigator />
    </NavigationContainer>
  );
}


export default App;
