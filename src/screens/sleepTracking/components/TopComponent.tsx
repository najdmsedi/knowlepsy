import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface RectangleProps {
  Time: string;
  info: string;
  color?: string;
  marginTop: number;
}

const TopComponent: React.FC<RectangleProps> = ({ info, Time, color = '#a1bef7' ,marginTop}) => {
  return (
    <View style={[styles.container, { backgroundColor: color } ,{top: marginTop}]}>
      <View style={styles.leftContent}>
        <Text style={styles.Time}>{Time}</Text>
        <Text style={styles.info}>{info}</Text>
      </View>
      <View style={styles.RightContent}>
      <Ionicons name={'moon-outline'} color={'#a08eab'} size={84}  />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute', 
    left: 10, 
    right: 10, 
    width: 'auto', 
    height: 130,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20, 
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  leftContent: {
    position: 'absolute',
    left: 10,
    top: 10,
  },
  RightContent: {
    position: 'absolute',
    left:280,
    top: 20,
  },
  Time: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 1,
    marginTop: 15,
    color:'#2A0D73'

  },
  info: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 5,
    marginTop: 5,
    color:'#2A0D73'

  },
});

export default TopComponent;
