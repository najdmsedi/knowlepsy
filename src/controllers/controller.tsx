import { PermissionsAndroid, Platform } from 'react-native';
import BluetoothStateManager from 'react-native-bluetooth-state-manager';
import BleManager from 'react-native-ble-manager'

const initializeBluetooth = async () => {
    if(BleManager.enableBluetooth()){
        console.log("enable");
        
    }
    else {
        console.log("desible");
        
    }
    
  
    
};
export default initializeBluetooth