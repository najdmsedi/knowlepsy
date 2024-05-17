// import React from 'react';
// import {SafeAreaView,Text,View,StyleSheet,Dimensions,ScrollView,} from 'react-native';
// import { LineChart } from 'react-native-chart-kit';

// const MyLineChart = () => {
//   return (
//     <>
//       <Text style={styles.header}>Line Chart</Text>
//       <LineChart
//         data={{
//           labels: ['January', 'February', 'March', 'April', 'May', 'June'],
//           datasets: [
//             {
//               data: [20, 45, 28, 80, 99, 43],
//               strokeWidth: 2,
//             },
//           ],
//         }}
//         width={Dimensions.get('window').width - 16}
//         height={220}
//         chartConfig={{
//           backgroundColor: '#1cc910',
//           backgroundGradientFrom: '#eff3ff',
//           backgroundGradientTo: '#efefef',
//           decimalPlaces: 2,
//           color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
//           style: {
//             borderRadius: 16,
//           },
//         }}
//         style={{
//           marginVertical: 8,
//           borderRadius: 16,
//         }}
//       />
//     </>
//   );
// };

// const App = () => {
//   return (
//     <SafeAreaView style={{flex: 1}}>
//       <ScrollView>
//         <View style={styles.container}>
//           <View>
//                   <MyLineChart />
//           </View>
//         </View>
//       </ScrollView>
//     </SafeAreaView>
//   );
// };

// export default App;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: 'white',
//     justifyContent: 'center',
//     alignItems: 'center',
//     textAlign: 'center',
//     padding: 10,
//   },
//   header: {
//     textAlign: 'center',
//     fontSize: 18,
//     padding: 16,
//     marginTop: 16,
//   },
// });

import { Dimensions, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { LineChart } from 'react-native-chart-kit'
import LinearGradient from 'react-native-linear-gradient'

const HeartRate = () => {
  return (
    <LinearGradient colors={['#FEFEFE', '#A992FC']} style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{color:'#402477', bottom: 120,fontSize:23}}>Heart Rate </Text>
        <LineChart
          data={{
            labels: ["January", "February", "March", "April", "May", "June"],
            datasets: [
              {
                data: [
                  Math.random() * 100,
                  Math.random() * 100,
                  Math.random() * 100,
                  Math.random() * 100,
                  Math.random() * 100,
                  Math.random() * 100
                ]
              }
            ]
          }}
          width={380} // from react-native
          height={500}
          yAxisLabel="$"
          yAxisSuffix="k"
          yAxisInterval={1} // optional, defaults to 1
          chartConfig={{
            backgroundColor: "#e26a00",
            backgroundGradientFrom: "#8356FF",
            backgroundGradientTo: "#C3B3FF",
            decimalPlaces: 2, // optional, defaults to 2dp
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            style: {
              borderRadius: 16
            },
            propsForDots: {
              r: "6",
              strokeWidth: "2",
              stroke: "#ffa726"
            }
          }}
          bezier
          style={{
            borderRadius: 16,
            bottom:100
          }}
        />
    </LinearGradient>
  )
}

export default HeartRate

const styles = StyleSheet.create({})