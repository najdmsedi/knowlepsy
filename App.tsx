import * as React from 'react';
import { PermissionsAndroid } from 'react-native';
import BleManager from 'react-native-ble-manager';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AuthProvider } from './src/context/AuthContext';
import AppNav from './src/navigation/AppNav';
import { RecoilRoot } from "recoil"

function App(){
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
            console.log('Nearby device permission denied. Please enable it manually in app settings.');
          }
          console.log('Permissions granted successfully.');
        } catch (error) {
          console.error('Error requesting permissions:', error);
        }
      }
      useEffect(() => {
        BleManager.enableBluetooth()
        requestPermissions();
      }, []);
  return (
    <GestureHandlerRootView>
      <RecoilRoot>
      <AuthProvider>
        <AppNav />
      </AuthProvider>
      </RecoilRoot>
    </GestureHandlerRootView>

  )
}
export default App;