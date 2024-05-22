import { Dimensions, StyleSheet, Text, View, Animated, Easing } from 'react-native';
import React, { useEffect, useRef } from 'react';
import { LineChart } from 'react-native-chart-kit';
import LinearGradient from 'react-native-linear-gradient';
import { useRecoilState, useRecoilValue } from 'recoil';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { PPGListAtom, PPGListTimeAtom, PPGValueAtom } from '../atoms';

const HeartRate = () => {
  const PPGValue = useRecoilValue(PPGValueAtom) as any;
  const [PPGList, setPPGList] = useRecoilState(PPGListAtom);
  const [PPGListTime, setPPGListTime] = useRecoilState(PPGListTimeAtom);

  useEffect(() => {
    if(PPGValue?.heart_rate != undefined){
    const updatedEDAList = [...PPGList, PPGValue?.heart_rate];
    const updatedEDAListTime = [...PPGListTime, PPGValue?.time];

    console.log("updatedEDAListTime updatedEDAListTime= ", updatedEDAListTime);

    if (updatedEDAList.length > 10) {
      updatedEDAList.shift();
    }
    if (updatedEDAListTime.length > 10) {
      updatedEDAListTime.shift();
    }
    setPPGListTime(updatedEDAListTime)
    setPPGList(updatedEDAList);
    console.log("EDAList= ", updatedEDAList);
    }
  }, [PPGValue]);

  const heartSize1 = useRef(new Animated.Value(1)).current;
  const heartSize2 = useRef(new Animated.Value(1)).current;
  const heartSize3 = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const animateHeart = (heartSize: Animated.Value | Animated.ValueXY, delay: number) => {
      return Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
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

    animateHeart(heartSize1, 0);
    animateHeart(heartSize2, 500);
    animateHeart(heartSize3, 900);
  }, [heartSize1, heartSize2, heartSize3]);

  return (
    <LinearGradient colors={['#FEFEFE', '#A992FC']} style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={styles.header}>Heart Rate</Text>
      <LineChart
        data={{
          labels:  PPGListTime ,
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
      
      <View style={styles.heartRateContainer}>
        <Text style={styles.label}>Your smart watch is recording </Text>
        <View style={styles.heartIconContainer}>
          <Animated.View style={{ transform: [{ scale: heartSize1 }] }}>
            <Ionicons name={'heart'} size={100} color={'#D1837F'} />
          </Animated.View>
          <Text style={styles.heartRateValue}>{PPGValue?.heart_rate} </Text><Text style={{color:"#28032B"}}>BPM </Text>
        </View>
      </View>
    </LinearGradient>
  );
}

export default HeartRate;

const styles = StyleSheet.create({
  header: {
    color: '#402477',
    fontSize: 23,
    top:50,
    fontWeight: 'bold',
  },
  chart: {
    borderRadius: 16,
    paddingVertical: 190,
    bottom: 100,
  },
  heartRateContainer: {
    alignItems: 'center',
    bottom: 150,
  },
  label: {
    fontSize: 20,
    color: "black",
    bottom: 70,
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
});