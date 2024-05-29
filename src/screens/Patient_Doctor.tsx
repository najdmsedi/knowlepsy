import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { BASE_URL } from '../config';
import CustomAlert from '../components/CustomAlert/CustomAlert';

const Patient_Doctor = () => {
  const { userInfo } = useContext(AuthContext);
  const { login } = useContext(AuthContext)
  const [email, setEmail] = useState('');
  const [isAlertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertTitle, setAlertTitle] = useState('');
  const [alertCallback, setAlertCallback] = useState<(inputValue: string) => void>(() => { });

  const showAlert = (title: string, message: string, callback: (inputValue: string) => void, isPassword = false) => {
    setAlertTitle(title);
    setAlertMessage(message);
    setAlertCallback(() => callback);
    setAlertVisible(true);
  };

  const hideAlert = () => {
    setAlertVisible(false);
  };
  const reLogin = async (password: string) => {
    try {
      console.log("ena hnaaayaa",password);
      
      await login(userInfo.email,password)
    } catch (error) {
      showAlert('Error', 'An error occurred while relogin', () => { });
    }
  };
  const handlePasswordCheck = async (password: string) => {
    try {
      const email = userInfo.email
      const response = await axios.post(`${BASE_URL}/login`, { email, password })
      if (response) {
        inviteDoctor(password);
      } else {
        showAlert('Error', 'Incorrect password', () => { });
      }
    } catch (error) {
      showAlert('Error', 'An error occurred while checking the password', () => { });
    }
  };

  const inviteDoctor = async (password: string) => {
    try {
      const response = await axios.post(`${BASE_URL}/assign-doctor`, {
        patientId: userInfo._id,
        doctorEmail: email,
      });
      if (response.status === 200) {
        showAlert('Success', 'Doctor invited successfully', () => { reLogin(password) }, false);
      } else {
        showAlert('Error', 'Failed to invite doctor', () => { }, false);
      }
    } catch (error) {
      showAlert('Error', 'An error occurred while inviting the doctor', () => { });
    }
  };

  const startInviteProcess = () => {
    showAlert('Authentication', 'Please enter your password to continue. ', handlePasswordCheck, true);
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
          <TouchableOpacity style={styles.button} onPress={startInviteProcess}>
            <Text style={styles.buttonText}>Invite</Text>
          </TouchableOpacity>
        </>
      }
      {userInfo.role === "doctor" &&
        <Text style={styles.title}>You are not invited to a patient </Text>
      }
      <CustomAlert
        isVisible={isAlertVisible}
        onClose={hideAlert}
        title={alertTitle}
        message={alertMessage}
        onConfirm={alertCallback}
        isPassword
      />
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
