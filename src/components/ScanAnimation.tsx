import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ScanAnimation = () => {
  const [dots, setDots] = useState('...');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => {
        switch (prev) {
          case '':
            return '.';
          case '.':
            return '..';
          case '..':
            return '...';
          default:
            return '';
        }
      });
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Scanning {dots}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color:"black",
    fontSize: 20,
  },
});

export default ScanAnimation;
