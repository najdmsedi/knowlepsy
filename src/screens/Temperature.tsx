import { Dimensions, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import LinearGradient from 'react-native-linear-gradient'
import { LineChart } from 'react-native-chart-kit'
import { useRecoilState, useRecoilValue } from 'recoil'
import { TempListAtom, TempListTimeAtom, TempValueAtom } from '../atoms'
import Ionicons from 'react-native-vector-icons/Ionicons'

const Temperature = () => {
  const TEMPValue = useRecoilValue(TempValueAtom) as any;
  const [TEMPList, setTEMPList] = useRecoilState(TempListAtom);
  const [TempListTime, setTempListTime] = useRecoilState(TempListTimeAtom);
  const [showThermometerOutline, setShowThermometerOutline] = useState(true);
  console.log("eeeeeeeeeeeee",TEMPValue.wrist);
  
  useEffect(() => {
    if(TEMPValue?.wrist != undefined){

    console.log("extraData TEMP EDAList from= ", TEMPValue);
    const updatedTEMPList = [...TEMPList, TEMPValue.wrist];
    const updatedEDAListTime = [...TempListTime, TEMPValue?.time];
    console.log("updatedTEMPList= ", updatedTEMPList);
    console.log("updatedEDAListTime= ", updatedEDAListTime);

    if (updatedEDAListTime.length > 10) {
      updatedEDAListTime.shift();
    }
    if (updatedTEMPList.length > 10) {
      updatedTEMPList.shift();
    }

    setTempListTime(updatedEDAListTime)
    setTEMPList(updatedTEMPList);
  }
  }, [TEMPValue]);

  useEffect(() => {
    const interval = setInterval(() => {
      setShowThermometerOutline(prevState => !prevState);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <LinearGradient colors={['#FEFEFE', '#A992FC']} style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={styles.header}>Temperature</Text>
      <LineChart
        data={{
          labels: TempListTime,
          datasets: [{ data: TEMPList }]
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
      
      <View style={styles.temperatureContainer}>
        <Text style={styles.label}>Your smart watch is recording </Text>
        <View style={styles.temperatureIconContainer}>
          {showThermometerOutline ? (
            <Ionicons name={'thermometer-outline'} size={100} color={'#D1837F'} />
          ) : (
            <Ionicons name={'thermometer'} size={100} color={'#D1837F'} />
          )}
          <Text style={{color:"#28032B", marginLeft: 80}}><Text style={styles.temperatureValue}>{TEMPValue.wrist} </Text> C° </Text>
        </View>
      </View>
    </LinearGradient>
  )
}

export default Temperature

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
    bottom: 130,
  },
  temperatureContainer: {
    alignItems: 'center',
    bottom: 200,
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
