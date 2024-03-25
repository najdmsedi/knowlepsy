import * as React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import WelcomeComponent from './components/WelcomeComponent';
import ReportComponent from './components/ReportComponent';
import TemperatureComponent from './components/TemperatureComponent';
import HeartrateComponent from './components/HeartrateComponent';
import StepsComponent from './components/StepsComponent';
import LastSleepTrackingComponent from './components/LastSleepTrackingComponent';
import RiskLevelComponent from './components/RiskLevelComponent';
import StressLevelComponent from './components/StressLevelComponent';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useFocusEffect } from '@react-navigation/native';
import BluetoothServices from '../../services/BluetoothServices ';

export default function HomeScreen({ navigation}) {

    const {checkState} = BluetoothServices();
    const [rectangleColor, setRectangleColor] = React.useState('#FFCBC9');
    const [BleColor, setBleColor] = React.useState('#D1837F');

    useFocusEffect(
        React.useCallback(() => {
          checkState().then((ch) => {
            if (ch == true) {
                setRectangleColor('#71db65');
                setBleColor('#5c8c57')
              } else if (ch == false) {
                setRectangleColor('#FFCBC9');
                setBleColor('#D1837F')
              }
          });
      
          navigation.setOptions({
            title: '',
            headerRight: () =>  <TouchableOpacity onPress={requestPermission}>
            <View style={[styles.rectangle, { backgroundColor: rectangleColor  }]}>
              <Ionicons
                name={'bluetooth'}
                size={24}
                color={BleColor}
                style={styles.icon}
              />
              <Text style={styles.textB}>Click to connect</Text>
            </View>
          </TouchableOpacity>
        });
        }, [checkState])
      );
      

    const requestPermission = () => {
        navigation.navigate('ScanScreen');
    };

    return (
        <View style={styles.container} >
             <WelcomeComponent welcome='good morning'  name='Najd' color="#F5F3FF" marginTop={20}/>
             <RiskLevelComponent  title='Risk Level' color="#FAF9FE" marginTop={25}/>
             <ReportComponent title="Tap this button if you had a seizure" color="#FCF2F5" marginTop={160} height={120}/>
             <Text style={styles.text}>Tap to see details</Text>   
             <StressLevelComponent title="Stress" marginTop={330} />
             <TemperatureComponent title="Temperature" marginTop={330} />
             <HeartrateComponent  title="Heart Rate" marginTop={415} />
             <StepsComponent title="Steps" marginTop={500} />
             <LastSleepTrackingComponent title="Last Sleep Tracking" marginTop={600} />
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#FCFBFF'
    },
    text: {
        fontSize: 16,
        position: 'absolute',
        left: 10, 
        right: 10, 
        width: 'auto', 
        height: 210,     
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
  });

  