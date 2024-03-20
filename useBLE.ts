import { useEffect, useState } from 'react';
import { BleManager, Device, BleError, Characteristic } from 'react-native-ble-plx';
import { PermissionsAndroid, Platform } from 'react-native';
import base64 from 'react-native-base64';

// Import UtilsDate class
import UtilsDate from './UtilDate';
const bleManager = new BleManager();

interface BluetoothLowEnergyApi {
  requestPermissions(): Promise<boolean>;
  scanForPeripherals(): void;
  connectToDevice(device: Device): Promise<void>;
  disconnectFromDevice(): void;
  connectedDevice: Device | null;
  allDevices: Device[];
  heartRate: number;
}

// Write service UUIDs
const writeService = {
  serviceUuid: "6e400001-b5a3-f393-e0a9-e50e24dcca9e",
  characteristicUuid: "6e400002-b5a3-f393-e0a9-e50e24dcca9e"
};

// Notify service UUIDs
const notifyService = {
  serviceUuid: "6e400001-b5a3-f393-e0a9-e50e24dcca9e",
  characteristicUuid: "6e400003-b5a3-f393-e0a9-e50e24dcca9e"
};


function useBLE(): BluetoothLowEnergyApi {
  console.log("BluetoothLowEnergyApi");
  const [bleManager] = useState(() => new BleManager());
  const [allDevices, setAllDevices] = useState<Device[]>([]);
  const [connectedDevice, setConnectedDevice] = useState<Device | null>(null);
  const [heartRate, setHeartRate] = useState<number>(0);

  const [connected, setConnected] = useState(false);
  const [services, setServices] = useState(null);
  const [serviceTx, setServiceTx] = useState(null);
  const [serviceRx, setServiceRx] = useState(null);
  const [characteristicTx, setCharacteristicTx] = useState(null);
  const [characteristicRx, setCharacteristicRx] = useState(null);

  //Bluetooth Initialization
  //Permissions Handling
  const requestPermissions = async (): Promise<boolean> => { 
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
      ]);
      return Object.values(granted).every(permission => permission === PermissionsAndroid.RESULTS.GRANTED);
    }
    return true; // For other platforms, assume permissions are granted
  };

  //Scanning for Devices
  const scanForPeripherals = () => {
    console.log("scanForPeripherals");
    bleManager.startDeviceScan(null, null, (error: BleError | null, device: Device | null) => {
      if (error) {
        console.error(error);
        return;
      }
      if (device && (device.name?.includes('Ally') || device.name?.includes('Knowlepsy'))) {
        setAllDevices(prevDevices => {
          if (!prevDevices.find(prevDevice => prevDevice.id === device?.id)) {
            return [...prevDevices, device];
          }
          return prevDevices;
        });
      }
    });
  };


//connect

async function getCharacteristics(device) {
  try {
    console.log("1 getCharacteristics");
    
    // Discover services
    // const services = await device.discoverAllServicesAndCharacteristics();
    console.log("2 getCharacteristics");
    await device.discoverAllServicesAndCharacteristics();
    const services = await device.services();
    if (!services || services.length === 0) {
      console.error("No services found.");
      return;
    }
    console.log("3 getCharacteristics");

    // Find serviceTx and serviceRx
    const serviceTx = services.find(service => service.uuid === writeService.serviceUuid);
    const serviceRx = services.find(service => service.uuid === notifyService.serviceUuid);
    console.log("4 getCharacteristics");
    // Check if the serviceTx and serviceRx are found
    if (!serviceTx || !serviceRx) {
      console.error("Services not found.");
      return;
    }

    // Get characteristics for the services
    const characteristicsTx = await serviceTx.characteristics();
    const characteristicsRx = await serviceRx.characteristics();

    // Find the desired characteristics by UUID
    const characteristicTx = characteristicsTx.find(characteristic => characteristic.uuid === writeService.characteristicUuid);
    const characteristicRx = characteristicsRx.find(characteristic => characteristic.uuid === notifyService.characteristicUuid);

    if (!characteristicTx || !characteristicRx) {
      console.error("Characteristics not found for service.");
      return;
    } 
    console.log("6 getCharacteristics");

    // Set state variables
    setServices(services);
    setServiceTx(serviceTx);
    setServiceRx(serviceRx);
    setCharacteristicTx(characteristicTx);
    setCharacteristicRx(characteristicRx);
    console.log("7 getCharacteristics");

    // Do something with the characteristics
    console.log("Characteristic TX:", characteristicTx.uuid);
    console.log("Characteristic RX:", characteristicRx.uuid);
  } catch (error) {
    console.error("Error discovering services and characteristics:", error);
  }
}




async function writeSyncDate(device) {
  let status = false;
  try {
    const syncData = getSyncData();
    for (let i = 0; i < syncData.length; i += 20) {
      const end = (i + 20 < syncData.length) ? i + 20 : syncData.length;
      const chunk = syncData.substring(i, end);
      await characteristicTx.writeWithoutResponse(chunk, 0);
    }
    status = true;
    // Exit loop if write is successful
  } catch (error) {
    console.error("An error occurred:", error);
    await device.cancelConnection();
  }
  return status;
}

function getSyncData() {
  const now = new Date();
  const formattedDate = UtilsDate.formatYYYYMMDD(now);
  const formattedTime = UtilsDate.formatHHMMSS(now);
  const jsonString = `*#{\"request\":\"date_time\",\"action\":\"SET\",\"value\":{\"date\":\"${formattedDate}\",\"time\":\"${formattedTime}\"}}#*`;
  return jsonString;
}

async function readIncomingData() {
  try {
    let responseData = '';

    await connectedDevice.discoverAllServicesAndCharacteristics();
    await characteristicRx?.setNotifyValue(true);

    const dataSubscriptionListener = characteristicRx?.monitor((error, value) => {
      if (error) {
        console.error('Error from characteristicRx listener:', error);
        return;
      }

      const decoded = new TextDecoder().decode(value);
      if (decoded.includes('--start--')) {
        responseData = decoded;
      } else {
        responseData = responseData + decoded;
      }

      if (responseData.includes('--end--')) {
        const data = extractData(responseData);
        if (data && data.data) {
          addData(data.data);
        }
        responseData = ''; // Reset responseData for next data chunk
      }
    });

    return () => {
      dataSubscriptionListener?.remove();
    };
  } catch (error) {
    console.error('An error occurred during data reading:', error);
  }
}

function extractData(data) {
  try {
    const jsonString = data.replace("--start--", "").replace("--end--", "");
    const jsonObject = JSON.parse(jsonString);
    return jsonObject;
  } catch (error) {
    return null;
  }
}

async function addData(data) {
  try {
    console.log("Data added successfully!");
    
    const now = new Date();
    const formattedTime = `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
  } catch (error) {
    console.error('Error adding data:', error);
    try {
      console.log('Reconnecting');
    } catch (e) {
      console.error('Failed to reconnect:', e);
    }
  }
}

// Connect
async function connect(device: Device): Promise<void> {
  try {
    await device.connect({ timeout: 10000, autoConnect: true });
    // Update connectedDevice state variable
    setConnectedDevice(device);
  } catch (error) {
    console.error('Exception occurred:', error);
  }
}

const disconnectFromDevice = () => {
  console.log('disconnectFromDevice');
  if (connectedDevice) {
    bleManager.cancelDeviceConnection(connectedDevice.id);
    setConnectedDevice(null);
    setHeartRate(0);
  }
};

async function connectToDevice(device) {
  try {
    setConnected(false); // Assuming setConnected is a setter function for the connected state variable
    console.log("connectToDevice 1");
    
    await connect(device);
    console.log("connectToDevice 2");

    await getCharacteristics(device);
    console.log("connectToDevice 3");

    await writeSyncDate(device);
    console.log("connectToDevice 4");

    await readIncomingData();
    console.log("connectToDevice 5");

  } catch (error) {
    console.log(error);
    console.log("hna");
    
    
  }
}

//Data Streaming
  
// const onHeartRateUpdate = (error: BleError | null, characteristic: Characteristic | null) => {
//   if (error) {
//     console.error(error);
//     return;
//   }
//   if (!characteristic?.value) {
//     console.log('No Data was received');
//     return;
//   }

//   const rawData = base64.decode(characteristic.value);
//   let innerHeartRate: number = -1;

//   const firstBitValue: number = Number(rawData) & 0x01;

//   if (firstBitValue === 0) {
//     innerHeartRate = rawData[1].charCodeAt(0);
//   } else {
//     innerHeartRate = Number(rawData[1].charCodeAt(0) << 8) + Number(rawData[2].charCodeAt(2));
//   }

//   setHeartRate(innerHeartRate);
// };

const startStreamingData = async (device: Device) => {
  console.log('1 startStreamingData');

  if (device) {
    console.log('2 startStreamingData');
    // device.monitorCharacteristicForService(
    //   notifyService.serviceUuid,
    //   notifyService.characteristicUuid,
    // );
    console.log('3 startStreamingData');
  } else {
    console.log('4 startStreamingData');
    console.log('No Device Connected');
  }
};

useEffect(() => {
  const init = async () => {
    await requestPermissions();
    scanForPeripherals();
  };
  init();
  return () => {
    bleManager.destroy();
  };
}, []);

return {
  requestPermissions,
  scanForPeripherals,
  connectToDevice,
  disconnectFromDevice,
  connectedDevice,
  allDevices,
  heartRate,
};
}

export default useBLE;
