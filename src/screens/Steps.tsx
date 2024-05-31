import { Dimensions, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { BarChart, LineChart, ProgressChart } from 'react-native-chart-kit'
import LinearGradient from 'react-native-linear-gradient'
const screenWidth = Dimensions.get("window").width;
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
const Steps = () => {
  return (
    <LinearGradient colors={['#FEFEFE', '#A992FC']} style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ color: '#402477', bottom: 120, fontSize: 23 }}>Steps </Text>
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

    </LinearGradient>
  )
}

export default Steps

const styles = StyleSheet.create({
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
})