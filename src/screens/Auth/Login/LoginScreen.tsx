import { Alert, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Input } from 'react-native-elements';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface LoginProps {
  onLogin: () => void;
  navigation: any;
}

export default function LoginScreen({ onLogin, navigation }: LoginProps) {

  const [email, setEmail] = useState('');
  const [emailVerify, setEmailVerify] = useState(false);

  const [password, setPassword] = useState('');
  const [passwordVerify, setPasswordVerify] = useState(false);
  const [showPassword, setShowPassword] = useState(true);
  
  function onvalidateEmail(e: any) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    const text = e.nativeEvent.text;
    setEmail(text)
    setEmailVerify(false);
    if (regex.test(text)) {
      setEmailVerify(true);
    }
  }

  function onvalidatePassword(e: any) {
    const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
    const text = e.nativeEvent.text;
    setPassword(text);
    setPasswordVerify(false);
    if (regex.test(text)) {
      setPassword(text);
      setPasswordVerify(true);
    }
  }

  const handleLogin = async () => {
    try {
      await fetch('http://192.168.1.14:3000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      }).then(async response=>{
        
        if (!response.ok) {
          throw new Error('Failed to login');
        }

        const responseData = await response.json();
        const { data: token } = responseData;
        console.log("Token:", token);

        AsyncStorage.setItem('token', token);
        AsyncStorage.setItem('isLoggedIn', JSON.stringify(true));
        navigation.navigate('HomeScreen');

      });
      // navigation.navigate(userType === 'admin' ? 'AdminDashboard' : 'UserDashboard');
    } catch (error) {
      console.error('Error logging in:', error);
      Alert.alert('Error', 'Failed to login. Please try again later.');
    }
    
  };
  async function getData() {
    const data = await AsyncStorage.getItem('isLoggedIn');
    
    if(data==="true"){
      console.log("aaaa");
      onLogin()

    }
  }
  useEffect(()=>{
    getData();
    console.log("Hii");
  },[])
  const handleRegister = async () => {
    console.log(await AsyncStorage.getItem('isLoggedIn'));
    console.log(await AsyncStorage.getItem('token'));

    navigation.navigate('RegisterScreen');
  };
  return (
    <View style={styles.container}>
      <Image source={require("../../../../assets/knowlepsy_logo.png")} style={styles.logo}></Image>

      <View style={styles.inputContainer}>
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
            onChange={e => onvalidateEmail(e)}
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
            Name sholud be more then 1 characters.
          </Text>
        )}

        <View style={styles.action}>
          <FontAwesome name="lock" color="#420475" style={styles.smallIcon} />
          <TextInput
            placeholder="Password"
            placeholderTextColor="gray"
            style={styles.textInput}
            onChange={e => onvalidatePassword(e)}
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

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      <View style={styles.registerContainer}>
        <Text style={styles.registerText}>Not a member? </Text>
        <TouchableOpacity onPress={handleRegister}>
          <Text style={styles.registerLink}>Register </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};



const styles = StyleSheet.create({
  textInput: {
    flex: 1,
    marginTop: -12,

    color: '#05375a',
  },
  smallIcon: {
    marginRight: 10,
    fontSize: 24,
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
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  inputContainer: {
    marginVertical: 10,
    width: '80%',
  },
  logo: {
    marginBottom: 150
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
  registerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  registerText: {
    color: '#000',
    fontSize: 16,
  },
  registerLink: {
    color: '#4A189B',
    fontSize: 16,
  },
});