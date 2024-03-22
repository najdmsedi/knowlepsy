import * as React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import WelcomeComponent from './components/WelcomeComponent';
import ReportComponent from './components/ReportComponent';
import TemperatureComponent from './components/TemperatureComponent';
import HeartrateComponent from './components/HeartrateComponent';
import StepsComponent from './components/StepsComponent';
import LastSleepTrackingComponent from './components/LastSleepTrackingComponent';
import RiskLevelComponent from './components/RiskLevelComponent';
import ConstantBar from '../../IsConnectedButton';
import StressLevelComponent from './components/StressLevelComponent';

export default function HomeScreen({ navigation }) {
    React.useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => <ConstantBar />,
            title: '',
        });
    }, [navigation]);

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
    }
  });

  