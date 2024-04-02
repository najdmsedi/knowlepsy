
import { useEffect, useState } from 'react';
import { PermissionsAndroid, Platform,NativeEventEmitter, NativeModules } from 'react-native';
import BleManager from 'react-native-ble-manager';
import UtilsDate from './UtilDate';
import { Buffer } from 'buffer';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Device = {
  id: string;
  name: string;
};

interface BluetoothServicesType {
  initializeBluetooth(): Promise<boolean>;
  scan():void;
  connectToDevice(device: Device): Promise<void>;
  allDevices: Device[];
  connectedDevice: any | null;
  disconnectFromDevice(): void;
  isConnected: Boolean | null;
  redirectToAnotherPage(navigation: any, pageName: string): Promise<void>;
  checkState():Promise<Boolean>;
}

function BluetoothServices():BluetoothServicesType  {
  const [allDevices, setAllDevices] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [services, setServices] = useState([]);
  const [serviceTx, setServiceTx] = useState(null);
  const [serviceRx, setServiceRx] = useState(null);
  const [characteristicTx, setCharacteristicTx] = useState(null);
  const [characteristicRx, setCharacteristicRx] = useState(null);
  const [dataSubscriptionListener, setDataSubscriptionListener] = useState(null);
  const [connectedDevice, setConnectedDevice] = useState();
  const { BleManagerModule } = NativeModules;
  const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);
  
  const writeService = {
    serviceUuid: "6e400001-b5a3-f393-e0a9-e50e24dcca9e",
    characteristicUuid: "6e400002-b5a3-f393-e0a9-e50e24dcca9e"
  };
  const notifyService = {
    serviceUuid: "6e400001-b5a3-f393-e0a9-e50e24dcca9e",
    characteristicUuid: "6e400003-b5a3-f393-e0a9-e50e24dcca9e"
  };

  const redirectToAnotherPage = async (navigation, pageName) => {
    if (navigation && pageName) {
      navigation.navigate(pageName);
    }
  };

  const checkState = async (): Promise<Boolean> => {
    try {
      const connectedPeripherals = await BleManager.getConnectedPeripherals([]);
      if (connectedPeripherals.length > 0) {
        console.log('Phone is connected to at least one device.');
        console.log('Connected devices:', connectedPeripherals);
        await AsyncStorage.setItem('checkState',connectedPeripherals[0].id );
        return true
      } else {
        console.log('Phone is not connected to any device.');
        await AsyncStorage.removeItem('checkState');
        return false
      } 
    } catch (error) {
      console.error('Error checking connection status:', error);
    }
  }

  const initializeBluetooth = async (): Promise<boolean> => {
    if (Platform.OS === 'android') {  
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        BleManager.start({ showAlert: false })
        const isEnabled = await BleManager.checkState();
        if (!isEnabled) {
          console.log('Bluetooth is off');
          return false; 
        }
        else{
          return true;
        }
      } else {
        console.log('Bluetooth permission not granted');
        return false; 
      }
    } else {
      BleManager.start({ showAlert: false });
      console.log('Bluetooth initialized');
      return true; 
    }
  }; 
  
  const scan = async () => {
    setConnectedDevice(null)
    if (Platform.OS === 'android' && !(await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION))) {
      console.log('No permissions to scan for Bluetooth devices.');
      return;
    }
    BleManager.scan([], 5, true).then(() => {
    }).catch(error => {
      console.error("Error starting scan:", error);
    });
    const handleDiscoverPeripheral = (peripheral) => {
      if (peripheral && (peripheral.name?.startsWith("Ally") || peripheral.name?.startsWith("Knowlepsy"))) {
        setAllDevices(prevDevices => {
          if (!prevDevices.find(prevDevice => prevDevice.id === peripheral?.id)) {
            return [...prevDevices, peripheral];
          }
          return prevDevices;
        });        
      }
    };
    const bleEmitter = new NativeEventEmitter();
    bleEmitter.addListener('BleManagerDiscoverPeripheral', handleDiscoverPeripheral);
    setTimeout(() => {
      BleManager.stopScan().then(() => {
        bleEmitter.removeAllListeners('BleManagerDiscoverPeripheral');
      }).catch(error => {
        console.error("Error stopping scan:", error);
      });
    }, 5000);
  };

  const connect = async (device) => {
    try {
      await BleManager.connect(device.id);
      setConnectedDevice(device.id);
      setIsConnected(true)
    } catch (error) {
      console.error('Connection error', error);
    }
  };

  const disconnectFromDevice = async () => {
    setIsConnected(false)
    //FIX_ME
    const connectedPeripherals = await BleManager.getConnectedPeripherals([]);
    if (connectedPeripherals.length > 0) {
      console.log('Phone is connected to at least one device.');
      console.log('Connected devices:', connectedPeripherals);
      BleManager.disconnect(connectedPeripherals[0].id);
    }  
  };

  const getCharacteristics = async (device, onCharacteristicsRetrieved) => {
    try {
      const services = await BleManager.retrieveServices(device.id);
      const serviceTx = services.characteristics.find(
        (c) => c.service === writeService.serviceUuid && c.characteristic === writeService.characteristicUuid,
      );
      const serviceRx = services.characteristics.find(
        (c) => c.service === notifyService.serviceUuid && c.characteristic === notifyService.characteristicUuid,
      );

      if(serviceTx.characteristic === writeService.characteristicUuid){
        const characteristicsTx = await serviceTx.characteristic;
        setCharacteristicRx(characteristicsTx)
        onCharacteristicsRetrieved(serviceTx, serviceRx);
      }

      if(serviceRx.characteristic === notifyService.characteristicUuid){
        const characteristicsRx = await serviceRx.characteristic;
        setCharacteristicTx(characteristicsRx)
      }
      
      setServiceTx(serviceTx);
      setServiceRx(serviceRx);
      if (serviceTx && serviceRx) {
        // console.log('Write Characteristic:', serviceTx.descriptors[0].uuid);
        // console.log('Notify Characteristic:', serviceRx.descriptors[0].uuid);
      } else {
        console.log('Required services not found.');
      }
    } catch (error) {
      console.error(error);
    }
  };

  function getSyncData() {
    const now = new Date();
    const formattedDate = UtilsDate.formatYYYYMMDD(now);
    const formattedTime = UtilsDate.formatHHMMSS(now);
    const jsonString = `*#{\"request\":\"date_time\",\"action\":\"SET\",\"value\":{\"date\":\"${formattedDate}\",\"time\":\"${formattedTime}\"}}#*`;
    return jsonString;
  }

  const writeSyncData = async (device, serviceTx) => {
    try {
      const syncData = getSyncData();
      for (let i = 0; i < syncData.length; i += 20) {
        const end = i + 20 < syncData.length ? i + 20 : syncData.length;
        const chunk = syncData.substring(i, end);
        const list = Buffer.from(chunk, "utf-8").toJSON().data;
        console.log("device",device.id,"serviceRx",serviceTx.service,"characteristicUuid",serviceTx.characteristic);
        await BleManager.write(
          device.id,
          serviceTx.service,
          serviceTx.characteristic,
          list,
          20
        );
      }
    } catch (ex) {
      console.log("An error occurred during sync data write:", ex);
      throw ex;
    }
  };
  
  const readIncomingData = async (device, serviceRx) => { 
      let responseData = "";
      const peripheralId = device.id;
      const characteristicUUID = notifyService.characteristicUuid;
  
        await BleManager.retrieveServices(peripheralId).then((services) => {
          console.log("services",services);
        })
  
        await BleManager.startNotification(peripheralId, serviceRx.service, characteristicUUID);
          
        bleManagerEmitter.addListener('BleManagerDidUpdateValueForCharacteristic',
        ({ value, peripheral, characteristic, service }) => {       
            const decoded = Buffer.from(value, 'base64').toString('utf-8'); 
            if (decoded.includes("--start--")) {
              responseData = decoded;
            } else {
              responseData += decoded;
            }
            if (decoded.includes("--end--") || decoded.includes("end--")) {
              const data = extractData(responseData);
              if (data && data['data']) {
                addData(data['data']);
              }
              responseData = "";
            }
          }
        );
  };

  const extractData = (data) => {
    try {
      const jsonString = data.replaceAll('--start--', '').replaceAll('--end--', '');
      return JSON.parse(jsonString);
    } catch (error) {
      return null;
    }
  };
    
  const addData = async (data) => {
    try {        
      const response = await fetch('http://172.187.93.156:3000/addData', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error('Failed to add data');
      }
    } catch (e) {
      console.log('Error adding data:', e);
    }
  };

  async function connectToDevice(device) {
    try {
      await connect(device);
      await getCharacteristics(device, async (serviceTx,serviceRx) => {
        await writeSyncData(device, serviceTx); 
        readIncomingData(device,serviceRx)        
      });
      
      checkState()
    } catch (error) {
      console.log("connectToDevice", error);
    }
  }

  useEffect(() => {
    console.log("BluetoothServices => useEffect");
    checkState()
  }, []); 
  
  return {
    initializeBluetooth,
    scan,
    connectToDevice,
    allDevices,
    connectedDevice,
    isConnected,
    disconnectFromDevice,
    redirectToAnotherPage,
    checkState
  };
  
};
export default BluetoothServices;
