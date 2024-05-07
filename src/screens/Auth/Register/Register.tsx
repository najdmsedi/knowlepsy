import { Alert, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import Fontisto from 'react-native-vector-icons/Fontisto';
import Ionicons from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import { BASE_URL } from '../../../config';

type SettingsScreenProps = {
  navigation: any;
};

function RegisterScreen({navigation }: SettingsScreenProps) {
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

  function handleFirstName(e: any) {
    const text = e.nativeEvent.text;
    setFirstName(text)
    setFirstNameVerify(false);
    if (text.length > 1) {
      setFirstNameVerify(true);
    }
  }
  function handleLastname(e: any) {
    const text = e.nativeEvent.text;
    setLastName(text)
    setLastNameVerify(false);
    if (text.length > 1) {
      setLastNameVerify(true);
    }
  }
  function handleEmail(e: any) {
    const text = e.nativeEvent.text;
    setEmail(text)
    setEmailVerify(false);
    if (/^[\w.%+-]+@[\w.-]+\.[a-zA-Z]{2,}$/.test(text)) {
      setEmailVerify(true);
    }
  }
  function handleMobileNumber(e: any) {
    const text = e.nativeEvent.text;
    setMobileNumber(text)
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

  const Register = async () => {
    const userData = {
      firstName:firstname, 
      lastName:lastname,
      email,
      password,
      mobileNumber
    };
    console.log("userData",userData);
    try {
      const response = await axios.post(`${BASE_URL}/register`, userData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      console.log("Response:", response.data);
      navigation.navigate('LoginScreen');
    } catch (error) {
      console.log('Error adding data:', error);
      Alert.alert('Error', 'Failed to add data. Please try again later.');
    }
  };

  const handleLogin = () => {
    navigation.navigate('LoginScreen')
  }
  return (

    <View style={styles.container}>
      <Image style={styles.logo} source={require('../../../../assets/knowlepsy_logo.png')} />
      <View style={styles.inputContainer} >

        <View style={styles.action}>
          <FontAwesome
            name="user-o"
            color="#420475"
            style={styles.smallIcon}
          />
          <TextInput
            placeholder="First Name"
            placeholderTextColor="gray"
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
          <Text
            style={{
              marginLeft: 20,
              color: 'red',
            }}>
            Name sholud be more then 1 characters.
          </Text>
        )}

        <View style={styles.action}>
          <FontAwesome
            name="user-o"
            color="#420475"
            style={styles.smallIcon}
          />
          <TextInput
            placeholder="Last Name"
            placeholderTextColor="gray"
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
          <Text
            style={{
              marginLeft: 20,
              color: 'red',
            }}>
            Name sholud be more then 1 characters.
          </Text>
        )}

        <View style={styles.action}>
          <Fontisto
            name="email"
            color="#420475"
            size={24}
            style={{ marginLeft: 0, paddingRight: 5 }}
          />
          <TextInput
            placeholder="E-mail"
            placeholderTextColor="gray"
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
            <Text
            style={{
              marginLeft: 20,
              color: 'red',
            }}>
            Enter Proper Email Address
          </Text>
        )}

        <View style={styles.action}>
          <FontAwesome
            name="mobile"
            color="#420475"
            size={35}
            style={{ paddingRight: 10, marginTop: -7, marginLeft: 5 }}
          />
          <TextInput
            placeholder="Mobile Number"
            placeholderTextColor="gray"
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
          <Text
            style={{
              marginLeft: 20,
              color: 'red',
            }}>
            Phone number with 6-9 and remaing 9 digit with 0-9
          </Text>
        )}
        
        <View style={styles.action}>
          <FontAwesome name="lock" color="#420475" style={styles.smallIcon} />
          <TextInput
            placeholder="Password"
            placeholderTextColor="gray"
            style={styles.textInput}
            onChange={e => handlePassword(e)}
            secureTextEntry={showPassword}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            {password.length < 1 ? null : showPassword ? (
              <Feather
                name="eye-off"
                style={{ marginRight: -10 }}
                color={passwordVerify ? 'green' : 'red'}
                size={23}
              />
            ) : (
              <Feather
                name="eye"
                style={{ marginRight: -10 }}
                color={passwordVerify ? 'green' : 'red'}
                size={23}
              />
            )}
          </TouchableOpacity>
        </View>
        {password.length < 1 ? null : passwordVerify ? null : (
          <Text
            style={{
              marginLeft: 20,
              color: 'red',
            }}>
            Uppercase, Lowercase, Number and 6 or more characters.
          </Text>
        )}

      </View>
      <View >
        <TouchableOpacity style={styles.button} onPress={Register}>
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>
        <View style={styles.registerContainer}>
          <Text style={styles.registerText}>Already have account? </Text>
          <TouchableOpacity  onPress={handleLogin}>
            <Text style={styles.registerLink}>Login </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

export default RegisterScreen;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
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
    marginBottom: 50,
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
    borderColor: '#420475',
    borderRadius: 50,
  },
  textInput: {
    flex: 1,
    marginTop: -12,

    color: '#05375a',
  },
  inputContainer: {
    marginVertical: 10,
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
    // marginRight: 10,
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
    color: '#000',
    fontSize: 16,
    marginLeft:15
  },
  registerLink: {
    color: '#4A189B', 
    fontSize: 16,
    marginLeft:10
  },
});
