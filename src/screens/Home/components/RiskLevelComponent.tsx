import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface RectangleProps {
  title: string;
  color?: string;
  marginTop: number;
  height?: number;
}

const RiskLevelComponent: React.FC<RectangleProps> = ({ title, color = 'lightblue', marginTop, height = 120 }) => {
  return (
    <View style={[styles.container, { backgroundColor: color }, { top: marginTop }, { height: height }]}>
      <Text style={styles.title}>{title}</Text>
      <Ionicons name={'happy-outline'} size={60} color={'#D1837F'} style={{ top: 10 }} />
    </View>
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
  },
  title: {
    fontSize: 15,
    fontWeight: 'bold',
    position: 'absolute',
    left: 16,
    top: 10,
    color:'black'
  },
});

export default RiskLevelComponent;
