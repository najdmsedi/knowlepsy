import React, { useContext, useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import WelcomeComponent from './components/WelcomeComponent';
import ReportComponent from './components/ReportComponent';
import TemperatureLevelComponent from './components/TemperatureLevelComponent';
import HeartrateComponent from './components/HeartrateComponent';
import StepsComponent from './components/StepsComponent';
import LastSleepTrackingComponent from './components/LastSleepTrackingComponent';
import StressLevelComponent from './components/StressLevelComponent';
import { AuthContext } from '../../context/AuthContext';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { BPMAtom, EDAValueAtom, PPGValueAtom, StepsAtom, TempAtom } from './../../atoms';
import ConstantBar from '../../components/BleutoothButton';
import LinearGradient from 'react-native-linear-gradient';
import PushNotification from "react-native-push-notification";
import axios, { AxiosError } from 'axios';
import { BASE_URL } from '../../config';

type HomeScreenProps = {
  navigation: any;
};

export default function HomeScreen({ navigation }: HomeScreenProps) {
  const BPM = useRecoilValue(BPMAtom);
  const Temp = useRecoilValue(TempAtom);
  const Steps = useRecoilValue(StepsAtom);

  const setBPM = useSetRecoilState(BPMAtom);
  const setTemp = useSetRecoilState(TempAtom);
  const setSteps = useSetRecoilState(StepsAtom);

  const [TempDAte, setTempDAte] = useState("");
  const [BPMDate, setBPMDate] = useState("");
  const [StepsDate, setStepsDate] = useState("");

  const { userInfo } = useContext(AuthContext);
  const { userGuestInfo } = useContext(AuthContext);

  const PPGValue = useRecoilValue(PPGValueAtom) as any;
  const EDAValue = useRecoilValue(EDAValueAtom) as any;

  const [iconStress, setIconStress] = useState("happy");
  const [colorStress, setColorStress] = useState("#3AA50E");

  useEffect(() => {
    if (userInfo.role === 'patient') {
      navigation.setOptions({
        title: '',
        headerRight: () => <ConstantBar marginRight={104} />,
      });
      
    } else if (userInfo.role === 'doctor') {
      navigation.setOptions({
        headerShown: false,
      });
    } 
  }, [userInfo.role, navigation]);

  const chat = async () => {
    // switch (userGuestInfo) {
    //   case null:
    //     navigation.navigate('Patient_Doctor')
    //     break;
    //   default:
    //     navigation.navigate('ChatScreen')
    //     break;
    // }
  };
  // PushNotification.localNotification({
  //   channelId: "channel-id",
  //   title: "test",
  //   message: "knowlepsy",
  // });
  useEffect(() => {
    if (userInfo.role === 'patient') {

    const fetchData = async () => {
      try {
        console.log(EDAValue,PPGValue.heart_rate);
        
        const response = await axios.post('http://172.187.93.156:5000/Young_predict', {
          EDA: EDAValue,
          HeartRate: PPGValue.heart_rate,
        });
        console.log('API Response:', response.data.stress_level);
        switch (response.data.stress_level) {
          case "low":
            setIconStress("happy")
            setColorStress("#3AA50E")
            break;
          case "medium":
            setIconStress("happy")
            setColorStress("#D1837F")
            break;
          case "high":
            setIconStress("sad")
            setColorStress("#B50F0F")
            break;
          default:
            setIconStress("happy")
            setColorStress("#3AA50E")
            break;
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }
  }, [PPGValue, EDAValue]);

  // useEffect(() => {
  //   if (userInfo.role === 'doctor') {
  //     const fetchData = async () => {
  //       try {
  //         console.log('Fetching data...',userGuestInfo._id);
  //         const urls = {
  //           // temp: `http://172.187.93.156:3000/Temp/${userGuestInfo._id}`,
  //           // hr: `http://172.187.93.156:3000/PPG/${userGuestInfo._id}`,
  //           // steps: `http://172.187.93.156:3000/Steps/${userGuestInfo._id}`
  //         };

  //         // const tempResponse = await axios.get(urls.temp)
  //         // const hrResponse = await axios.get(urls.hr)
  //         // const stepsResponse = await axios.get(urls.steps)

  //         // const Temp = tempResponse.data.data[0].TEMP.wrist;
  //         // const HR = hrResponse.data.data[0].PPG.heart_rate;
  //         // const Step = stepsResponse.data.data[0].Motion.steps;
  //         // setSteps(Step)
  //         // setBPM(HR) 
  //         // setTemp(Temp)
  //         // setStepsDate(stepsResponse.data.data[0].Motion.time)
  //         // setBPMDate(hrResponse.data.data[0].PPG.time)
  //         // setTempDAte(tempResponse.data.data[0].TEMP.time)

  //         // console.log(Temp,"TempDAte",TempDAte)
  //         // console.log(Step,"StepsDate",StepsDate)
  //         // console.log(BPM,"BPMDate",BPMDate)

  //       } catch (error) {
  //         console.error('Failed to fetch data:', error);
  //       }
  //     };
  //     fetchData();
  //     const intervalId = setInterval(fetchData, 15000);
  //     return () => clearInterval(intervalId);
  //   }
  // }, [userInfo.role, userInfo._id]);
  return (
    <LinearGradient colors={['#FEFEFE', '#EDEBF7']} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <WelcomeComponent welcome='good morning' name={userInfo.firstName} color="#F5F3FF" marginTop={20} />
        <StressLevelComponent title='Stress Level' color="#FAF9FE" marginTop={25} status={iconStress} statusColor={colorStress} />
        {/* <ReportComponent handleButtonPress={chat} color="#FCF2F5" marginTop={160} height={120} /> */}
        <Text style={{ ...styles.text, fontWeight: '900' }}>Tap to see details </Text>
        <TemperatureLevelComponent wirst={parseFloat(Temp)} time_forDoctor={TempDAte} title="Temperature" marginTop={210} />
        <HeartrateComponent BPM={BPM} title="Heart Rate" marginTop={210} height={118} time_forDoctor={BPMDate} />
        <StepsComponent Steps={Steps} title="Steps" marginTop={341} height={118}  time_forDoctor={StepsDate}/>
        <Text style={{ ...styles.text1, fontWeight: '900' }} >Sleep quality </Text>
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
    bottom: -155,
    right: 120
  },
  text1: {
    fontSize: 16,
    textAlign: 'center',  // Ensure text is centered
    color: 'black',
    // marginVertical: 100,
    bottom: -460,
    right: 135,
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
