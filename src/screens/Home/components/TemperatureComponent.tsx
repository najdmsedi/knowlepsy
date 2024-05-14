import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface RectangleProps {
  title: string;
  color?: string;
  marginTop: number;
  height?: number;
  wrist? : any;
}

const TemperatureComponent: React.FC<RectangleProps> = ({ title, color = '#F5F3FD' ,marginTop,height=80,wrist='--'}) => {
  return (
    <View style={[styles.container, { backgroundColor: color }, { top: marginTop }, { height: height }]}>
    <Text style={styles.title}>{title}</Text>
    <Text style={styles.wrist}>{wrist} <Text style={styles.wristText}>C°</Text></Text>
  </View>
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
  wrist :{
    fontSize: 23,
    fontWeight: 'bold',
    marginBottom:10,
    color:'#C45549'
  },
  wristText: {
    fontSize: 19,

    color: 'black',
  },
});

export default TemperatureComponent;
