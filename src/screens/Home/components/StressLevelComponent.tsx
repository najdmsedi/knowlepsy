import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import CircularProgress from 'react-native-circular-progress-indicator';

interface RectangleProps {
  title: string;
  color?: string;
  marginTop: number;
  height?: number;
}

const StressLevelComponent: React.FC<RectangleProps> = ({ title, color = '#F5F3FD', marginTop, height = 250 }) => {
  return (
    <View style={[styles.container, { backgroundColor: color, top: marginTop, height: height }]}>
      <View style={styles.innerContainer}>
        <Text style={styles.title}>{title}</Text>
        <CircularProgress
          value={20}
          valueSuffix={'%'}
          inActiveStrokeOpacity={0.2}
          maxValue={100}
          inActiveStrokeColor={'#5916C9'}
          activeStrokeColor='#5916C9'
          progressValueColor='#7B53F1'
          progressValueFontSize={25}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 10,
    right: 220,
    width: 'auto',
    borderRadius: 10,
    marginBottom: 20,
    elevation: 3,
  },
  innerContainer: {
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'black'
  },
});

export default StressLevelComponent;
