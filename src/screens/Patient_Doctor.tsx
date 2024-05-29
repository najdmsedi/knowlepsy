import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert } from 'react-native';
import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { BASE_URL } from '../config';

const Patient_Doctor = () => {
  const { userInfo } = useContext(AuthContext);
  const [email, setEmail] = useState('');

  const inviteDoctor = async () => {
    try {
      console.log("userInfo.id", userInfo._id);
      console.log("email", email);

      const response = await axios.post(`${BASE_URL}/assign-doctor`, {
        patientId: userInfo._id,
        doctorEmail: email,
      });
      if (response.status === 200) {
        Alert.alert('Success', 'Doctor invited successfully');
      } else {
        Alert.alert('Error', 'Failed to invite doctor');
      }
    } catch (error) {
      Alert.alert('Error');
    }
  };
  return (
    <View style={styles.container}>
      {userInfo.role === "patient" &&
        <>
          <Text style={styles.title}>Invite Doctor </Text>
          <TextInput
            style={styles.input}
            placeholder="Enter doctor's email"
            placeholderTextColor="#aaa"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
          <TouchableOpacity style={styles.button} onPress={inviteDoctor}>
            <Text style={styles.buttonText}>Invite</Text>
          </TouchableOpacity>
        </>
      }
      {userInfo.role === "doctor" &&
        <Text style={styles.title}>You are not invited to a patient </Text>
      }
    </View>
  );
}

export default Patient_Doctor;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    color: '#4B0082',
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#4B0082',
    borderWidth: 1,
    borderRadius: 30,
    paddingLeft: 10,
    marginBottom: 20,
    color: '#000',
  },
  button: {
    backgroundColor: '#4A189B',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});
