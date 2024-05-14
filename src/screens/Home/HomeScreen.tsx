import React, { useContext, useEffect } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import WelcomeComponent from './components/WelcomeComponent';
import ReportComponent from './components/ReportComponent';
import TemperatureComponent from './components/TemperatureComponent';
import HeartrateComponent from './components/HeartrateComponent';
import StepsComponent from './components/StepsComponent';
import LastSleepTrackingComponent from './components/LastSleepTrackingComponent';
import RiskLevelComponent from './components/RiskLevelComponent';
import StressLevelComponent from './components/StressLevelComponent';
import { AuthContext } from '../../context/AuthContext';
import { useRecoilValue } from 'recoil';
import { BPMAtom, StepsAtom, TempAtom } from './../../atoms'
import ConstantBar from '../../components/BleutoothButton';

type HomeScreenProps = {
  navigation: any;
};

export default function HomeScreen({ navigation }: HomeScreenProps) {
  const BPM = useRecoilValue(BPMAtom);
  const Temp = useRecoilValue(TempAtom);
  const Steps = useRecoilValue(StepsAtom);
  const { userInfo } = useContext(AuthContext)

  useEffect(() => {
    navigation.setOptions({
      title: '',
      headerRight: () => <ConstantBar />,
    });
  }, []);

  return (
    <View style={styles.container} >
      <WelcomeComponent welcome='good morning' name={userInfo.firstName} color="#F5F3FF" marginTop={20} />
      <RiskLevelComponent title='Risk Level' color="#FAF9FE" marginTop={25} />
      <ReportComponent title="Tap this button if you had a seizure" color="#FCF2F5" marginTop={160} height={120} />
      <Text style={styles.text}>Tap to see details</Text>
      <StressLevelComponent title="Stress" marginTop={330} />
      <TemperatureComponent wrist={Temp} title="Temperature" marginTop={330} />
      <HeartrateComponent BPM={BPM} title="Heart Rate" marginTop={415} />
      <StepsComponent Steps={Steps} title="Steps" marginTop={500} />
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
    borderRadius: 30,
    marginRight: 120,
  },
  icon: {
    marginRight: 10,
  },
});

