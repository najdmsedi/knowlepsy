import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface RectangleProps {
  title: string;
  color?: string;
  marginTop: number;
  height?: number;
  Steps?: any; 
}

const StepsComponent: React.FC<RectangleProps> = ({ title, color = '#F5F3FD', marginTop, height = 80 ,Steps=0}) => {
  return (
    <View style={[styles.container, { backgroundColor: color }, { top: marginTop }, { height: height }]}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.Steps}>{Steps} <Text style={styles.StepsText}>Steps</Text></Text>
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
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: -2,
    color: 'black'

  },
  Steps :{
    fontSize: 23,
    fontWeight: 'bold',
    marginBottom:10,
    color:'#7E49CD'
  },
  StepsText: {
    fontSize: 15,

    color: 'black',
  },
});

export default StepsComponent;
