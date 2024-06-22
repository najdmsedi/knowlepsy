import { Dimensions, StyleSheet, Text, View, Animated, Easing, TouchableOpacity } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { LineChart } from 'react-native-chart-kit';
import LinearGradient from 'react-native-linear-gradient';
import { useRecoilState, useRecoilValue } from 'recoil';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { PPGListAtom, PPGListTimeAtom, PPGValueAtom } from '../atoms';
import { Image } from 'react-native-elements';
import DatePicker from 'react-native-date-picker';

const HeartRate = () => {
  const PPGValue = useRecoilValue(PPGValueAtom) as any;
  const [PPGList, setPPGList] = useRecoilState(PPGListAtom);
  const [PPGListTime, setPPGListTime] = useRecoilState(PPGListTimeAtom);

  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [isStartDatePickerVisible, setStartDatePickerVisibility] = useState(false);
  const [isEndDatePickerVisible, setEndDatePickerVisibility] = useState(false);
  
  useEffect(() => {
    if (PPGValue?.heart_rate != undefined) {
      const updatedPPGList = [...PPGList, PPGValue?.heart_rate];
      const updatedPPGListTime = [...PPGListTime, PPGValue?.time];

      if (updatedPPGList.length > 10) {
        updatedPPGList.shift();
      }
      if (updatedPPGListTime.length > 10) {
        updatedPPGListTime.shift();
      }
      setPPGListTime(updatedPPGListTime);
      setPPGList(updatedPPGList);
    }
  }, [PPGValue]);

  const heartSize = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const animateHeart = () => {
      return Animated.loop(
        Animated.sequence([
          Animated.timing(heartSize, {
            toValue: 1.5,
            duration: 500,
            easing: Easing.bounce,
            useNativeDriver: true,
          }),
          Animated.timing(heartSize, {
            toValue: 1,
            duration: 500,
            easing: Easing.bounce,
            useNativeDriver: true,
          }),
        ])
      ).start();
    };

    animateHeart();
  }, [heartSize]);

  const filterDataByDate = () => {
    if (startDate && endDate) {
      console.log("startDate", startDate);
      console.log("endDate", endDate);

      const filteredTEMPList = PPGList.filter((_, index) => {
        const tempTime = new Date(PPGListTime[index]);
        return tempTime >= startDate && tempTime <= endDate;
      });

      const filteredTempListTime = PPGListTime.filter((time) => {
        const tempTime = new Date(time);
        return tempTime >= startDate && tempTime <= endDate;
      });

      return { filteredTEMPList, filteredTempListTime };
    }
    return { filteredTEMPList: PPGList, filteredTempListTime: PPGListTime };
  };

  const { filteredTEMPList, filteredTempListTime } = filterDataByDate();

  useEffect(() => {
    console.log("Filtered TEMP List:", filteredTEMPList);
    console.log("Filtered Temp List Time:", filteredTempListTime);
  }, [filteredTEMPList, filteredTempListTime]);

  const showStartDatePicker = () => {
    setStartDatePickerVisibility(true);
  };

  const showEndDatePicker = () => {
    setEndDatePickerVisibility(true);
  };

  const handleStartConfirm = (date: Date) => {
    setStartDate(date);
    setStartDatePickerVisibility(false);
    if (endDate) {
      console.log("Both dates selected: Start Date -", date, "End Date -", endDate);
    } else {
      console.log("Start date selected:", date);
    }
  };

  const handleEndConfirm = (date: Date) => {
    setEndDate(date);
    setEndDatePickerVisibility(false);
    if (startDate) {
      console.log("Both dates selected: Start Date -", startDate, "End Date -", date);
    } else {
      console.log("End date selected:", date);
    }
  };
  return (
    <LinearGradient colors={['#FEFEFE', '#A992FC']} style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={styles.header}>Heart Rate</Text>
      {/* <Text style={styles.heartRateValue}>{PPGValue?.heart_rate} </Text><Text style={{ color: "#28032B", top: 50, left: 50 }}>BPM </Text> */}
      <View style={styles.dateButtonContainer}>
        <TouchableOpacity onPress={showStartDatePicker} style={styles.dateButton}>
          <Text style={styles.dateButtonText}>
            {startDate ? startDate.toDateString() : 'Select Start Date '}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity onPress={showEndDatePicker} style={styles.dateButton}>
          <Text style={styles.dateButtonText}>
            {endDate ? endDate.toDateString() : 'Select End Date '}
          </Text>
        </TouchableOpacity>
      </View>
      <LineChart
        data={{
          labels: PPGListTime,
          datasets: [{ data: PPGList }]
        }}
        width={Dimensions.get('window').width - 32} // Full width of the screen with some padding
        height={350}
        yAxisInterval={1} // optional, defaults to 1
        verticalLabelRotation={60}
        chartConfig={{
          backgroundColor: "#1e2923",
          backgroundGradientFrom: "#7B60EA",
          backgroundGradientTo: "#9B88EA",
          decimalPlaces: 0, // Show no decimal places
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          style: {
            borderRadius: 16,
          },
          propsForDots: {
            r: "4",
            strokeWidth: "2",
            stroke: "#ffa726"
          },
          propsForBackgroundLines: {
            strokeDasharray: ""
          },
        }}
        bezier
        style={styles.chart}
      />

      {/* <View style={styles.heartRateContainer}>
        <View style={styles.heartRateContainer}>
          <Animated.View style={{ transform: [{ scale: heartSize }] }}>
            <Image source={require('../../assets/hearRate3D.png')} style={styles.heartIcon} />
          </Animated.View>
        </View>
      </View> */}
  <View style={styles.heartRateContainer}>
        <Text style={styles.label}>Real Time </Text>
        {/* <View style={styles.temperatureIconContainer}>
          {showThermometerOutline ? (
            <Ionicons name={'thermometer-outline'} size={100} color={'#D1837F'} />
          ) : (
            <Ionicons name={'thermometer'} size={100} color={'#D1837F'} />
          )}
          <Text style={{ color: "#28032B", marginLeft: 80 }}>
            <Text style={styles.temperatureValue}>{TEMPValue.wrist} </Text> C°
          </Text>
        </View> */}
        <LineChart
          data={{
            labels: filteredTempListTime,
            datasets: [{ data: filteredTEMPList }],
          }}
          width={Dimensions.get('window').width - 32}
          height={200}
          yAxisInterval={1}
          verticalLabelRotation={60}
          yAxisSuffix=" C°"
          chartConfig={{
            backgroundColor: "#1e2923",
            backgroundGradientFrom: "#7B60EA",
            backgroundGradientTo: "#9B88EA",
            decimalPlaces: 2,
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            style: {
              borderRadius: 16,
            },
            propsForDots: {
              r: "4",
              strokeWidth: "2",
              stroke: "#ffa726"
            },
            propsForBackgroundLines: {
              strokeDasharray: ""
            }
          }}
          bezier
          style={styles.chart2}
        />
      </View>
    </LinearGradient>
  );
}

export default HeartRate;

const styles = StyleSheet.create({
  heartIcon: {
    width: 100,
    height: 100,
  },
  header: {
    color: '#402477',
    fontSize: 23,
    top: 220,
    fontWeight: 'bold',
  },
  chart: {
    borderRadius: 16,
    paddingVertical: 190,
    top: 80,
  },
  chart2: {
    borderRadius: 16,
    paddingVertical: 80,
    top:0
  },
  heartRateContainer: {
    alignItems: 'center',
    bottom: 150,
  },
  label: {
    fontSize: 20,
    color: "black",
    top: 50,
  }, 
  heartIconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heartRateValue: {
    textAlign: 'center',
    fontSize: 40,
    color: "black",
    marginLeft: 0,
    top: 70,
  },
  dateButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
    marginBottom: 10,
    top: 260,
  },
  dateButton: {
    backgroundColor: '#A992FC',
    padding: 10,
    borderRadius: 10,
    marginHorizontal: 5,
    flex: 1,
    alignItems: 'center',
  },
  dateButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
});