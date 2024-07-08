import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { RootStackParamList } from '../../../navigation/TabNavigator';
import { useNavigation } from '@react-navigation/native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

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

const StressLevelComponent: React.FC<RectangleProps> = ({ title, color = 'lightblue', marginTop, height = 120, status, statusColor, marginLeft = 0 }) => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const onPress = () => { navigation.navigate('Stress') }

  return (
    <LinearGradient colors={['#FEFEFE', '#E3DFF7']} style={[styles.container, { backgroundColor: color, top: hp(`${marginTop}%`), height: height, marginLeft: marginLeft }]}>
      <TouchableOpacity onPress={onPress}>
        <Text style={styles.title}>{title}</Text>
        <Ionicons name={`${status}-outline`} size={60} color={"#3AA50E"} style={{ top: 20 }} />
        <Ionicons name={`alert-circle-outline`} size={25} color={"black"} style={{ top: 10, left: 60 }} />
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
  title: {
    fontSize: 15,
    fontWeight: 'bold',
    position: 'absolute',
    left: -15,
    top: -5,
    color: 'black'
  },
});

export default StressLevelComponent;
