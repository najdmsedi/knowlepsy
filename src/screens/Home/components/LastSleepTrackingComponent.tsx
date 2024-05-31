import React from 'react';
import { View, StyleSheet } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';

const screenWidth = Dimensions.get("window").width;

interface RectangleProps {
  title: string;
  color?: string;
  marginTop: number;
  height?: number;
}

const data = {
  labels: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  datasets: [
    {
      data: [80, 0, 90, 0, 0, 0, 0]
    }
  ]
};

const chartConfig = {
  backgroundColor: "#FFF",
  backgroundGradientFrom: "#563596",
  backgroundGradientTo: "#935fe8",
  decimalPlaces: 0, // optional, defaults to 2dp
  color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
  style: {
    borderRadius: 16
  },
  barPercentage: 0.5,
  yAxisInterval: 1, // optional, defaults to 1
  fromZero: true, // Make sure the chart starts from zero
  propsForBackgroundLines: {
    strokeWidth: 1,
    strokeDasharray: '' // Solid lines
  },
  fillShadowGradient: '#FF6347', // Set the bar color here (e.g., Tomato color)
  fillShadowGradientOpacity: 1, // Full opacity for solid color
};

const LastSleepTrackingComponent: React.FC<RectangleProps> = ({ title, color = '#F5F3FD', marginTop, height = 160 }) => {
  return (
    <View style={styles.container}>
      <BarChart
        style={styles.chart}
        data={data}
        width={screenWidth - 20} // Adjust to fit your layout
        height={230}
        yAxisLabel=""
        yAxisSuffix="" // Adding the required yAxisSuffix property
        chartConfig={chartConfig}
        showBarTops={false} // Hide the bar tops
        showValuesOnTopOfBars={false} // Hide the values on top of bars
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 550,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black'
  },
});

export default LastSleepTrackingComponent;
