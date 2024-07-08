import React, { useContext } from 'react';
import { View, StyleSheet } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import { AuthContext } from '../../../context/AuthContext';

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
      data: [80, 85, 90, 0, 0, 0, 0]
    }
  ]
};

const chartConfig = {
  backgroundColor: "#FFF",
  backgroundGradientFrom: "#9466ed",
  backgroundGradientTo: "#9466ed",
  decimalPlaces: 0,
  color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
  style: {
    borderRadius: 16
  },
  barPercentage: 0.5,
  yAxisInterval: 1,
  fromZero: true,
  propsForBackgroundLines: {
    strokeWidth: 1,
    strokeDasharray: ''
  },
  fillShadowGradient: '#e1634d', 
  fillShadowGradientOpacity: 1, 
};

const LastSleepTrackingComponent: React.FC<RectangleProps> = ({ title, color = '#F5F3FD', marginTop, height = 160 }) => {
  const { userInfo } = useContext(AuthContext);
  const getStylesForRole = (role: string) => {
    if (role === "patient") {
      return styles.container;
    } else if (role === "caireGiver") {
      return styles.container1;
    }
    return styles.container; // Default style if role is neither patient nor caregiver
  };
  return (
   
    <View style={getStylesForRole(userInfo.role)}>
      <BarChart
        style={styles.chart}
        data={data}
        width={screenWidth - 20} 
        height={230}
        yAxisLabel=""
        yAxisSuffix="" 
        chartConfig={chartConfig}
        showBarTops={false}
        showValuesOnTopOfBars={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 400,
  },
  container1: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 360,
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
