import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface RectangleProps {
  title?: string;
  color?: string;
  marginTop?: number;
  height?: number;
  value?: any;
  width?: number;
  left?: number;
  children?: React.ReactNode;
}


const ComponentTemperature: React.FC<RectangleProps> = ({ title, color = '#FDE9E7', marginTop, height = 80, value = '--', width, left }) => {
  return (
    <View style={[styles.container, { backgroundColor: color }, { top: marginTop }, { height: height }, { width: width }, { left: left }]}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{title}</Text>
        <Ionicons name={'thermometer-outline'} size={25} color={'#9C93D8'} />
      </View>
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
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 13,
    fontWeight: 'bold',
    marginBottom: -2,
    color: 'black'
  },
  value: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#9C93D8'
  },
  valueText: {
    fontSize: 15,
    color: 'black',
  },
});

export default ComponentTemperature;
