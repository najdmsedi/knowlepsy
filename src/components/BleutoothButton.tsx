// import React, { useEffect, useState } from 'react';
// import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
// import Ionicons from 'react-native-vector-icons/Ionicons';
// import { useNavigation } from '@react-navigation/native';
// import BluetoothServices from '../services/BluetoothServices ';

// type ConstantBarProps = {
//   color?: Color
// };
// export enum Color {
//   RED = '#00FF00',
//   GREEN = '#FFCBC9'
// }

// const ConstantBar : React.FC<ConstantBarProps> = ({ color }) => {
//   const navigation = useNavigation();
//   const {connectedDevice,checkState} = BluetoothServices();
//   const [rectangleColor, setRectangleColor] = useState('#FFCBC9');
//   console.log("ConstantBar");
//   const [test, setTest] = React.useState(null);

//   const requestPermission = () => {
//     navigation.navigate('ScanScreen');
//   };

//   return (
//     <TouchableOpacity onPress={requestPermission}>
//       <View style={[styles.rectangle, { backgroundColor: rectangleColor  }]}>
//         <Ionicons
//           name={'bluetooth'}
//           size={24}
//           color={'#D1837F'}
//           style={styles.icon}
//         />
//         <Text style={styles.text}>Click to connect</Text>
//       </View>
//     </TouchableOpacity>
//   );
// };

// const styles = StyleSheet.create({
//   text: {
//     fontSize: 13,
//     fontWeight: 'bold',
//     color: '#494646'
//   },
//   rectangle: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     padding: 8,
//     borderRadius: 20,
//     marginRight: 120,
//   },
//   icon: {
//     marginRight: 10,
//   },
// });

// export default ConstantBar;
