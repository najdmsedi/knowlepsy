import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface RectangleProps {
  welcome: string;
  name: string;
  color?: string;
  marginTop: number;
}

const WelcomeComponent: React.FC<RectangleProps> = ({ name, welcome, color = '#ADD8E6' ,marginTop}) => {
  return (
    <View style={[styles.container, { backgroundColor: color } ,{top: marginTop}]}>
      <View style={styles.leftContent}>
        <Text style={styles.welcome}>{welcome}</Text>
        <Text style={styles.name}>{name}</Text>
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
    elevation: 1,

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
  welcome: {
    fontSize: 17,
    fontWeight: 'bold',
    marginBottom: 1,
    marginTop: 15,
    color:'#9C86F2'

  },
  name: {
    fontSize: 23,
    fontWeight: 'bold',
    marginBottom: 5,
    marginTop: 5,
    color:'#2A0D73'

  },
});

export default WelcomeComponent;
