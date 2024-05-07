import * as React from 'react';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from './src/screens/Home/HomeScreen';
import ScanScreen from './src/screens/Device/ScanScreen';
import SleepTrackScreen from './src/screens/sleepTracking/SleepTrackScreen';
import DeviceScreen from './src/screens/Device/DeviceScreen';
import SettingsScreen from './src/screens/settings/SettingsScreen';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Image, PermissionsAndroid, Platform, Text, TextInput, TouchableOpacity, View } from 'react-native';
import BleManager from 'react-native-ble-manager';
import { Button, Input } from 'react-native-elements';
import { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { color } from 'react-native-elements/dist/helpers';
import LoginScreen from './src/screens/Auth/Login/LoginScreen';
import RegisterScreen from './src/screens/Auth/Register/Register';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SplashScreen from 'react-native-splash-screen';
import { AuthProvider } from './src/context/AuthContext';
import AppNav from './src/navigation/AppNav';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

// const homeName = "HomeScreen";
// const deviceName = "DeviceScreen";
// const settingsName = "Settings";
// const sleepTracking = "SleepTrackScreen";

// function TabNavigator() {
//   return (
//     <Tab.Navigator initialRouteName={"TabNavigator"}
//       screenOptions={({ route }) => ({
//         tabBarIcon: ({ focused }) => {
//           let iconName; let rn = route.name;
//           if (route.name === homeName) {
//             iconName = focused ? 'home' : 'home-outline';
//           } else if (route.name === sleepTracking) {
//             iconName = focused ? 'moon' : 'moon-outline';
//           } else if (route.name === deviceName) {
//             iconName = focused ? 'watch' : 'watch-outline';
//           } else if (route.name === settingsName) {
//             iconName = focused ? 'settings' : 'settings-outline';
//           }
//           return <Ionicons name={iconName!} size={focused ? 35 : 25} color="#8A57ED" />;
//         },
//       })}>
//       <Tab.Screen name={homeName} component={HomeScreen} options={{  tabBarLabel: '' }} />
//       <Tab.Screen name={sleepTracking} component={SleepTrackScreen} options={{ tabBarLabel: '' }} />
//       <Tab.Screen name={deviceName} component={DeviceScreen} options={{ tabBarLabel: '' }} />
//       <Tab.Screen name={settingsName} component={SettingsScreen} options={{ tabBarLabel: '' }} />
//     </Tab.Navigator>
//   )
// }

// function App() {
//   // AsyncStorage.removeItem('isLoggedIn') 
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   async function requestPermissions() {
//     try {
//       const result = await PermissionsAndroid.requestMultiple([
//         PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
//         PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
//         PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
//       ]);
//       if (
//         result[PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN] !==
//         PermissionsAndroid.RESULTS.GRANTED
//       ) {
//         console.log('Nearby device permission denied. Please enable it manually in app settings.');
//       }
//       console.log('Permissions granted successfully.');
//     } catch (error) {
//       console.error('Error requesting permissions:', error);
//     }
//   }
//   useEffect(() => {
//     BleManager.enableBluetooth()
//     requestPermissions();
//   }, []);

//   const handleLogin = () => {
//     setIsLoggedIn(true);
//     console.log("marhaban");

//   };
//   const handleLogOut = () => {
//     setIsLoggedIn(false);
    
//   };

//   async function getData() {
//     const data = await AsyncStorage.getItem('isLoggedIn') as unknown as boolean;
//     console.log(data, 'at app.jsx');
//     setIsLoggedIn(data);
//   }
//   useEffect(() => {
//     getData();
//     setTimeout(() => {
//       SplashScreen.hide();
//     }, 300);
//   }, [isLoggedIn]);
//   return (
//     <NavigationContainer>
//     <Stack.Navigator>
//     {isLoggedIn ? (
//       <Stack.Screen name="Main" component={TabNavigator} options={{ headerShown: false }} />
//     ) : (
//       <>
//         <Stack.Screen name="LoginScreen" component={LoginScreen} options={{ headerShown: false }} initialParams={{ onLogin: handleLogin}} />
//         <Stack.Screen name="RegisterScreen" component={RegisterScreen} options={{ headerShown: false }} />
//       </>
//     )}
//     <Stack.Screen name="ScanScreen" component={ScanScreen} />
//     {/* <Stack.Screen name="HomeScreen" component={HomeScreen} /> */}
//     <Stack.Screen name="SleepTrackScreen" component={SleepTrackScreen}  />
//     <Stack.Screen name="DeviceScreen" component={DeviceScreen}  />
//     <Stack.Screen name="SettingsScreen" component={SettingsScreen} options={{ headerShown: false }} initialParams={{ onLoOut: handleLogOut }} />
//   </Stack.Navigator>
//     </NavigationContainer>
//   );
// }


// export default App;


function App(){
  return (
    <GestureHandlerRootView>
      <AuthProvider>
        <AppNav />
      </AuthProvider>
    </GestureHandlerRootView>

  )
}
export default App;
