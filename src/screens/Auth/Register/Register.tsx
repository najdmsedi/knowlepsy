import { Alert, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, Modal } from 'react-native';
import React, { useState } from 'react';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import Fontisto from 'react-native-vector-icons/Fontisto';
import Ionicons from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import { BASE_URL } from '../../../config';
import { ImageBackground } from 'react-native';
import Toast from 'react-native-toast-message';
import DatePicker from 'react-native-date-picker';

type SettingsScreenProps = {
  navigation: any;
};

function RegisterScreen({ navigation }: SettingsScreenProps) {
  const [showRoleSelection, setShowRoleSelection] = useState(true);
  const [role, setRole] = useState('');

  const [firstname, setFirstName] = useState('');
  const [firstNameVerify, setFirstNameVerify] = useState(false);

  const [lastname, setLastName] = useState('');
  const [lastNameVerify, setLastNameVerify] = useState(false);

  const [email, setEmail] = useState('');
  const [emailVerify, setEmailVerify] = useState(false);

  const [mobileNumber, setMobileNumber] = useState('');
  const [mobileNumberVerify, setMobileNumberVerify] = useState(false);

  const [password, setPassword] = useState('');
  const [passwordVerify, setPasswordVerify] = useState(false);
  const [showPassword, setShowPassword] = useState(true);

  const [birthday, setBirthday] = useState(new Date());
  const [open, setOpen] = useState(false);

  const [gender, setGender] = useState('');
  const [isGenderModalVisible, setGenderModalVisible] = useState(false);

  function handleFirstName(e: any) {
    const text = e.nativeEvent.text;
    setFirstName(text);
    setFirstNameVerify(false);
    if (text.length > 1) {
      setFirstNameVerify(true);
    }
  }

  function handleLastname(e: any) {
    const text = e.nativeEvent.text;
    setLastName(text);
    setLastNameVerify(false);
    if (text.length > 1) {
      setLastNameVerify(true);
    }
  }

  function handleEmail(e: any) {
    const text = e.nativeEvent.text;
    setEmail(text);
    setEmailVerify(false);
    if (/^[\w.%+-]+@[\w.-]+\.[a-zA-Z]{2,}$/.test(text)) {
      setEmailVerify(true);
    }
  }

  function handleMobileNumber(e: any) {
    const text = e.nativeEvent.text;
    setMobileNumber(text);
    setMobileNumberVerify(false);
    if (/^\d{8}$/.test(text)) { // Match exactly 8 digits
      setMobileNumberVerify(true);
    }
  }

  function handlePassword(e: any) {
    const text = e.nativeEvent.text;
    setPassword(text);
    setPasswordVerify(false);
    if (/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/.test(text)) {
      setPassword(text);
      setPasswordVerify(true);
    }
  }

  const handleBirthdayConfirm = (date: Date) => {
    setOpen(false);
    setBirthday(date);
  };

  const handleGender = (value: string) => {
    setGender(value);
    setGenderModalVisible(false);
  };

  const Register = async () => {
    const userData = {
      firstName: firstname,
      lastName: lastname,
      email,
      password,
      mobileNumber,
      birthdayDate: birthday.toISOString().split('T')[0],
      gender,
      role
    };
    console.log("userData", userData);
    if (userData.firstName.length === 0 || userData.lastName.length === 0 || userData.email.length === 0 || userData.mobileNumber.length === 0 || userData.password.length === 0 || userData.birthdayDate.length === 0 || userData.gender.length === 0) {
      Toast.show({
        type: 'customErrorToast',
        text1: 'All fields are required !!'
      });
      console.log("userData", userData);
    } else {
      try {
        const response = await axios.post(`${BASE_URL}/auth/register`, userData, {
          headers: {
            'Content-Type': 'application/json',
          },
        });

        console.log("Response:", response.data);
        Toast.show({
          type: 'customSuccessToast',
          text1: 'Register Success'
        });
        navigation.navigate('LoginScreen');
      } catch (error) {
        console.log('Error adding data:', error);
        Toast.show({
          type: 'customErrorToast',
          text1: 'Failed to add data. Please try again later.'
        });
      }
    }
  };

  const handleLogin = () => {
    navigation.navigate('LoginScreen');
  };

  const handleRoleSelection = (selectedRole: string) => {
    setRole(selectedRole);
    setShowRoleSelection(false);
  };

  const handleBackToRoleSelection = () => {
    setShowRoleSelection(true);
  };

  if (showRoleSelection) {
    return (
      <ImageBackground source={require("../../../../assets/HeroImageOne.png")} style={[styles.backgroundImage, { opacity: 0.8 }]}>
        <View style={styles.container}>
          <Text style={styles.title}>Select Your Role</Text>
          <TouchableOpacity style={styles.roleButton} onPress={() => handleRoleSelection('doctor')}>
            <Text style={styles.buttonText}>Caregiver</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.roleButton} onPress={() => handleRoleSelection('patient')}>
            <Text style={styles.buttonText}>  Patient  </Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    );
  }

  return (
    <ImageBackground source={require("../../../../assets/HeroImageOne.png")} style={[styles.backgroundImage, { opacity: 0.8 }]}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <TouchableOpacity style={styles.backButton} onPress={handleBackToRoleSelection}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <View style={styles.container}>
          <Image source={require("../../../../assets/logo.png")} style={[styles.logo, { width: 300, height: 300 }]} resizeMode="contain" />
          <View style={styles.inputContainer} >

            <View style={styles.action}>
              <FontAwesome
                name="user-o"
                color="#5e2a89"
                style={styles.smallIcon}
              />
              <TextInput
                placeholder="First Name"
                placeholderTextColor="#e0e0e0"
                style={styles.textInput}
                onChange={e => handleFirstName(e)}
              />
              {firstname.length < 1 ? null : firstNameVerify ? (
                <Feather name="check-circle" color="green" size={20} />
              ) : (
                <Ionicons name="alert-circle" color="red" size={20} />
              )}
            </View>
            {firstname.length < 1 ? null : firstNameVerify ? null : (
              <Text style={{ marginLeft: 20, color: 'red' }}>
                Name should be more than 1 character.
              </Text>
            )}

            <View style={styles.action}>
              <FontAwesome
                name="user-o"
                color="#5e2a89"
                style={styles.smallIcon}
              />
              <TextInput
                placeholder="Last Name"
                placeholderTextColor="#e0e0e0"
                style={styles.textInput}
                onChange={e => handleLastname(e)}
              />
              {lastname.length < 1 ? null : lastNameVerify ? (
                <Feather name="check-circle" color="green" size={20} />
              ) : (
                <Ionicons name="alert-circle" color="red" size={20} />
              )}
            </View>
            {lastname.length < 1 ? null : lastNameVerify ? null : (
              <Text style={{ marginLeft: 20, color: 'red' }}>
                Name should be more than 1 character.
              </Text>
            )}

            <View style={styles.action}>
              <Fontisto
                name="email"
                color="#5e2a89"
                size={24}
                style={{ marginLeft: 0, paddingRight: 5 }}
              />
              <TextInput
                placeholder="E-mail"
                placeholderTextColor="#e0e0e0"
                style={styles.textInput}
                onChange={e => handleEmail(e)}
              />
              {email.length < 1 ? null : emailVerify ? (
                <Feather name="check-circle" color="green" size={20} />
              ) : (
                <Ionicons name="alert-circle" color="red" size={20} />
              )}
            </View>
            {email.length < 1 ? null : emailVerify ? null : (
              <Text style={{ marginLeft: 20, color: 'red' }}>
                Enter a proper email address
              </Text>
            )}

            <View style={styles.action}>
              <FontAwesome
                name="mobile"
                color="#5e2a89"
                size={35}
                style={{ paddingRight: 10, marginTop: -7, marginLeft: 5 }}
              />
              <TextInput
                placeholder="Mobile Number"
                placeholderTextColor="#e0e0e0"
                style={styles.textInput}
                onChange={e => handleMobileNumber(e)}
                maxLength={8}
              />
              {mobileNumber.length < 1 ? null : mobileNumberVerify ? (
                <Feather name="check-circle" color="green" size={20} />
              ) : (
                <Ionicons name="alert-circle" color="red" size={20} />
              )}
            </View>
            {mobileNumber.length < 1 ? null : mobileNumberVerify ? null : (
              <Text style={{ marginLeft: 20, color: 'red' }}>
                Phone number should be exactly 8 digits.
              </Text>
            )}

            <View style={styles.action}>
              <FontAwesome name="lock" color="#5e2a89" style={styles.smallIcon} />
              <TextInput
                placeholder="Password"
                placeholderTextColor="#e0e0e0"
                style={styles.textInput}
                onChange={e => handlePassword(e)}
                secureTextEntry={showPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                {password.length < 1 ? null : showPassword ? (
                  <Feather name="eye-off" style={{ marginRight: -10 }} color={passwordVerify ? 'green' : 'red'} size={23} />
                ) : (
                  <Feather name="eye" style={{ marginRight: -10 }} color={passwordVerify ? 'green' : 'red'} size={23} />
                )}
              </TouchableOpacity>
            </View>
            {password.length < 1 ? null : passwordVerify ? null : (
              <Text style={{ marginLeft: 20, color: 'red' }}>
                Password must contain uppercase, lowercase, number and be at least 6 characters long.
              </Text>
            )}

            <View style={styles.action}>
              <FontAwesome name="calendar" color="#5e2a89" style={styles.smallIcon} />
              <TouchableOpacity onPress={() => setOpen(true)} style={styles.textInput}>
                <Text style={{ color: birthday ? 'white' : '#e0e0e0' }}>
                  {birthday ? birthday.toISOString().split('T')[0] : 'Select Birthday'}
                </Text>
              </TouchableOpacity>
            </View>
            <DatePicker
              modal
              open={open}
              date={birthday}
              mode="date"
              onConfirm={handleBirthdayConfirm}
              onCancel={() => setOpen(false)}
            />

            <View style={styles.action}>
              <FontAwesome name="transgender" color="#5e2a89" style={styles.smallIcon} />
              <TouchableOpacity onPress={() => setGenderModalVisible(true)} style={styles.textInput}>
                <Text style={{ color: gender ? 'white' : '#e0e0e0' }}>
                  {gender ? gender : 'Select Gender'}
                </Text>
              </TouchableOpacity>
            </View>

            <Modal visible={isGenderModalVisible} transparent={true}>
              <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                  <TouchableOpacity onPress={() => handleGender('Male')} style={styles.modalButton}>
                    <Text style={styles.modalButtonText}>Male</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleGender('Female')} style={styles.modalButton}>
                    <Text style={styles.modalButtonText}>Female</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleGender('Other')} style={styles.modalButton}>
                    <Text style={styles.modalButtonText}>Other</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setGenderModalVisible(false)} style={styles.modalCancelButton}>
                    <Text style={styles.modalCancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
          </View>
          <View>
            <TouchableOpacity style={styles.button} onPress={Register}>
              <Text style={styles.buttonText}>Register</Text>
            </TouchableOpacity>
            <View style={styles.registerContainer}>
              <Text style={styles.registerText}>Already have an account? </Text>
              <TouchableOpacity onPress={handleLogin}>
                <Text style={styles.registerLink}>Login </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </ImageBackground>
  );
}

export default RegisterScreen;

const styles = StyleSheet.create({
  scrollViewContent: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 100
  },
  button: {
    backgroundColor: '#4A189B',
    paddingVertical: 15,
    paddingHorizontal: 100,
    borderRadius: 10,
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  roleButton: {
    backgroundColor: '#4A189B',
    paddingVertical: 35,
    paddingHorizontal: 100,
    borderRadius: 10,
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
  mainContainer: {
    backgroundColor: 'white',
  },
  textSign: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  smallIcon: {
    marginRight: 10,
    fontSize: 24,
  },
  logoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    marginBottom: 10,
  },
  text_footer: {
    color: '#05375a',
    fontSize: 18,
  },
  action: {
    flexDirection: 'row',
    paddingTop: 14,
    paddingBottom: 3,
    marginTop: 15,

    paddingHorizontal: 15,

    borderWidth: 1,
    borderColor: '#ece1f2',
    borderRadius: 50,
  },
  textInput: {
    flex: 1,
    marginTop: -12,

    color: 'white',
  },
  inputContainer: {
    width: '80%',
  },
  header: {
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
  },
  text_header: {
    color: '#420475',
    fontWeight: 'bold',
    fontSize: 30,
  },

  inBut: {
    width: '70%',
    backgroundColor: '#420475',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderRadius: 50,
  },
  inBut2: {
    backgroundColor: '#420475',
    height: 65,
    width: 65,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomButton: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  smallIcon2: {
    fontSize: 40,
  },
  bottomText: {
    color: 'black',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 5,
  },
  radioButton_div: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  radioButton_inner_div: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioButton_title: {
    fontSize: 20,
    color: '#420475',
  },
  radioButton_text: {
    fontSize: 16,
    color: 'black',
  },
  registerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  registerText: {
    color: '#ece1f2',
    fontSize: 16,
    marginLeft: 15
  },
  registerLink: {
    color: '#4A189B',
    fontSize: 16,
    marginLeft: 10
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    width: '100%',
    height: '100%',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 20,
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 1,
    backgroundColor: '#8356FF',
    borderRadius: 10,
    padding: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: 300,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalButton: {
    padding: 10,
    marginVertical: 5,
    width: '100%',
    alignItems: 'center',
    backgroundColor: '#4A189B',
    borderRadius: 5,
  },
  modalButtonText: {
    color: 'white',
    fontSize: 16,
  },
  modalCancelButton: {
    padding: 10,
    marginTop: 10,
    width: '100%',
    alignItems: 'center',
    backgroundColor: 'red',
    borderRadius: 5,
  },
  modalCancelButtonText: {
    color: 'white',
    fontSize: 16,
  },
});
