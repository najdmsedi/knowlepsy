import React, { useEffect, useState } from 'react';
import { Dimensions, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { LineChart } from 'react-native-chart-kit';
import { useRecoilState, useRecoilValue } from 'recoil';
import { TempListAtom, TempListTimeAtom, TempValueAtom } from '../atoms';
import Ionicons from 'react-native-vector-icons/Ionicons';
import DatePicker from 'react-native-date-picker';

const Temperature = () => {
  const TEMPValue = useRecoilValue(TempValueAtom) as any;
  const [TEMPList, setTEMPList] = useRecoilState(TempListAtom);
  const [TempListTime, setTempListTime] = useRecoilState(TempListTimeAtom);
  const [showThermometerOutline, setShowThermometerOutline] = useState(true);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [isStartDatePickerVisible, setStartDatePickerVisibility] = useState(false);
  const [isEndDatePickerVisible, setEndDatePickerVisibility] = useState(false);

  useEffect(() => {
    if (TEMPValue?.wrist !== undefined) {
      const updatedTEMPList = [...TEMPList, TEMPValue.wrist];
      const updatedTempListTime = [...TempListTime, TEMPValue?.time];

      if (updatedTempListTime.length > 10) {
        updatedTempListTime.shift();
      }
      if (updatedTEMPList.length > 10) {
        updatedTEMPList.shift();
      }

      setTempListTime(updatedTempListTime);
      setTEMPList(updatedTEMPList);
    }
  }, [TEMPValue]);

  useEffect(() => {
    const interval = setInterval(() => {
      setShowThermometerOutline(prevState => !prevState);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const filterDataByDate = () => {
    if (startDate && endDate) {
      console.log("startDate", startDate);
      console.log("endDate", endDate);

      const filteredTEMPList = TEMPList.filter((_, index) => {
        const tempTime = new Date(TempListTime[index]);
        return tempTime >= startDate && tempTime <= endDate;
      });

      const filteredTempListTime = TempListTime.filter((time) => {
        const tempTime = new Date(time);
        return tempTime >= startDate && tempTime <= endDate;
      });

      return { filteredTEMPList, filteredTempListTime };
    }
    return { filteredTEMPList: TEMPList, filteredTempListTime: TempListTime };
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
      <Text style={styles.header}>Temperature</Text>

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

      <DatePicker
        modal
        open={isStartDatePickerVisible}
        date={startDate || new Date()}
        onConfirm={handleStartConfirm}
        onCancel={() => setStartDatePickerVisibility(false)}
        mode="date"
        maximumDate={new Date()}
      />

      <DatePicker
        modal
        open={isEndDatePickerVisible}
        date={endDate || new Date()}
        onConfirm={handleEndConfirm}
        onCancel={() => setEndDatePickerVisibility(false)}
        mode="date"
        maximumDate={new Date()}
      />

      {filteredTempListTime.length > 0 && filteredTEMPList.length > 0 ? (
        <LineChart
          data={{
            labels: filteredTempListTime,
            datasets: [{ data: filteredTEMPList }],
          }}
          width={Dimensions.get('window').width - 32}
          height={350}
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
          style={styles.chart}
        />
      ) : (
        <Text style={styles.noDataText}>No data available for the selected dates</Text>
      )}

      <View style={styles.temperatureContainer}>
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

export default Temperature;

const styles = StyleSheet.create({
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
  noDataText: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
    marginVertical: 20,
  },
  temperatureContainer: {
    alignItems: 'center',
    bottom: 150,
  },
  temperatureIconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  temperatureValue: {
    fontSize: 30,
    color: "black",
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
    fontSize: 30,
    color: "black",
    marginLeft: 80,
    bottom: 10,
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
