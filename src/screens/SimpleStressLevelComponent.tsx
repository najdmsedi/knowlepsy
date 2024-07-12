import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useContext, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Easing } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { RootStackParamList } from '../navigation/TabNavigator';
import { useNavigation } from '@react-navigation/native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useRecoilValue } from 'recoil';
import { ConnectedAtom } from '../atoms';
import { AuthContext } from '../context/AuthContext';

interface RectangleProps {
  title: string;
  color?: string;
  marginTop?: number;
  marginLeft?: number;
  height?: number;
  status: string;
  statusColor: string;
}
type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

const SimpleStressLevelComponent: React.FC<RectangleProps> = ({ title, color = 'lightblue', marginTop, height = 120, status, statusColor, marginLeft = 0 }) => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const connected = useRecoilValue(ConnectedAtom);
  const { userInfo } = useContext(AuthContext);
  const animationProgress = useRef(new Animated.Value(0));

  useEffect(() => {
    Animated.timing(animationProgress.current, {
      toValue: 1,
      duration: 5000,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();
  }, []);

  const onPress = () => { navigation.navigate('Stress') }
  useEffect(() => {
    console.log('StressLevelComponent props updated:', { status, statusColor });
  }, [status, statusColor]);
  
  return (
    <LinearGradient colors={['#FEFEFE', '#E3DFF7']} style={[styles.container, { backgroundColor: color, top: hp(`${marginTop}%`), height: height, marginLeft: marginLeft }]}>

   
        <TouchableOpacity onPress={onPress}>
          <Text style={styles.title}>{title}</Text>
          <Ionicons name={`${status}-outline`} size={60} color={statusColor} style={{ top: 10 }} />
          {/* <Ionicons name={`alert-circle-outline`} size={25} color={"black"} style={{ top: 10, left: 60 }} /> */}
        </TouchableOpacity>
      

    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 270,
    right: 20,
    width: wp('30px'),
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    elevation: 1,

  },
  title1: {
    fontSize: 15,
    fontWeight: 'bold',
    position: 'absolute',
    left: -6,
    top: 7,
    color: 'black'
  },
  title: {
    fontSize: 15,
    fontWeight: 'bold',
    position: 'absolute',
    left: -15,
    top: -15,
    color: 'black'
  },
});

export default SimpleStressLevelComponent;
