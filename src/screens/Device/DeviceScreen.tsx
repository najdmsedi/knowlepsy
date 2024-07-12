import * as React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import WelcomeComponent from './components/WelcomeComponent';
import ConstantBar from '../../components/BleutoothButton';
import { useEffect, useRef } from 'react';
import { useRecoilValue } from 'recoil';
import { BPMAtom, ConnectedAtom, DeviceNameAtom, StepsAtom, TempAtom } from '../../atoms';
import BluetoothServices from '../../services/BluetoothServices ';
import LinearGradient from 'react-native-linear-gradient';
import ComponentHR from './components/ComponentHR';
import ComponentSteps from './components/ComponentSteps';
import ComponentTemperature from './components/ComponentTemperature';

type DeviceScreenProps = {
  navigation: any;
};

export default function DeviceScreen({ navigation }: DeviceScreenProps) {
  const connected = useRecoilValue(ConnectedAtom);
  const DeviceName = useRecoilValue(DeviceNameAtom);
  const BPM = useRecoilValue(BPMAtom);
  const Temp = useRecoilValue(TempAtom);
  const Steps = useRecoilValue(StepsAtom);
  const { disconnectFromDevice } = BluetoothServices();

  useEffect(() => {
    navigation.setOptions({
      title: '',
      headerRight: () => <ConstantBar />,
    });
  }, []);

  const handleButtonPress = () => {
    navigation.navigate('ScanScreen');
  }
  const disconnect = () => {
    disconnectFromDevice()
  }
  const handleButtonPresss = () => {
  }



  return (
    <LinearGradient colors={['#FEFEFE', '#EDEBF7']} style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      {connected ? (
        <>
          <WelcomeComponent color="#CCBEFE" marginTop={20} />

          <Text style={styles.text}>Device Settings</Text>
          <ComponentSteps marginTop={160} title='Steps' color='#DCFFE3' width={120} left={275} value={Steps}> </ComponentSteps>
          <ComponentTemperature marginTop={160} title='Temperature' color='#D7D2F9' width={120} left={145} value={Temp}> </ComponentTemperature>
          <ComponentHR marginTop={160} title='Heart rate' color='#FDE9E7' width={120} left={15} value={BPM}> </ComponentHR>


          <TouchableOpacity onPress={disconnect} style={styles.custombutton}>
            <Ionicons name="remove-circle-outline" size={20} color="white" style={styles.buttonIcon} />
            <Text style={styles.buttonText}>  Remove Device</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleButtonPresss} style={styles.custombutton2}>
            <Ionicons name="refresh-circle-outline" size={20} color="white" style={styles.buttonIcon} />
            <Text style={styles.buttonText}>  Reset Device    </Text>
          </TouchableOpacity>

        </> 
      ) : (
        <>
          <WelcomeComponent color="#F5F3FF" marginTop={20} />
          <TouchableOpacity onPress={handleButtonPress} style={styles.button}>
            <Ionicons name="watch-outline" size={20} color="white" style={styles.buttonIcon} />
            <Text style={styles.buttonText}>  Scan Device</Text>
          </TouchableOpacity>

        
        </>
      )}


    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: 16,
    position: 'absolute',
    left: 10,
    right: 10,
    width: 'auto',
    height: 210,
    color: 'black'
  },
  textB: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#494646'
  },
  rectangle: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 20,
    marginRight: 120,
  },
  icon: {
    marginRight: 10,
  },
  button: {
    backgroundColor: '#7944cf',
    paddingVertical: 15,
    paddingHorizontal: 100,
    borderRadius: 20,
    marginTop: -400,
    flexDirection: 'row',
    alignItems: 'center',
  },
  custombutton: {
    backgroundColor: '#7944cf',
    paddingVertical: 15,
    paddingHorizontal: 100,
    borderRadius: 20,
    marginTop: 0,
    flexDirection: 'row',
    alignItems: 'center',
  },
  custombutton2: {
    backgroundColor: '#C0AFD8',
    borderColor: 'black', // Border color
    borderWidth: 1, // Border width
    paddingVertical: 15,
    paddingHorizontal: 100,
    borderRadius: 20,
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 5,
  },
  buttonIcon: {
    marginLeft: 5,
  },
});
