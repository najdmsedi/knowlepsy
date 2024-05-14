import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useRecoilValue } from 'recoil';
import { ConnectedAtom } from '../../../atoms';

interface RectangleProps {
  title: string;
  color?: string;
  marginTop: number;
  height?: number;
  BPM?: any;
}

const HeartrateComponent: React.FC<RectangleProps> = ({ title, color = '#F5F3FD', marginTop, height = 80, BPM = '--' }) => {
  const connected = useRecoilValue(ConnectedAtom);

  return (
    <LinearGradient colors={['#FEFEFE', '#E3DFF7']} style={[styles.container, { backgroundColor: color, top: marginTop, height: height }]}>
      <Text style={styles.title}>{title}</Text>
      {connected &&
        <Text style={styles.BPM}>{BPM} <Text style={styles.BPMText}>BPM</Text></Text>
      }

      {!connected &&
        <>
          <Text style={styles.BPM}>-- <Text style={styles.BPMText}>BPM</Text></Text>
          <Text style={{ color: '#E84A46' }}>offline </Text>
        </>
      }
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 200,
    right: 10,
    width: 'auto',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    elevation: 3,

  },

  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: -2,
    color: 'black'

  },
  BPM: {
    fontSize: 23,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#C45549'
  },
  BPMText: {
    fontSize: 15,

    color: 'black',
  },
});

export default HeartrateComponent;
