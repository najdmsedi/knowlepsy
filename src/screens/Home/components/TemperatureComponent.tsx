import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { PulseIndicator } from '../../../../PulseIndicator';

interface RectangleProps {
  title: string;
  color?: string;
  marginTop: number;
  height?: number;
  BPM? : number;
}

const HeartrateComponent: React.FC<RectangleProps> = ({ title, color = '#F5F3FD' ,marginTop,height=80,BPM='--'}) => {
  return (
    <View style={[styles.container, { backgroundColor: color }, { top: marginTop }, { height: height }]}>
    <Text style={styles.title}>{title}</Text>
    <Text style={styles.BPM}>{BPM} <Text style={styles.BPMText}>C°</Text></Text>
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
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: -2,

  },
  BPM :{
    fontSize: 23,
    fontWeight: 'bold',
    marginBottom:10,
    color:'#C45549'
  },
  BPMText: {
    fontSize: 19,

    color: 'black',
  },
});

export default HeartrateComponent;
