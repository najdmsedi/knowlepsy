import React, { useContext, useEffect } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import WelcomeComponent from './components/WelcomeComponent';
import ReportComponent from './components/ReportComponent';
import TemperatureLevelComponent from './components/TemperatureLevelComponent';
import HeartrateComponent from './components/HeartrateComponent';
import StepsComponent from './components/StepsComponent';
import LastSleepTrackingComponent from './components/LastSleepTrackingComponent';
import StressLevelComponent from './components/StressLevelComponent';
import { AuthContext } from '../../context/AuthContext';
import { useRecoilValue } from 'recoil';
import { BPMAtom, StepsAtom, TempAtom } from './../../atoms';
import ConstantBar from '../../components/BleutoothButton';
import LinearGradient from 'react-native-linear-gradient';
import PushNotification from "react-native-push-notification";
import axios from 'axios';
import { BASE_URL } from '../../config';

type HomeScreenProps = {
  navigation: any;
};

export default function HomeScreen({ navigation }: HomeScreenProps) {
  const BPM = useRecoilValue(BPMAtom);
  const Temp = useRecoilValue(TempAtom);
  const Steps = useRecoilValue(StepsAtom);
  const { userInfo } = useContext(AuthContext);

  useEffect(() => {
    if (userInfo.role === 'patient') {
      navigation.setOptions({
        title: '',
        headerRight: () => <ConstantBar marginRight={104} />,
      });
    } else if (userInfo.role === 'doctor') {
      navigation.setOptions({
        headerShown: false, // This will completely remove the header
      });
    }
  }, [userInfo.role, navigation]);

  const chat = async () => {
    console.log(userInfo);
    if (userInfo.role === "patient") {
      if (userInfo.doctorId == null) {
        navigation.navigate('Patient_Doctor');
      }
      else {
        navigation.navigate('ChatScreen')
      }
    }
    else if (userInfo.role === "doctor") {
      const patient = await axios.get(`${BASE_URL}/patients/${userInfo._id}`);
      if (patient == null) {
        navigation.navigate('Patient_Doctor');
      }
      else {
        navigation.navigate('ChatScreen')
      }
    }
    // PushNotification.localNotification({
    //   channelId: "channel-id",
    //   title: "test",
    //   message: "knowlepsy",
    // });
  };

  return (
    <LinearGradient colors={['#FEFEFE', '#EDEBF7']} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <WelcomeComponent welcome='good morning' name={userInfo.firstName} color="#F5F3FF" marginTop={20} />
        <StressLevelComponent title='Stress Level' color="#FAF9FE" marginTop={25} status='happy' statusColor='#3AA50E' />
        <ReportComponent handleButtonPress={chat} color="#FCF2F5" marginTop={160} height={120} />
        <Text style={styles.text}>Tap to see details </Text>
        <TemperatureLevelComponent wirst={parseFloat(Temp)} title="Temperature" marginTop={330} />
        {/* <TemperatureComponent wrist={Temp} title="Temperature" marginTop={330} /> */}
        <HeartrateComponent BPM={BPM} title="Heart Rate" marginTop={330} height={118} />
        <StepsComponent Steps={Steps} title="Steps" marginTop={462} height={118} />
        <Text style={styles.text1}>Sleep details </Text>

        <LastSleepTrackingComponent title="Last Sleep Tracking" marginTop={600} />
      </ScrollView>
    </LinearGradient>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  text: {
    fontSize: 16,
    textAlign: 'center',  // Ensure text is centered
    color: 'black',
    // marginVertical: 100,
    bottom: -270,
    right: 120
  },
  text1: {
    fontSize: 16,
    textAlign: 'center',  // Ensure text is centered
    color: 'black',
    // marginVertical: 100,
    bottom: -550,
    right: 135
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
