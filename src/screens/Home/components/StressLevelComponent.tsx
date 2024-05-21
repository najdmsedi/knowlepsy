import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { RootStackParamList } from '../../../navigation/TabNavigator';
import { useNavigation } from '@react-navigation/native';

interface RectangleProps {
  title: string;
  color?: string;
  marginTop: number;
  marginRight?: number;
  height?: number;
  status: string;
  statusColor: string;
}
type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

const StressLevelComponent: React.FC<RectangleProps> = ({ title, color = 'lightblue', marginTop, height = 120, status, statusColor,marginRight }) => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const onPress = () => {navigation.navigate('Stress')}
  
  return (
    <LinearGradient colors={['#FEFEFE', '#E3DFF7']} style={[styles.container, { backgroundColor: color, top: marginTop, height: height, }]}>
      <TouchableOpacity onPress={onPress}>
          <Text style={styles.title}>{title}</Text>

          <Ionicons name={`${status}-outline`} size={60} color={statusColor} style={{ top: 10 }} />


          {/* <Ionicons name={`${status}-outline`} size={60} color={'#3AA50E'} style={{ top: 10 }} />

      <Ionicons name={'happy-outline'} size={60} color={'#D1837F'} style={{ top: 10 }} />

      <Ionicons name={'sad-outline'} size={60} color={'#B50F0F'} style={{ top: 10 }} /> */}
      </TouchableOpacity>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 280,
    right: 20,
    width: 'auto',
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
    top: -18,
    color: 'black'
  },
});

export default StressLevelComponent;
