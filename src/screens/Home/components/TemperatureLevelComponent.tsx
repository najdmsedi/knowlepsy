import React, { useContext } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import CircularProgress from 'react-native-circular-progress-indicator';
import LinearGradient from 'react-native-linear-gradient';
import { useRecoilValue } from 'recoil';
import { ConnectedAtom } from '../../../atoms';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../navigation/TabNavigator';
import { AuthContext } from '../../../context/AuthContext';

interface RectangleProps {
  title: string;
  color?: string;
  marginTop: number;
  height?: number;
  wirst?: number;
  time_forDoctor?:string;
}
type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

const TemperatureLevelComponent: React.FC<RectangleProps> = ({ title, color = '#F5F3FD', marginTop, height = 250, wirst ,time_forDoctor=""}) => {
  const connected = useRecoilValue(ConnectedAtom);
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const onPress = () => { navigation.navigate('Temperature') }
  const { userInfo } = useContext(AuthContext);
console.log("time_forDoctor",time_forDoctor);

  return (
    <LinearGradient colors={['#FEFEFE', '#E3DFF7']} style={[styles.container, { backgroundColor: color, top: marginTop, height: height }]}>
      <TouchableOpacity onPress={onPress}>
        <View style={styles.innerContainer}>
          <Text style={styles.title}>{title}</Text>
          <CircularProgress
            value={wirst ? wirst : 0}
            duration={500}
            radius={60}
            valueSuffix={'°C'}
            inActiveStrokeOpacity={0.2}
            maxValue={60}
            inActiveStrokeColor={'#5916C9'}
            activeStrokeColor='#5916C9'
            progressValueColor='#7B53F1'
            progressValueFontSize={22}
            progressFormatter={(value: any) => {
              'worklet';
              return value.toFixed(2);
            }}
          />
          {/* for patient */}
          {!connected && userInfo.role === "patient" &&
            <Text style={{ color: '#E84A46', marginTop: 30 }}>offline </Text>
          }


          {/* for doctor */}
          {userInfo.role === "doctor" && !wirst &&
            <>
              <Text style={{ color: '#E84A46', marginTop: 30 }}>no fetch data </Text>
            </>
          }

          {userInfo.role === "doctor" && time_forDoctor &&
            <>
              <Text style={{ color: 'gray', marginTop: 30 }}> {time_forDoctor} </Text>
            </>
          }
        </View>
      </TouchableOpacity>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 10,
    right: 220,
    width: 'auto',
    borderRadius: 10,
    marginBottom: 20,
    elevation: 3,
  },
  innerContainer: {
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'black'
  },
});

export default TemperatureLevelComponent;
