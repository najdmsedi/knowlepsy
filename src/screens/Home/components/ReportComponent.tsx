import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface RectangleProps {
  title: string;
  color?: string;
  marginTop: number;
  height?: number;
} 

const ReportComponent: React.FC<RectangleProps> = ({ title, color = 'lightblue', marginTop, height = 130 }) => {

  
  const handleButtonPress = () => {
    console.log('Button pressed');
  };

  return (
    <View style={[styles.container, { backgroundColor: color }, { top: marginTop }, { height: height }]}>
      <View style={styles.row}>
        <Ionicons name="information-circle-outline" size={25} color="#998F92" style={styles.icon} />
        <Text style={styles.title}>{title}</Text>
      </View>
      <TouchableOpacity onPress={handleButtonPress} style={styles.button}>
        <Text style={styles.buttonText}>Report a seizure</Text>
        <Ionicons name="alert-outline" size={20} color="white" style={styles.buttonIcon} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 10,
    right: 10,
    width: 'auto',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#6F4A52',
  },
  button: {
    backgroundColor: '#4A189B',
    paddingVertical: 15,
    paddingHorizontal: 100,
    borderRadius: 50,
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 5,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  icon: {
    marginRight: 6,
  },
  buttonIcon: {
    marginLeft: 5,
  },
});

export default ReportComponent;
