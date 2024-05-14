import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

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


const ComponentValue: React.FC<RectangleProps> = ({ title, color = '#F5F3FD' ,marginTop,height=80,value='--',width,left}) => {
  return (
    <View style={[styles.container, { backgroundColor: color }, { top: marginTop }, { height: height } , { width: width }, { left: left }]}>
    <Text style={styles.title}>{title}</Text>
    <Text style={styles.value}>{value} <Text style={styles.valueText}>C°</Text></Text>
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
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: -2,
    color: 'black'
  },
  value :{
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom:10,
    color:'#C45549'
  },
  valueText: {
    fontSize: 19,
    color: 'black',
  },
});

export default ComponentValue;
