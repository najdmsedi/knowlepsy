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
  // labels: ["1991", "1992", "1993", "1994", "1995", "1996", "1997", "1998", "1999"],
  labels:[],
  datasets: [
    {
      data: [0, 0, 0, 0, 0, 0, 0, 2, 1]
    }
  ]
};

const chartConfig = {
  backgroundColor: "#FFF",
  backgroundGradientFrom: "#4A189B",
  backgroundGradientTo: "#935fe8",
  decimalPlaces: 0, // optional, defaults to 2dp
  color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
  style: {
    borderRadius: 16
  },
  barPercentage: 0.5,
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
      verticalLabelRotation={30}
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
  // container: {
  //   position: 'absolute',
  //   left: 10,
  //   right: 10,
  //   width: 'auto',
  //   borderRadius: 10,
  //   justifyContent: 'center',
  //   alignItems: 'center',
  //   marginBottom: 20,
  //   elevation: 3,

  // },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black'

  },
});

export default LastSleepTrackingComponent;
