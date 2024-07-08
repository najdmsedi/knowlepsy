import React, { useContext } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRecoilValue } from 'recoil';
import { PatientAtom } from '../../../atoms';
import { AuthContext } from '../../../context/AuthContext';

interface RectangleProps {
  welcome: string;
  name: string;
  color?: string;
  marginTop: number;
}

const WelcomeComponent: React.FC<RectangleProps> = ({ name, welcome, color = '#ADD8E6', marginTop }) => {
  const Patient = useRecoilValue<any>(PatientAtom);
  const { userInfo } = useContext(AuthContext);

  // console.log("Patient Patient",Patient);
  
  return (
    <View style={[styles.container, { backgroundColor: color }, { top: marginTop }]}>
      <View style={styles.leftContent}>
        <Text style={styles.welcome}>{welcome}</Text>
        <Text style={styles.name}>{name}</Text>
        {userInfo.role === "caireGiver" && Patient===null &&
          <Text style={styles.Patient}>Patient: {Patient.firstName} {Patient.lastName}</Text>
        }

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
    color: '#9C86F2'

  },
  name: {
    fontSize: 23,
    fontWeight: 'bold',
    marginBottom: 5,
    marginTop: 5,
    color: '#2A0D73'

  },
  Patient: {
    fontSize: 13,
    fontWeight: 'bold',
    marginBottom: 5,
    marginTop: 5,
    color: '#2A0D73'

  },
});

export default WelcomeComponent;
