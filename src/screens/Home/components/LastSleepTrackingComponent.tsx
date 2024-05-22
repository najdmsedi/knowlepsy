import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { Dimensions } from "react-native";

const screenWidth = Dimensions.get("window").width;
interface RectangleProps {
  title: string;
  color?: string;
  marginTop: number;
  height?: number;
}
const data = {
  labels: ['January', 'February', 'March', 'April', 'May'],
  datasets: [
    {
      data: [20, 45, 28, 80, 99]
    }
  ]
};
const chartConfig = {
  backgroundGradientFrom: "#1E2923",
  backgroundGradientFromOpacity: 0,
  backgroundGradientTo: "#08130D",
  backgroundGradientToOpacity: 0.5,
  color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
  strokeWidth: 2, // optional, default 3
  barPercentage: 0.5,
  useShadowColorFromDataset: false // optional
};
const LastSleepTrackingComponent: React.FC<RectangleProps> = ({ title, color = '#F5F3FD', marginTop, height = 160 }) => {

  return (
    <View style={[styles.container, { backgroundColor: color }, { top: marginTop }, { height: height }]}>
   
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
