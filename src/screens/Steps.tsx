import { Dimensions, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { BarChart, LineChart, ProgressChart } from 'react-native-chart-kit'
import LinearGradient from 'react-native-linear-gradient'
const screenWidth = Dimensions.get("window").width;
const data = {
  labels: ["January", "February", "March", "April", "May", "June"],
  datasets: [
    {
      data: [20, 45, 28, 80, 99, 43]
    }
  ]
};
const chartConfig = {
  backgroundGradientFrom: "#C4BCED",
  backgroundGradientFromOpacity: 0,
  backgroundGradientTo: "#C4BCED",
  backgroundGradientToOpacity: 0.5,
  color: (opacity = 1) => `rgba(86,33,234, ${opacity})`,
  strokeWidth: 2, // optional, default 3
  barPercentage: 0.5,
  useShadowColorFromDataset: false // optional
};
const Steps = () => {
  return (
    <LinearGradient colors={['#FEFEFE', '#A992FC']} style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ color: '#402477', bottom: 120, fontSize: 23 }}>Heart Rate </Text>
      <BarChart
      yAxisSuffix=''
        data={data}
        width={screenWidth}
        height={220}
        yAxisLabel="step"
        chartConfig={chartConfig}
        verticalLabelRotation={30}
      />
    </LinearGradient>
  )
}

export default Steps

const styles = StyleSheet.create({})