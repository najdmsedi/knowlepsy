
import { useEffect, useState } from 'react';
import { PermissionsAndroid, Platform,NativeEventEmitter, NativeModules } from 'react-native';
import BleManager from 'react-native-ble-manager';
import UtilsDate from './UtilDate';
import { Buffer } from 'buffer';


type Device = {
  id: string;
  name: string;
  // Add other necessary properties for the device
};


interface BluetoothServicesType {
  initializeBluetooth(): Promise<boolean>;
  scan():void;
  connectToDevice(device: Device): Promise<void>;
  allDevices: Device[];
  connectedDevice: Device | null;
  disconnectFromDevice():void;
}

function BluetoothServices():BluetoothServicesType  {
  const writeService = {
    serviceUuid: "6e400001-b5a3-f393-e0a9-e50e24dcca9e",
    characteristicUuid: "6e400002-b5a3-f393-e0a9-e50e24dcca9e"
  };
  
  const notifyService = {
    serviceUuid: "6e400001-b5a3-f393-e0a9-e50e24dcca9e",
    characteristicUuid: "6e400003-b5a3-f393-e0a9-e50e24dcca9e"
  };

  let [allDevices, setAllDevices] = useState([]);
  let [isConnected, setIsConnected] = useState(false);
  let [services, setServices] = useState([]);
  let [serviceTx, setServiceTx] = useState(null);
  let [serviceRx, setServiceRx] = useState(null);
  let [characteristicTx, setCharacteristicTx] = useState(null);
  let [characteristicRx, setCharacteristicRx] = useState(null);
  let [connectedDevice, setConnectedDevice] = useState(null);
  let [dataSubscriptionListener, setDataSubscriptionListener] = useState(null);

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
      // For iOS, the permission will be requested when starting the manager
      BleManager.start({ showAlert: false });
      console.log('Bluetooth initialized');
      return true; 
    }
  }; 
  const scan = async () => {
    if (Platform.OS === 'android' && !(await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION))) {
      console.log('No permissions to scan for Bluetooth devices.');
      return;
    }
    // Start the scan
    BleManager.scan([], 5, true).then(() => {
      console.log("Scanning started");
    }).catch(error => {
      console.error("Error starting scan:", error);
    });
    // Listen for scan results
    const handleDiscoverPeripheral = (peripheral) => {
      if (peripheral && (peripheral.name?.startsWith("Ally") || peripheral.name?.startsWith("Knowlepsy"))) {
        setAllDevices(prevDevices => {
          // Check if the device ID already exists in the previous devices
          if (!prevDevices.find(prevDevice => prevDevice.id === peripheral?.id)) {
            // Add the device to the array of previous devices
            return [...prevDevices, peripheral];
          }
          // Return the previous devices array unchanged if the device already exists
          return prevDevices;
        });        
      }
    };
    // Instantiate the NativeEventEmitter
    const bleEmitter = new NativeEventEmitter();
    // Add event listener for discovered devices
    bleEmitter.addListener('BleManagerDiscoverPeripheral', handleDiscoverPeripheral);
    // Stop the scan after a timeout (5 seconds in this case)
    setTimeout(() => {
      BleManager.stopScan().then(() => {
        console.log("Scan stopped");
        bleEmitter.removeAllListeners('BleManagerDiscoverPeripheral');
        console.log('Discovered devices:', allDevices);
      }).catch(error => {
        console.error("Error stopping scan:", error);
      });
    }, 5000);
  };
  const connect = async (device) => {
    try {
      await BleManager.connect(device.id);
      setConnectedDevice(device);
      console.log('Connected to ' + device.id);
    } catch (error) {
      console.error('Connection error', error);
    }
  };
  const disconnectFromDevice = () => {
    console.log('disconnectFromDevice');
    if (connectedDevice) {
      BleManager.disconnect(connectedDevice.id);
    }
  };
  const getCharacteristics = async (device, onCharacteristicsRetrieved) => {
    try {
      // Retrieve the list of services on the device
      const services = await BleManager.retrieveServices(device.id);
      // Find the write service by UUID
      const serviceTx = services.characteristics.find(
        (c) => c.service === writeService.serviceUuid && c.characteristic === writeService.characteristicUuid,
      );
      // Find the notify service by UUID
      const serviceRx = services.characteristics.find(
        (c) => c.service === notifyService.serviceUuid && c.characteristic === notifyService.characteristicUuid,
      );
      if(serviceTx.characteristic === writeService.characteristicUuid){
        const characteristicsTx = await serviceTx.characteristic;
        setCharacteristicRx(characteristicsTx)
        onCharacteristicsRetrieved(serviceTx, characteristicTx);
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
  const writeSyncData = async (device,serviceTx, characteristicTx) => {
    let status = false;
    try {
      const syncData = getSyncData();
      for (let i = 0; i < syncData.length; i += 20) {
        const end = (i + 20 < syncData.length) ? i + 20 : syncData.length;
        const chunk = syncData.substring(i, end);
        let list:number[]
        list = Buffer.from(chunk, 'utf-8').toJSON().data    
        await BleManager.write(
          device.id,
          serviceTx.service,
          serviceTx.characteristic,list,20);
      }
      status = true;
    } catch (ex) {
      console.log("An error occurred:", ex);
      // Disconnect from the device
      await BleManager.disconnect(device.id);
    }
    return status;
  };
  function getSyncData() {
    const now = new Date();
    const formattedDate = UtilsDate.formatYYYYMMDD(now);
    const formattedTime = UtilsDate.formatHHMMSS(now);
    const jsonString = `*#{\"request\":\"date_time\",\"action\":\"SET\",\"value\":{\"date\":\"${formattedDate}\",\"time\":\"${formattedTime}\"}}#*`;
    return jsonString;
  }
  
  const readIncomingData = async (characteristicRx) => {
    let responseData = '';
    try {
      // await BleManager.startNotification(
      //   characteristicRx.deviceId,
      //   characteristicRx.service,
      //   characteristicRx.characteristic
      // );
      console.log("aaaaaaaaaaaaaaaaaaaa");
      
      console.log(characteristicRx);

      // const bleManagerEmitter = new NativeEventEmitter(NativeModules.BleManager);
      // const dataSubscriptionListener = bleManagerEmitter.addListener(
      //   'BleManagerDidUpdateValueForCharacteristic',
      //   ({ value, peripheral, characteristic, service }) => {
      //     const decoded = Buffer.from(value).toString('utf8');
      //     if (decoded.includes('--start--')) {
      //       responseData = decoded;
      //     } else {
      //       responseData += decoded;
      //     }
      //     if (responseData.includes('--end--')) {
      //       const data = extractData(responseData);
      //       if (data && data['data']) {
      //         addData(data['data']);
      //       }
      //     }
      //   }
      // );
  
      // Remember to remove the listener when you are done
      return () => dataSubscriptionListener.remove();
    } catch (ex) {
      console.log('error from scanresults listener', ex);
    }
  };


const extractData = (data) => {
  try {
    const jsonString = data.replace('--start--', '').replace('--end--', '');
    return JSON.parse(jsonString);
  } catch (e) {
    return null;
  }
};

const addData = async (data) => {
  try {
    // Replace 'your_connection_string' with your actual MongoDB connection string
    const uri = 'your_connection_string';
    // const client = new MongoClient(uri);

    // await client.connect();
    // const database = client.db('data');
    // const usersCollection = database.collection('data');

    // await usersCollection.insertMany([data]);
    console.log('data added successfully!');
    console.log(`Data added at ${new Date().toLocaleTimeString()}`);

    // await client.close();
  } catch (e) {
    console.log('Error adding data:', e);
    // Handle reconnection logic or other error handling here
  }
};

  async function connectToDevice(device) {
    try {
      await connect(device);
  
      await getCharacteristics(device, async (serviceTx, characteristicTx) => {
        await writeSyncData(device, serviceTx, async characteristicTx  =>{
          await readIncomingData(characteristicRx);
          console.log("fin");
          
        })
      });
  

    } catch (error) {
      console.log("connectToDevice", error);
    }
  }



  useEffect(() => {
    // This code will run after `serviceRx` has been updated
    // console.log(serviceRx);
    // console.log(serviceTx);
    // console.log(characteristicRx);
    // console.log(characteristicTx);

  }, [serviceRx,serviceTx,characteristicRx,characteristicTx]); // The effect depends on `serviceRx` and will run when it changes
  
  return {
    initializeBluetooth,
    scan,
    connectToDevice,
    allDevices,
    connectedDevice,
    disconnectFromDevice
  };
};
export default BluetoothServices;
