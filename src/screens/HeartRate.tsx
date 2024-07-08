import { Dimensions, StyleSheet, Text, View, Animated, Easing, TouchableOpacity, ScrollView } from 'react-native';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { LineChart } from 'react-native-chart-kit';
import LinearGradient from 'react-native-linear-gradient';
import { useRecoilState, useRecoilValue } from 'recoil';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { LoadPPGListAtom, LoadPPGListTimeAtom, PPGListAtom, PPGListTimeAtom, PPGValueAtom } from '../atoms';
import { Image } from 'react-native-elements';
import DatePicker from 'react-native-date-picker';
import axios from 'axios';
import { BASE_URL } from '../config';
import { AuthContext } from '../context/AuthContext';

const HeartRate = () => {
  const PPGValue = useRecoilValue(PPGValueAtom) as any;
  const [LoadPPGList, setLoadPPGList] = useRecoilState(LoadPPGListAtom);
  const [LoadPPGListTime, setLoadPPGListTime] = useRecoilState(LoadPPGListTimeAtom);

  const [PPGList, setPPGList] = useRecoilState(PPGListAtom);
  const [PPGListTime, setPPGListTime] = useRecoilState(PPGListTimeAtom);


  const { userInfo } = useContext(AuthContext);

  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [isStartDatePickerVisible, setStartDatePickerVisibility] = useState(false);
  const [isEndDatePickerVisible, setEndDatePickerVisibility] = useState(false);
  const [error, setError] = useState('');

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

  const fetchPpgData = async (start: string, end: string) => {
    console.log(start, " ", end);

    try {
      console.log(start, " ", end);
      console.log(`${BASE_URL}/data/ppg-data/${userInfo._id}/${start}/${end}`);

      const response = await axios.get(`${BASE_URL}/data/ppg-data/${userInfo._id}/${start}/${end}`);

      const data = response.data;
      // const ppgValues = data.map((entry: { PPG: { heart_rate: string; }; }) => parseFloat(entry.PPG.heart_rate)); // Assuming heart_rate is stored as string
      // const ppgTimes = data.map((entry: { PPG: { time: any; }; }) => entry.PPG.time);
      // const ppgDates = data.map((entry: { PPG: { date: any; }; }) => entry.PPG.date);

      const ppgValues = data.map((entry: { PPG: { heart_rate: string; }; }) => parseFloat(entry.PPG.heart_rate)); // Assuming heart_rate is stored as string
      const ppgTimes = data.map((entry: { PPG: { date: any; time: any; }; }) => `${entry.PPG.time}`); // Combine date and time for better labeling

      console.log("ppgValues ", ppgValues);
      console.log("ppgTimes ", ppgTimes);
      // console.log("ppgDates ",ppgDates);

      // const ppgValues = data.map((entry: { PPG: { value: any; }; }) => entry.PPG.value); // Assuming PPG data has a 'value' field
      // const ppgTimes = data.map((entry: { PPG: { date: any; }; }) => entry.PPG.date); // Assuming PPG data has a 'date' field
      setLoadPPGList(ppgValues);
      setLoadPPGListTime(ppgTimes);
      // setError('');
    } catch (err) {
      console.log('err', err);

      setError('Failed to fetch PPG data');
      setLoadPPGList([]);
      setLoadPPGListTime([]);
    }
  };

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
      fetchPpgData(date.toISOString().split('T')[0], endDate.toISOString().split('T')[0]); // Fetch data if both dates are selected
    }
  };

  const handleEndConfirm = (date: any) => {
    setEndDate(date);
    setEndDatePickerVisibility(false);
    if (startDate) {
      fetchPpgData(startDate.toISOString().split('T')[0], date.toISOString().split('T')[0]); // Fetch data if both dates are selected
    }
  };
  const [showSecondLabel, setShowSecondLabel] = useState(false);

  const handleScroll = (event: { nativeEvent: { contentOffset: { x: any; }; }; }) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    setShowSecondLabel(scrollPosition > 0);
  };

  const chartWidth = Math.max(LoadPPGListTime.length * 40, Dimensions.get('window').width - 32);

  const minTemp = Math.min(...LoadPPGList);
  const maxTemp = Math.max(...LoadPPGList);
  const interval = (maxTemp - minTemp) / 4;
  const customLabels = Array.from({ length: 5 }, (_, i) => (minTemp + i * interval).toFixed(1));

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
                labels: LoadPPGListTime,
                datasets: [{ data: LoadPPGList }]
              }}
              width={chartWidth} // Full width of the screen with some padding
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
          </View>

        </ScrollView>
        {
          showSecondLabel && (
            <View style={styles.overlay}>
              {customLabels.reverse().map((value, index) => (
                <Text key={index} style={styles.yAxisLabel}>{value} C°</Text>
              ))}
            </View>
          )
        }
      </View >
      {/* <View style={styles.heartRateContainer}>
        <View style={styles.heartRateContainer}>
          <Animated.View style={{ transform: [{ scale: heartSize }] }}>
            <Image source={require('../../assets/hearRate3D.png')} style={styles.heartIcon} />
          </Animated.View>
        </View>
      </View> */}
      < View style={styles.heartRateContainer} >
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
            labels: PPGListTime,
            datasets: [{ data: PPGList }]
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
      </View >
    </LinearGradient >
  );
}

export default HeartRate;

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
  heartRateContainer: {
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
