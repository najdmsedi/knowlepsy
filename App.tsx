import React, { useEffect, useState } from 'react';
import { Alert, PermissionsAndroid, Text, View } from 'react-native';
import BleManager from 'react-native-ble-manager';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AuthProvider } from './src/context/AuthContext';
import AppNav from './src/navigation/AppNav';
import { RecoilRoot } from 'recoil';
import Toast from 'react-native-toast-message';
import BluetoothModal from './src/components/firstLoad/BluetoothModal';
import { toastConfig } from './src/toast';
import BluetoothDisableModal from './src/components/firstLoad/BluetoothDisableModal';
import PushNotification from 'react-native-push-notification';

function App() {
  const [showModal, setShowModal] = useState(false);
  const [showBluetoothDisableModal, setShowBluetoothDisableModal] = useState(false);
  const [bluetoothEnabled, setBluetoothEnabled] = useState(false);
  const [isBluetoothCheckComplete, setIsBluetoothCheckComplete] = useState(false);

  async function requestPermissions() {
    let isBluetoothEnabled = false;
    try {
      const state = await BleManager.checkState();
      isBluetoothEnabled = state === 'on';
      setBluetoothEnabled(isBluetoothEnabled);

      if (!isBluetoothEnabled) {
        setShowBluetoothDisableModal(true)
      } else {
        await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
        ]);

        const bluetoothPermissionGranted = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN);
        
        if (!bluetoothPermissionGranted) {
          setShowModal(true)
          return (
            <BluetoothModal showModal={showModal} setShowModal={setShowModal} />
          )
        }
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
          {
            title: 'Notification Permission',
            message:
              'This app needs permission to show notifications.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('Notification permission granted');
        } else {
          console.log('Notification permission denied');
        }
      }
     
    } catch (error) {
      console.error('Error requesting permissions:', error);
    } finally {
      setIsBluetoothCheckComplete(true);
    }
  }

  useEffect(() => {
    PushNotification.requestPermissions();
    requestPermissions();
  }, []);

  // const checkConnectedDevice = async () => {
  //   if(isBluetoothCheckComplete)
  //    {return await BleManager.getConnectedPeripherals()}
  // }


  // useEffect(() => {
  //   if(isBluetoothCheckComplete)
  //   {BleManager.getConnectedPeripherals().then(res => {
  //     console.log("checkstate",res);
  //     if (res.length == 0){
  //       PushNotification.localNotification({
  //         channelId: "channel-id",
  //         title: "Device disconnected",
  //         message: "Open the app and pair device",
  //     });
  //     }else{
  //       PushNotification.localNotification({
  //         channelId: "channel-id",
  //         title: "Device connected",
  //         message: "Device is connected",
  //     });
  //     }
      
  //   }) }
  // }, [checkConnectedDevice]);
  
  // if (!isBluetoothCheckComplete) {
  //   return <View><Text>Checking Bluetooth status...</Text></View>;
  // }

  if (!bluetoothEnabled) {
    return <BluetoothDisableModal showModal={showBluetoothDisableModal} setShowBluetoothDisableModal={setShowBluetoothDisableModal} />;
  }





  return (
    <GestureHandlerRootView>
      <RecoilRoot>
        <AuthProvider>
          <BluetoothModal showModal={showModal} setShowModal={setShowModal} />
          <AppNav />
          <Toast config={toastConfig as any} />
        </AuthProvider>
      </RecoilRoot>
    </GestureHandlerRootView>
  );
}

export default App;
