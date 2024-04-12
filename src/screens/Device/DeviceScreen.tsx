import * as React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import BluetoothServices from '../../services/BluetoothServices ';
import { useFocusEffect } from '@react-navigation/native';
import WelcomeComponent from './components/WelcomeComponent';
type DeviceScreenProps = {
    navigation: any;
  };
  
export default function DeviceScreen({ navigation }:DeviceScreenProps) {

  const { checkState } = BluetoothServices();
  const [rectangleColor, setRectangleColor] = React.useState('#FFCBC9');
  const [BleColor, setBleColor] = React.useState('#D1837F');
  const requestPermission = () => {
      navigation.navigate('ScanScreen');
  };
  const [text, setText] = React.useState('Click to connect');

    useFocusEffect(
        React.useCallback(() => {
          checkState().then((ch) => {
            if (ch == true) {
                setRectangleColor('#71db65');
                setBleColor('#5c8c57');
                setText('    Connected     ')
              } else if (ch == false) {
                setRectangleColor('#FFCBC9');
                setBleColor('#D1837F');
                setText('Click to connect')
              }
          });
        navigation.setOptions({
              title: '',
              headerRight: () => <TouchableOpacity onPress={requestPermission}>
                  <View style={[styles.rectangle, { backgroundColor: rectangleColor }]}>
                      <Ionicons
                          name={'bluetooth'}
                          size={24}
                          color={BleColor}
                          style={styles.icon}
                      />
                      <Text style={styles.textB}>{text}</Text>
                  </View>
              </TouchableOpacity>
          });
      }, [checkState,navigation]) 
  );

  const handleButtonPress = () => {}
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <WelcomeComponent welcome='Disconnected'  name='Scan Device to Connect' color="#F5F3FF" marginTop={20}/>
            <TouchableOpacity onPress={handleButtonPress} style={styles.button}>
                <Ionicons name="watch-outline" size={20} color="white" style={styles.buttonIcon} />
                <Text style={styles.buttonText}>  Scan Device</Text>
            </TouchableOpacity>
            
        </View>
    );
}

const styles = StyleSheet.create({
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
