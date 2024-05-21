import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface RectangleProps {
  title?: string;
  color?: string;
  marginTop?: number;
  height?: number;
  value?: any;
  width?:number;
  left?:number;
  children?: React.ReactNode; 
}


const ComponentSteps: React.FC<RectangleProps> = ({ title, color = '#F5F3FD' ,marginTop,height=80,value='--',width,left}) => {
  return (
    <View style={[styles.container, { backgroundColor: color }, { top: marginTop }, { height: height } , { width: width }, { left: left }]}>
     <View style={styles.titleContainer}>
        <Text style={styles.title}>{title}</Text>
        <Ionicons name={'footsteps'} size={25} color={'#2D7A4B'} />
      </View>
    <Text style={styles.value}>{value} <Text style={styles.valueText}>Step</Text></Text>
  </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    right: 10, 
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20, 
    elevation: 3,

  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: -2,
    color: 'black'
  },
  value :{
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom:10,
    color:'#60BF70'
  },
  valueText: {
    fontSize: 13,
    color: 'black',
  },
});

export default ComponentSteps;
