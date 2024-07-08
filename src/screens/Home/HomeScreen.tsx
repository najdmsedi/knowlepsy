import React, { useContext, useEffect, useState } from 'react';
import { Dimensions, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import WelcomeComponent from './components/WelcomeComponent';
import ReportComponent from './components/ReportComponent';
import TemperatureLevelComponent from './components/TemperatureLevelComponent';
import HeartrateComponent from './components/HeartrateComponent';
import StepsComponent from './components/StepsComponent';
import LastSleepTrackingComponent from './components/LastSleepTrackingComponent';
import StressLevelComponent from './components/StressLevelComponent';
import { AuthContext } from '../../context/AuthContext';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { BPMAtom, ConnectedAtom, DominantLevelAtom, EDAValueAtom, PPGValueAtom, PatientAtom, PatientsAtom, StepsAtom, TempAtom, TimeLevelAtom } from './../../atoms';
import ConstantBar from '../../components/BleutoothButton';
import LinearGradient from 'react-native-linear-gradient';
import PushNotification from "react-native-push-notification";
import axios, { AxiosError } from 'axios';
import { BASE_URL } from '../../config';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Ionicons from 'react-native-vector-icons/Ionicons';

type HomeScreenProps = {
  navigation: any;
};
// types.ts
export interface Patient {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  birthdayDate: string;
  gender: string;
  mobileNumber: string;
  caireGiverIds: string[];
  doctorIds: string[];
  fcmToken: string;
  role: string;
  patientIds: string[];
  password: string;
  __v: number;
}

export default function HomeScreen({ navigation }: HomeScreenProps) {
  const [BPM, setBPM] = useRecoilState(BPMAtom);
  const [Temp, setTemp] = useRecoilState(TempAtom);
  const [Steps, setSteps] = useRecoilState(StepsAtom);
  const [TempDAte, setTempDate] = useState("");
  const [BPMDate, setBPMDate] = useState("");
  const [StepsDate, setStepsDate] = useState("");
  const { userInfo } = useContext(AuthContext);
  // const { userGuestInfo } = useContext(AuthContext);
  const PPGValue = useRecoilValue(PPGValueAtom) as any;
  const EDAValue = useRecoilValue(EDAValueAtom) as any;
  const TimeLevel = useRecoilValue(TimeLevelAtom)
  const [iconStress, setIconStress] = useState("happy");
  const [colorStress, setColorStress] = useState("gray");
  const Patient = useRecoilValue<any>(PatientAtom);
  const setPatient = useSetRecoilState(PatientAtom);
  const Patients = useRecoilValue<Patient[]>(PatientsAtom);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedValue, setSelectedValue] = useState(null);
  const [ppgData, setPpgData] = useState([]);
  const [EDAData, setEDAData] = useState([]);
  const [concatenatedData, setConcatenatedData] = useState<any>();
  const [concatenatedresponse, setConcatenatedresponse] = useState<any>();
  const [dominantStressLevel, setDominantStressLevel] = useState<string | null>(null);
  const setTimeLevel = useSetRecoilState(TimeLevelAtom);
  const { width, height } = Dimensions.get('window');
  const connected = useRecoilValue(ConnectedAtom);

  useEffect(() => {
    if (userInfo.role === 'patient') {
      navigation.setOptions({
        title: '',
        headerRight: () => <ConstantBar marginRight={104} />,
      });
    } else if (userInfo.role === 'caireGiver') {
      navigation.setOptions({
        headerShown: false,
      });
    }
  }, [userInfo.role, navigation]);


  const isConnected = useRecoilValue(ConnectedAtom)
  const { patientId } = useContext(AuthContext);
  const [dominantLevel, setDominantLevel] = useRecoilState(DominantLevelAtom);

  useEffect(() => {
    console.log("ياتكانوك",isConnected);
    
    if(!isConnected){setDominantStressLevel(null)}
    else if (isConnected) {
      console.log("azertycaca",isConnected);

      const fetchStessData = async () => {
        try {
          const [responsePpg, responseEDA] = await Promise.all([
            axios.get(`${BASE_URL}/risk-cron/getLatestPpgDataForFiveMinute/${patientId}`),
            axios.get(`${BASE_URL}/risk-cron/getLatestEDADataForFiveMinute/${patientId}`)
          ]);
   
          const ppgData = responsePpg.data;
          const EDAData = responseEDA.data; 
  
          const extractedDataPpg = ppgData.map((entry: { PPG: { heart_rate: any; }; }) => ({
            heart_rate: entry.PPG.heart_rate,
          }));
  
          const extractedDataEDA = EDAData.map((entry: { EDA: { EDA: any; }[]; }) => ({
            EDA: entry.EDA[0].EDA,
          }));
  
          setTimeLevel(EDAData[0].time)
          const minLength = Math.min(extractedDataEDA.length, extractedDataPpg.length);
          const data = [];
          for (let i = 0; i < minLength; i++) {
            data.push({
              EDA: extractedDataEDA[i].EDA,
              heart_rate: extractedDataPpg[i].heart_rate
            });
          }
          setConcatenatedData(data);
  
        } catch (error) {
          console.error('Error fetching PPG or EDA data:', error);
        }
      };
  
      const determineDominantStressLevel = (dataresponse: any[]) => {
        console.log("determineDominantStressLevel ",dataresponse);
        
        const countMap = dataresponse.reduce((acc, level) => {
          console.log("countMap ",dataresponse);

          acc[level] = (acc[level] || 0) + 1;
          return acc;
        }, {});
  
        let maxCount = 0;
        let dominantLevel = null;
  
        for (const level in countMap) {
          console.log("level ",level);

          if (countMap[level] > maxCount) {
            maxCount = countMap[level];
            dominantLevel = level;
          }
        }
        console.log("determineDominantStressLevel ",dominantLevel);

        setDominantStressLevel(dominantLevel);
      }; 
  
      const processDataAndDetermineStress = async () => {
        await fetchStessData();
        console.log("concatenatedData", concatenatedData);
  
        if (concatenatedData?.length > 0) {
          const dataresponse = await Promise.all(
            concatenatedData?.map(async (dataPoint: { EDA: any; heart_rate: any; }) => {
              const response = await axios.post('http://172.187.93.156:5000/Young_predict', {
                EDA: dataPoint.EDA,
                HeartRate: dataPoint.heart_rate,
              });
              return response.data.stress_level;
            })
          );
  
          setConcatenatedresponse(dataresponse);
          determineDominantStressLevel(dataresponse);
          setDominantLevel(dominantStressLevel as any);
          console.log("dominantStressLevel", dominantStressLevel);
        }
      };
  
      processDataAndDetermineStress();
      const intervalId = setInterval(processDataAndDetermineStress, 60 * 1000); // Run every minute
  
      return () => clearInterval(intervalId);
    }
   
  }, [patientId, isConnected]);
  
  useEffect(() => {
    if (userInfo.role === 'patient') {
      console.log("DominantLevel", dominantLevel);

      if (connected) {
        setIconStress("happy");
        setColorStress("#3AA50E");
    } else { 
        setIconStress("sad");
        setColorStress("#bcbcbc"); 
    }
 

      const fetchData = async (dominantLevel: any) => {
        try {
          switch (dominantLevel) {
            case "low":
              setIconStress("happy");
              setColorStress("#3AA50E");
              break;
            case "medium":
              setIconStress("happy");
              setColorStress("#D1837F");
              break; 
            case "high":
              setIconStress("sad");
              setColorStress("#B50F0F");
              break;
            default:
              setIconStress("happy");
              setColorStress("#3AA50E");
              break;
          }
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };

      fetchData(dominantLevel);
    }
  }, [PPGValue, EDAValue,dominantLevel]);

  const fetchPatientData = (patient: any) => {
    if (userInfo.role === 'caireGiver' && patient) {
      const fetchData = async () => {
        try {
          const urls = {
            temp: `${BASE_URL}/data/getLatestTempData/${patient._id}`,
            hr: `${BASE_URL}/data/getLatestPPGData/${patient._id}`,
            steps: `${BASE_URL}/data/getLatestStepsData/${patient._id}`
          };
          console.log("start fetching for ", patient.firstName);

          const [tempResponse, hrResponse, stepsResponse] = await Promise.all([
            axios.get(urls.temp),
            axios.get(urls.hr),
            axios.get(urls.steps)
          ]);

          const Temp = tempResponse.data.latestTempData?.TEMP?.wrist ?? '--';
          const HR = hrResponse.data[0]?.PPG?.heart_rate ?? '--';
          const Step = stepsResponse.data[0]?.Motion?.steps ?? '--';

          setSteps(Step);
          setBPM(HR);
          setTemp(Temp);
          setStepsDate(stepsResponse.data[0]?.Motion?.time || '');
          setBPMDate(hrResponse.data[0]?.PPG?.time || '');
          setTempDate(tempResponse.data.latestTempData?.TEMP?.time || '');
        } catch (error) {
          setSteps('--');
          setBPM('--');
          setTemp('--');
          setStepsDate('');
          setBPMDate('');
          setTempDate('');
        }
      };

      fetchData();
      const intervalId = setInterval(fetchData, 15000);
      return () => clearInterval(intervalId);
    }
  }

  useEffect(() => {
    if (userInfo.role === "caireGiver") {
      fetchPatientData(Patient)
    }
  }, [Patient]);


  const changePatient = (option: {}) => {
    console.log("option", option);
    setBPM('--');
    setSteps('--');
    setTemp('--');
    setStepsDate("");
    setBPMDate("");
    setTempDate("");
    setTimeout(() => {
      setPatient(option);
    }, 0);
  };

  const getStylesForRole = (role: string) => {
    if (role === "patient") {
      return styles.text1;
    } else if (role === "caireGiver") {
      return styles.text2;
    }
    return styles.container;
  };

  return (
    <LinearGradient colors={['#FEFEFE', '#EDEBF7']} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <WelcomeComponent welcome='good morning' name={userInfo.firstName} color="#F5F3FF" marginTop={20} />
        <StressLevelComponent title={'Stress Level'} color="#FAF9FE" marginTop={3} status={iconStress} statusColor={colorStress} />
        <Text style={{ ...styles.text, fontWeight: '900' }}>Tap to see details  </Text>
        {userInfo.role === "caireGiver" && Patients.length !== 0 &&
          <>
            <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.iconContainer}>
              <Ionicons name="swap-horizontal-outline" size={30} color="white" />
            </TouchableOpacity>
            <Modal
              animationType="slide"
              transparent={true}
              visible={modalVisible}
              onRequestClose={() => setModalVisible(false)}
            >
              <View style={styles.centeredView}>
                <View style={styles.modalView}>
                  <Text style={styles.modalText}>Select Patient </Text>
                  {Patients.map((option) => (
                    <TouchableOpacity
                      key={option._id}  // Ensure each key is unique
                      style={styles.option}
                      onPress={async () => {
                        await changePatient(option)
                        setModalVisible(false);
                      }}
                    >
                      <Text style={styles.optionText}>{option.firstName} {option.lastName} </Text>
                    </TouchableOpacity>
                  ))}
                  <TouchableOpacity
                    style={[styles.button, styles.buttonClose]}
                    onPress={() => setModalVisible(false)}
                  >
                    <Text style={styles.textStyle}>Close</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
          </>
        }

        <TemperatureLevelComponent wirst={parseFloat(Temp)} time_forcaireGiver={TempDAte} title="Temperature" marginTop={210} />
        <HeartrateComponent BPM={BPM} title="Heart Rate" marginTop={210} height={118} time_forcaireGiver={BPMDate} />
        <StepsComponent Steps={Steps} title="Steps" marginTop={341} height={118} time_forcaireGiver={StepsDate} />
        <Text style={{ ...getStylesForRole(userInfo.role), fontWeight: '900' }} >Sleep quality </Text>
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
    fontSize: wp('4%'),
    textAlign: 'center',
    color: 'black',
    marginTop: hp('5%'),
    top: hp('12%'),
    right: hp('13%')
  },
  Ionicons: {
    top: hp('8.5%'),
    left: hp('20%')
  },
  text1: {
    fontSize: wp('4%'),
    textAlign: 'center',
    color: 'black',
    top: hp('44%'),
    right: hp('15%')
  },
  text2: {
    fontSize: wp('4%'),
    textAlign: 'center',
    color: 'black',
    top: hp('40%'),
    right: hp('15%')
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '90%', // Larger modal size
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    fontSize: 18, // Larger text
    color: "black"
  },
  option: {
    padding: 10,
    marginVertical: 5,
    backgroundColor: '#f2f2f2',
    borderRadius: 5,
    width: '80%', // Fixed width for all options
    alignItems: 'center',
    color: "black"

  },
  optionText: {
    fontSize: 16, // Larger text within each option
    color: "black"

  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2
  },
  buttonClose: {
    backgroundColor: '#563596',
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },

  iconContainer: {
    padding: 10,
    backgroundColor: '#563596',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    top: hp('7.3px'),
    left: hp('19%')
  },
  iconContainer1: {
    padding: 10,
    backgroundColor: '#563596',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    top: hp('1px'),
    left: hp('15%')
  },
});
