
import { useContext, useEffect, useState } from 'react';
import { PermissionsAndroid, Platform,NativeEventEmitter, NativeModules, Alert } from 'react-native';
import BleManager from 'react-native-ble-manager';
import UtilsDate from './UtilDate';
import { Buffer } from 'buffer';
import { AuthContext } from '../context/AuthContext';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { BPMAtom, TempAtom, StepsAtom, ConnectedAtom, DeviceNameAtom, TempValueAtom, PPGValueAtom, EDAValueAtom } from '../atoms'
import { useNavigation } from '@react-navigation/native';
import PushNotification from 'react-native-push-notification';
import { BASE_URL } from '../config';

type Device = {
  id: string;
  name: string;
  advertising: any;
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
}

function BluetoothServices():BluetoothServicesType  {
  const setConnected = useSetRecoilState(ConnectedAtom);
  const setDevice = useSetRecoilState(DeviceNameAtom);

  const setBPM = useSetRecoilState(BPMAtom);
  const setTemp = useSetRecoilState(TempAtom);
  const setSteps = useSetRecoilState(StepsAtom);

  const setPPGValue = useSetRecoilState(PPGValueAtom);
  const setTempValue = useSetRecoilState(TempValueAtom);
  const setEDAValue = useSetRecoilState(EDAValueAtom);

  const {userInfo} = useContext(AuthContext)

  const [allDevices, setAllDevices] = useState<any[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [services, setServices] = useState([]);
  const [serviceTx, setServiceTx] = useState<any | null>(null);
  const [serviceRx, setServiceRx] = useState<any | null>(null);
  const [characteristicTx, setCharacteristicTx] = useState<any | null>(null);
  const [characteristicRx, setCharacteristicRx] = useState<any | null>(null);
  const [dataSubscriptionListener, setDataSubscriptionListener] = useState(null);
  const [connectedDevice, setConnectedDevice] = useState<any | null>(null);
  const navigation = useNavigation();

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

  const redirectToAnotherPage = async (navigation:any, pageName:String) => {
    if (navigation && pageName) {
      navigation.navigate(pageName);
    }
  };

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
    console.log("start scan");
    BleManager.scan([], 5, true).then(() => {
    }).catch(error => {
      console.error("Error starting scan:", error);
    });    
    const handleDiscoverPeripheral = (peripheral:any) => {
      if (peripheral && (peripheral.name?.startsWith("Ally") || peripheral.name?.startsWith("Knowlepsy"))) {
        setAllDevices(prevDevices => {
          if (!prevDevices.find(prevDevice => prevDevice.id === peripheral?.id)) {
            return [...prevDevices, peripheral];

          }
          // console.log("prevDevices[0].advertising",prevDevices[0].advertising);
          // console.log("prevDevices[0].advertising.manufacturerData",prevDevices[0].advertising.manufacturerData);
          // console.log("prevDevices[0].advertising.manufacturerRawData",prevDevices[0].advertising.manufacturerRawData);
          // console.log("prevDevices[0].advertising.rawData",prevDevices[0].advertising.rawData);
          // console.log("prevDevices[0].advertising.serviceData",prevDevices[0].advertising.serviceData);
          // console.log("prevDevices[0].advertising.serviceUUIDs",prevDevices[0].advertising.serviceUUIDs);

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

  const connect = async (device:Device) => {
    try {
      await BleManager.connect(device.id);
      setConnectedDevice(device.id);
      setIsConnected(true)
      //recoil
      setConnected(true)
      setDevice((prevBPM) => device.advertising.localName || prevBPM);
      PushNotification.localNotification({
        channelId: "channel-id",
        title: "Device connected",
        message: "Device is connected",
    });
    } catch (error) {
      console.error('Connection error', error);
    }
  };

  const disconnectFromDevice = async () => {
    setIsConnected(false),
    setBPM('--');
    setSteps('--');
    setTemp('--');
    setConnected(false)
    //FIX_ME
    const connectedPeripherals = await BleManager.getConnectedPeripherals([]);
    if (connectedPeripherals.length > 0) {
      // console.log('Phone is connected to at least one device.');
      // console.log('Connected devices:', connectedPeripherals);
      BleManager.disconnect(connectedPeripherals[0].id);
    }  
    PushNotification.localNotification({
      channelId: "channel-id",
      title: "Device disconnected",
      message: "Open the app and pair device",
  });
  };

  const getCharacteristics = async (device:Device, onCharacteristicsRetrieved:any) => {
    try {
      // console.log("getCharacteristics");
      // console.log("device",device);
      // console.log("onCharacteristicsRetrieved",onCharacteristicsRetrieved);

      const services = await BleManager.retrieveServices(device.id);
      const serviceTx = services?.characteristics?.find(
        (c) => c.service === writeService.serviceUuid && c.characteristic === writeService.characteristicUuid,
      );
      const serviceRx = services?.characteristics?.find(
        (c) => c.service === notifyService.serviceUuid && c.characteristic === notifyService.characteristicUuid,
      );

      if(serviceTx?.characteristic === writeService.characteristicUuid){
        const characteristicsTx = await serviceTx.characteristic;
        setCharacteristicRx(characteristicsTx)
        onCharacteristicsRetrieved(serviceTx, serviceRx);
      }

      if(serviceRx?.characteristic === notifyService.characteristicUuid){
        const characteristicsRx = await serviceRx.characteristic;
        setCharacteristicTx(characteristicsRx)
      }
      
      setServiceTx(serviceTx);
      setServiceRx(serviceRx);
      if (serviceTx && serviceRx) {
        // console.log('Write Characteristic:', serviceTx);
        // console.log('Notify Characteristic:', serviceRx);
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

  const writeSyncData = async (device:Device, serviceTx:any) => {
    try {
      const syncData = getSyncData();
      for (let i = 0; i < syncData.length; i += 20) {
        const end = i + 20 < syncData.length ? i + 20 : syncData.length;
        const chunk = syncData.substring(i, end);
        const list = Buffer.from(chunk, "utf-8").toJSON().data;
        // console.log("device",device.id,"serviceRx",serviceTx.service,"characteristicUuid",serviceTx.characteristic);
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
  
  const readIncomingData = async (device:Device, serviceRx:any) => { 
      let responseData = "";
      const peripheralId = device.id;
      const characteristicUUID = notifyService.characteristicUuid;
  
        await BleManager.retrieveServices(peripheralId).then((services) => {
          // console.log("services",services);
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

                if (data['data']['PPG']!= undefined){
                  setBPM((prevBPM) => data['data']['PPG']['heart_rate'] || prevBPM);
                }
                if (data['data']['Motion']!= undefined){
                  setSteps((prevSteps) => data['data']['Motion']['steps'] || prevSteps);
                }
                if (data['data']['TEMP']!= undefined){
                  setTemp((prevTemp) => data['data']['TEMP']['wrist'] || prevTemp);
                }
              }
              responseData = "";
            }
          }
        );
  };

  const extractData = (data: any) => {
    try {
      const jsonString = data.replaceAll('--start--', '').replaceAll('--end--', '');
      return JSON.parse(jsonString);
    } catch (error) {
      return null;
    }
  };

  const addData = async (data: any) => {
  try {
    let extraData = {} as any
   
    try {
      if(data['PPG']!= undefined){           
        setPPGValue(data.PPG);
      }
    } catch (error) {
      console.log(error,"error from HR");
      
    }

    if(data['PPG']!= undefined){      
      extraData = {...{userId:userInfo._id},...{firstName:userInfo.firstName},...{lastName:userInfo.lastName},...{email:userInfo.email},...data}

      const response = await fetch(`${BASE_URL}/data/addPPGData`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(extraData),
      });
      if (!response.ok) {
        throw new Error('Failed to add PPG data');
      }
    }

    if (data['Motion']!= undefined){
      extraData = {...{userId:userInfo._id},...{firstName:userInfo.firstName},...{lastName:userInfo.lastName},...{email:userInfo.email},...data}
      const response = await fetch(`${BASE_URL}/data/addMotionData`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(extraData),
      });
      if (!response.ok) {
        throw new Error('Failed to add Motion data');
      }
    }

    try {
      if(data['TEMP']!= undefined){   
        setTempValue(data.TEMP);        
      }
    } catch (error) {
      console.log(error,"error from HR");
      
    }

    if (data['TEMP']!= undefined){
      extraData = {...{userId:userInfo._id},...{firstName:userInfo.firstName},...{lastName:userInfo.lastName},...{email:userInfo.email},...data}
      const response = await fetch(`${BASE_URL}/data/addTempData`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(extraData),
      });
      if (!response.ok) {
        throw new Error('Failed to add TEMP data');
      }
    }

    try {
          if(data['EDA']!= undefined){   
            setEDAValue(data.EDA[0].EDA);        
          }
        } catch (error) {
          console.log(error,"error from HR");
          
        }

    if (data['EDA']!= undefined){
      const currentDate = new Date();
      const formattedDate = currentDate.toISOString().split('T')[0];
      const formattedTime = currentDate.toTimeString().split(' ')[0];

      extraData = {...{userId:userInfo._id},...{firstName:userInfo.firstName},...{lastName:userInfo.lastName},...{email:userInfo.email},...{date:formattedDate},...{time:formattedTime},...data}
      const response = await fetch(`${BASE_URL}/data/addEdaData`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(extraData),
      });
      if (!response.ok) {
        throw new Error('Failed to add EDA data');
      }
    }
  } catch (error) {
    console.log('Error adding data:', error);
    Alert.alert('Error', 'Failed to add data. Please try again later.');
  }
};

  async function connectToDevice(device:Device) {
    try {
      await connect(device);
      await getCharacteristics(device, async (serviceTx: any,serviceRx: any) => {
        await writeSyncData(device, serviceTx); 
        readIncomingData(device,serviceRx)        
      });
      
    } catch (error) {
      console.log("connectToDevice", error);
    }
  }

  useEffect(() => {
    console.log("BluetoothServices => useEffect");
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
  };
  
};
export default BluetoothServices;

