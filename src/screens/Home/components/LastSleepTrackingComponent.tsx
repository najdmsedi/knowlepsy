import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface RectangleProps {
  title: string;
  color?: string;
  marginTop: number;
  height?: number;
}

const LastSleepTrackingComponent: React.FC<RectangleProps> = ({ title, color = '#F5F3FD' ,marginTop,height=160}) => {
  return (
    <View style={[styles.container, { backgroundColor: color } ,{top: marginTop} ,{height:height}]}>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 10, 
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
    color: 'black'

  },
});

export default LastSleepTrackingComponent;
