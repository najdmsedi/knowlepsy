import React, { useContext, useEffect, useState } from 'react';
import { Alert, Linking, PermissionsAndroid } from 'react-native';
import BleManager from 'react-native-ble-manager';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AuthContext, AuthProvider } from './src/context/AuthContext';
import AppNav from './src/navigation/AppNav';
import { RecoilRoot } from 'recoil';
import Toast from 'react-native-toast-message';
import BluetoothModal from './src/components/firstLoad/BluetoothModal';
import { toastConfig } from './src/toast';
import BluetoothDisableModal from './src/components/firstLoad/BluetoothDisableModal';
import PushNotification from 'react-native-push-notification';
import SplashScreen from 'react-native-splash-screen'; // Import SplashScreen library
import messaging from '@react-native-firebase/messaging';
import PushNotificationConfig from './src/services/NotificationService';
// import createNotificationChannel from './ServiceNotification'
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from './src/navigation/TabNavigator';
import { BASE_URL } from './src/config';

function App() {
  const [showModal, setShowModal] = useState(false);
  const [showBluetoothDisableModal, setShowBluetoothDisableModal] = useState(false);
  const [bluetoothEnabled, setBluetoothEnabled] = useState(false);
  const [isBluetoothCheckComplete, setIsBluetoothCheckComplete] = useState(false);
  const [fcmToken, setFcmToken] = useState<string | null>(null); // Add state for FCM token
  // const { userInfo } = useContext(AuthContext);
  // console.log("userInfo",userInfo);
  
  useEffect(() => {
    const splashTimeout = setTimeout(() => {
      SplashScreen.hide();
    }, 2500);

    return () => clearTimeout(splashTimeout);
  }, []);

  useEffect(() => {
    const requestPermissions = async () => {
      let isBluetoothEnabled = false;
      try {
        const state = await BleManager.checkState();
        isBluetoothEnabled = state === 'on';
        setBluetoothEnabled(isBluetoothEnabled);

        if (!isBluetoothEnabled) {
          setShowBluetoothDisableModal(true);
        } else {
          await PermissionsAndroid.requestMultiple([
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
          ]);

          const bluetoothPermissionGranted = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN);

          if (!bluetoothPermissionGranted) {
            setShowModal(true);
          }

          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
            {
              title: 'Notification Permission',
              message: 'This app needs permission to show notifications.',
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
    };

    PushNotification.requestPermissions();
    requestPermissions();
  }, []);


  async function requestUserPermission() {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('Authorization status:', authStatus);
    }
  }

  const getToken = async () => {
    const token = await messaging().getToken();
    console.log("Token =", token);
  }
  useEffect(() => {
    requestUserPermission()
    getToken()
  }, [])
  if (!bluetoothEnabled) {
    return <BluetoothDisableModal showModal={showBluetoothDisableModal} setShowBluetoothDisableModal={setShowBluetoothDisableModal} />;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
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
