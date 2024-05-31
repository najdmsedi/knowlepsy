import { Dimensions, StyleSheet, Text, View, Animated, Easing } from 'react-native';
import React, { useEffect, useRef } from 'react';
import { LineChart } from 'react-native-chart-kit';
import LinearGradient from 'react-native-linear-gradient';
import { useRecoilState, useRecoilValue } from 'recoil';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { PPGListAtom, PPGListTimeAtom, PPGValueAtom } from '../atoms';
import { Image } from 'react-native-elements';

const HeartRate = () => {
  const PPGValue = useRecoilValue(PPGValueAtom) as any;
  const [PPGList, setPPGList] = useRecoilState(PPGListAtom);
  const [PPGListTime, setPPGListTime] = useRecoilState(PPGListTimeAtom);

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
  return (
    <LinearGradient colors={['#FEFEFE', '#A992FC']} style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      {/* <Text style={styles.header}>Heart Rate</Text> */}
      <Text style={styles.heartRateValue}>{PPGValue?.heart_rate} </Text><Text style={{ color: "#28032B", top: 50, left: 50 }}>BPM </Text>

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
      <View style={styles.heartRateContainer}>
        <View style={styles.heartRateContainer}>
          <Animated.View style={{ transform: [{ scale: heartSize }] }}>
            <Image source={require('../../assets/hearRate3D.png')} style={styles.heartIcon} />
          </Animated.View>
        </View>
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
    top: 50,
    fontWeight: 'bold',
  },
  chart: {
    borderRadius: 16,
    paddingVertical: 190,
    bottom: 100,
  },
  heartRateContainer: {
    alignItems: 'center',
    bottom: 50,
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
    textAlign: 'center',
    fontSize: 40,
    color: "black",
    marginLeft: 0,
    top: 70,
  },
});