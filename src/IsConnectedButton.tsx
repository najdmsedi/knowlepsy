import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import requestBluetoothPermission from './controllers/controller';

const ConstantBar = () => {
  const navigation = useNavigation();

  const requestPermission = () => {
    navigation.navigate('ScanScreen');
  };

  return (
    <TouchableOpacity onPress={requestPermission}>
      <View style={[styles.rectangle, { backgroundColor: '#FFCBC9' }]}>
        <Ionicons
          name={'bluetooth'}
          size={24}
          color={'#D1837F'}
          style={styles.icon}
        />
        <Text style={styles.text}>Click to connect</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#494646'
  },
  rectangle: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 20,
    marginRight: 120,
  },
  icon: {
    marginRight: 10,
  },
});

export default ConstantBar;
