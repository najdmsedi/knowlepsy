import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useRecoilValue } from 'recoil';
import { ConnectedAtom } from '../../../atoms';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../navigation/TabNavigator';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../../../context/AuthContext';

interface RectangleProps {
  title: string;
  color?: string;
  marginTop: number;
  height?: number;
  BPM?: any;
  time_forDoctor?:string;
}
type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

const HeartrateComponent: React.FC<RectangleProps> = ({ title, color = '#F5F3FD', marginTop, height = 80, BPM = '--', time_forDoctor=""}) => {
  const connected = useRecoilValue(ConnectedAtom);
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const onPress = () => { navigation.navigate('HeartRate') }
  const { userInfo } = useContext(AuthContext);
  console.log("from here ",BPM)
  return (
    <LinearGradient colors={['#FEFEFE', '#E3DFF7']} style={[styles.container, { backgroundColor: color, top: marginTop, height: height }]}>
      <TouchableOpacity onPress={onPress}>
        <Text style={styles.title}>{title}</Text>
        {connected &&
          <Text style={styles.BPM}>{BPM} <Text style={styles.BPMText}>BPM</Text></Text>
        }
{/* for patient */}

        {!connected && userInfo.role === "patient" &&
          <>
            <Text style={styles.BPM}>-- <Text style={styles.BPMText}>BPM</Text></Text>
            <Text style={{ color: '#E84A46', left: 20 }}>offline </Text>
          </>
        }


{/* for doctor */}
        {userInfo.role === "doctor" && !BPM &&
          <>
            <Text style={styles.BPM}>-- <Text style={styles.BPMText}>BPM</Text></Text>
            <Text style={{ color: '#E84A46' }}>no fetch data </Text>
          </>
        }

        {userInfo.role === "doctor" && time_forDoctor && BPM &&
            <>
              <Text style={styles.BPM}>{BPM} <Text style={styles.BPMText}>BPM</Text></Text>

              <Text style={{ color: 'gray' }}> {time_forDoctor} </Text>
            </>
        }
      </TouchableOpacity>
    </LinearGradient>

  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 200,
    right: 10,
    width: 'auto',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    elevation: 3,

  },

  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: -2,
    color: 'black'

  },
  BPM: {
    fontSize: 23,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#C45549'
  },
  BPMText: {
    fontSize: 15,

    color: 'black',
  },
});

export default HeartrateComponent;
