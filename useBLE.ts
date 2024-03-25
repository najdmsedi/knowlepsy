import { useEffect, useState } from 'react';
import { BleManager, Device, BleError, Characteristic } from 'react-native-ble-plx';
import { PermissionsAndroid, Platform } from 'react-native';
import base64 from 'react-native-base64';
import * as TextEncoding from 'text-encoding';
import { Buffer } from 'buffer';
import iconv from "iconv-lite";

// Import UtilsDate class
import UtilsDate from './src/services/UtilDate';

interface BluetoothLowEnergyApi {
  requestPermissions(): Promise<boolean>;
  scanForPeripherals(): void;
  connectToDevice(device: Device): Promise<void>;
  disconnectFromDevice(): void;
  connectedDevice: Device | null;
  allDevices: Device[];
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
  let [bleManager] = useState(() => new BleManager());
  let [allDevices, setAllDevices] = useState<Device[]>([]);
  let [connectedDevice, setConnectedDevice] = useState<Device | null>(null);

  let [connected, setConnected] = useState(false);
  let [services, setServices] = useState(null);
  let [serviceTx, setServiceTx] = useState(null);
  let [serviceRx, setServiceRx] = useState(null);
  let [characteristicTx, setCharacteristicTx] = useState(null);
  let [characteristicRx, setCharacteristicRx] = useState(null);
  let servicesG
  let serviceTxG
  let serviceRxG

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

  // Connect
async function connect(device: Device): Promise<void> {
  try {
    await device.connect({ timeout: 10000, autoConnect: true });
    // Update connectedDevice state variable
    setConnectedDevice(device);
    connectedDevice = device    
  } catch (error) {
    console.error('Exception occurred:', error);
  }
} 

const disconnectFromDevice = () => {
  console.log('disconnectFromDevice');
  if (connectedDevice) {
    bleManager.cancelDeviceConnection(connectedDevice.id);
    setConnectedDevice(null);
  }
};

  //getCharacteristics of Devices

async function getCharacteristics(device) {
  try {
    console.log("getCharacteristics");
    // Discover services
    await device.discoverAllServicesAndCharacteristics();
    console.log(device.discoverAllServicesAndCharacteristics());
    
    const services = await device.services();
    
    if (!services || services.length === 0) {
      console.error("No services found.");
      return;
    }
    // Find serviceTx and serviceRx
    const serviceTx = services.find((service: { uuid: string; }) => service.uuid === writeService.serviceUuid);
    const serviceRx = services.find((service: { uuid: string; }) => service.uuid === notifyService.serviceUuid);
    console.log("services",services.uuid);
    console.log("serviceTx",serviceTx.uuid);
    console.log("serviceRx",serviceRx.uuid);
    servicesG =services
    serviceTxG=serviceTx
    serviceRxG=serviceRx
    // Check if the serviceTx and serviceRx are found
    if (!serviceTx || !serviceRx) {
      console.error("Services not found.");
      return;
    }

    // Get characteristics for the services
    let characteristicsTx = await serviceTx.characteristics();
    let characteristicsRx = await serviceRx.characteristics();

    // Find the desired characteristics by UUID
    characteristicTx = characteristicsTx.find((characteristic: { uuid: string; }) => characteristic.uuid === writeService.characteristicUuid);
    characteristicRx = characteristicsRx.find((characteristic: { uuid: string; }) => characteristic.uuid === notifyService.characteristicUuid);

    if (!characteristicTx || !characteristicRx) {
      console.error("Characteristics not found for service.");
      return;
    } 

    // Set state variables
    setServices(services);
    setServiceTx(serviceTx);
    setServiceRx(serviceRx);
    setCharacteristicTx(characteristicTx);
    setCharacteristicRx(characteristicRx);
    // console.log("Discovered services:", services);

    // Do something with the characteristics
    console.log("Characteristic TX:", characteristicTx.uuid);
    console.log("Characteristic RX:", characteristicRx.uuid);
    
  } catch (error) {
    console.error("Error discovering services and characteristics:", error);
  }
}

async function writeSyncDate(device, characteristicTx) {
  let status = false;
  try {
    if (!characteristicTx) {
      console.error("Characteristic for writing data is not found.");
      return status;
    }

    const syncData = getSyncData(); // Ensure this function is defined and returns the data string
    for (let i = 0; i < syncData.length; i += 20) {
      const end = (i + 20 < syncData.length) ? i + 20 : syncData.length;
      const chunk = syncData.substring(i, end);
      const base64Chunk = Buffer.from(chunk, 'utf-8').toString('base64');
      await characteristicTx.writeWithoutResponse(base64Chunk);
    }
    status = true;
  } catch (error) {
    console.error("An error occurred:", error);
    if (device.cancelConnection) {
      await device.cancelConnection();
    }
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
    // console.log("Characteristic properties:", characteristicRx);
    console.log("isNotifiable:", characteristicRx.isNotifiable);

    await characteristicRx?.setNotifyValue(true);
    console.log(characteristicRx?.monitor());
     
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

async function connectToDevice(device) {
  try {
    
    setConnected(false); // Assuming setConnected is a setter function for the connected state variable
    console.log("setConnected");    
    await connect(device);
    console.log("connect");

    await getCharacteristics(device);
    console.log("getCharacteristics");
    bleManager.connectToDevice(device.id)
    console.log(bleManager.servicesForDevice(device.id))
    await writeSyncDate(device,characteristicTx); 
    // console.log("writeSyncDate");

    // await readIncomingData();
    // console.log("readIncomingData");

  } catch (error) {
    console.log("connectToDevice",error);    
  }
}

return {
  requestPermissions,
  scanForPeripherals,
  connectToDevice,
  disconnectFromDevice,
  connectedDevice,
  allDevices,
};
}

export default useBLE;
