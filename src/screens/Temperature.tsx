import React, { useContext, useEffect, useState } from 'react';
import { Dimensions, StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { LineChart } from 'react-native-chart-kit';
import { useRecoilState, useRecoilValue } from 'recoil';
import { LoadTempListAtom, LoadTempListTimeAtom, TempListAtom, TempListTimeAtom, TempValueAtom } from '../atoms';
import Ionicons from 'react-native-vector-icons/Ionicons';
import DatePicker from 'react-native-date-picker';
import { BASE_URL } from '../config';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const Temperature = () => {
  const TEMPValue = useRecoilValue(TempValueAtom) as any;
  const [TEMPList, setTEMPList] = useRecoilState(TempListAtom);
  const [TempListTime, setTempListTime] = useRecoilState(TempListTimeAtom);

  const [LoadTempList, setLoadTempList] = useRecoilState(LoadTempListAtom);
  const [LoadTempListTime, setLoadTempListTime] = useRecoilState(LoadTempListTimeAtom);

  const [showThermometerOutline, setShowThermometerOutline] = useState(true);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [isStartDatePickerVisible, setStartDatePickerVisibility] = useState(false);
  const [isEndDatePickerVisible, setEndDatePickerVisibility] = useState(false);
  const { userInfo } = useContext(AuthContext);
  const [error, setError] = useState('');

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

  const fetchTempData = async (start: string, end: string) => {
    try {
      const response = await axios.get(`${BASE_URL}/data/Temp-data/${userInfo._id}/${start}/${end}`);
      const data = response.data;

      const TempValues = data.map((entry: any) => parseFloat(entry.TEMP.wrist));
      const TempTimes = data.map((entry: any) => `${entry.TEMP.time}`);

      setLoadTempList(TempValues);
      setLoadTempListTime(TempTimes);
      setError('');
    } catch (err) {
      setError('Failed to fetch Temp data');
      setLoadTempList([]);
      setLoadTempListTime([]);
    }
  } // Debounce the function with a 300ms delay

  const showStartDatePicker = () => {
    setStartDatePickerVisibility(true);
  };

  const showEndDatePicker = () => {
    setEndDatePickerVisibility(true);
  };

  const handleStartConfirm = (date: any) => {
    setStartDate(date);
    setStartDatePickerVisibility(false);
    if (endDate) {      
      fetchTempData(date.toISOString().split('T')[0], endDate.toISOString().split('T')[0]);
    }
  };

  const handleEndConfirm = (date: any) => {
    setEndDate(date);
    setEndDatePickerVisibility(false);
    if (startDate) {
      fetchTempData(startDate.toISOString().split('T')[0], date.toISOString().split('T')[0]);
    }
  };

  const [showSecondLabel, setShowSecondLabel] = useState(false);

  const handleScroll = (event: { nativeEvent: { contentOffset: { x: any; }; }; }) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    setShowSecondLabel(scrollPosition > 0);
  };

  const chartWidth = Math.max(LoadTempListTime.length * 40, Dimensions.get('window').width - 32);

  const minTemp = Math.min(...LoadTempList);
  const maxTemp = Math.max(...LoadTempList);
  const interval = (maxTemp - minTemp) / 4;
  const customLabels = Array.from({ length: 5 }, (_, i) => (minTemp + i * interval).toFixed(1));

  return (
    <LinearGradient colors={['#FEFEFE', '#A992FC']} style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={styles.header}>Temperature</Text>

      <View style={styles.dateButtonContainer}>
        <TouchableOpacity onPress={showStartDatePicker} style={styles.dateButton}>
          <Text style={styles.dateButtonText}>
            {startDate ? startDate.toDateString() : 'Select Start Date'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={showEndDatePicker} style={styles.dateButton}>
          <Text style={styles.dateButtonText}>
            {endDate ? endDate.toDateString() : 'Select End Date'}
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

      <View style={styles.chartContainer}>
        <ScrollView horizontal onScroll={handleScroll} scrollEventThrottle={16}>
          <View>
            <LineChart
              data={{
                labels: LoadTempListTime,
                datasets: [{ data: LoadTempList }],
              }}
              width={chartWidth} // Adjust width
              height={350}
              yAxisInterval={1}
              verticalLabelRotation={60}
              yAxisSuffix=" C°"
              chartConfig={{
                backgroundColor: "#1e2923",
                backgroundGradientFrom: "#7B60EA",
                backgroundGradientTo: "#9B88EA",
                decimalPlaces: 1,
                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                style: {
                  borderRadius: 16,
                },
                propsForDots: {
                  r: "4",
                  strokeWidth: "2",
                  stroke: "#ffa726",
                },
                propsForBackgroundLines: {
                  strokeDasharray: "",
                },
              }}
              bezier
              style={styles.chart}
            />
          </View>
        </ScrollView>
        {showSecondLabel && (
          <View style={styles.overlay}>
            {customLabels.reverse().map((value, index) => (
              <Text key={index} style={styles.yAxisLabel}>{value} C°</Text>
            ))}
          </View>
        )}
      </View>

      <View style={styles.temperatureContainer}>
        <Text style={styles.label}>Real Time </Text>
        <LineChart
          data={{
            labels: TempListTime,
            datasets: [{ data: TEMPList }],
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
    marginTop: 20,
  },
  chart2: {
    borderRadius: 16,
    paddingVertical: 80,
    top: 0
  },
  noDataText: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
    marginVertical: 20,
  },
  temperatureContainer: {
    alignItems: 'center',
    bottom: 0,
  },
  label: {
    fontSize: 20,
    color: "black",
    top: 50,
  },
  dateButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
    marginBottom: 0,
    top: 10,
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
  chartContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    left: 15
  },
  overlay: {
    position: 'absolute',
    left: 0,
    height: 350,
    justifyContent: 'space-between',
    zIndex: 1,
    paddingVertical: 40,
  },
  yAxisLabel: {
    color: '#fff',
    marginLeft: 8,
    fontSize: 10,
  },
  scrollView: {
    marginLeft: 40, // Space for y-axis labels
  },
});
