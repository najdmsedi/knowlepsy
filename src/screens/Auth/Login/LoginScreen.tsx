import { Alert, Image, ImageBackground, StyleSheet, Text, TextInput, TouchableOpacity, View, ScrollView } from 'react-native'
import React, { useEffect, useState, useContext } from 'react'
import { Input } from 'react-native-elements';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../../../context/AuthContext';
import Toast from 'react-native-toast-message';

export default function LoginScreen() {
  const { login } = useContext(AuthContext)

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
  const navigation = useNavigation();

  const handleRegister = async () => {
    navigation.navigate('RegisterScreen');
  };

  const handleLogin = async () => {

    if (email.length === 0 || password.length === 0) {
      Toast.show({
        type: 'customErrorToast',
        text1: 'Please fill the fields!',
      });
    } else {
      try {
        const loginSuccess = await login(email, password);
        console.log("loginSuccess",loginSuccess);
        
        if (loginSuccess) {
          Toast.show({
            type: 'customSuccessToast',
            text1: 'Login Success',
          });
        } else {
          Toast.show({
            type: 'customErrorToast',
            text1: 'E-mail or password are wrong!',
          });
        }
      } catch (error) {
        Toast.show({
          type: 'customErrorToast',
          text1: 'An error occurred during login!',
        });
      }
    }
  };

  return (
    <ImageBackground source={require("../../../../assets/HeroImageOne.png")} style={[styles.backgroundImage, { opacity: 0.8 }]}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.container}>
          <Image source={require("../../../../assets/logo.png")} style={[styles.logo, { width: 300, height: 300 }]} resizeMode="contain" />

          <View style={styles.inputContainer}>
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
                Name should be more than 1 character.
              </Text>
            )}

            <View style={styles.action}>
              <FontAwesome name="lock" color="#5e2a89" style={styles.smallIcon} />
              <TextInput
                placeholder="Password"
                placeholderTextColor="#e0e0e0"
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

          <TouchableOpacity style={styles.button} onPress={() => { handleLogin() }}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
          <View style={styles.registerContainer}>
            <Text style={styles.registerText}>Not a member?  </Text>
            <TouchableOpacity onPress={handleRegister}>
              <Text style={styles.registerLink}>Register </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.registerContainer}>
            <TouchableOpacity onPress={handleRegister}>
            <Text style={styles.passText}>Forget password?  </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  scrollViewContent: {
    flexGrow: 1,
  },
  textInput: {
    flex: 1,
    marginTop: -12,

    color: 'white',
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
    borderColor: '#ece1f2',
    borderRadius: 50,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputContainer: {
    marginTop: 250,

    marginVertical: 10,
    width: '80%',
  },
  logo: {
    marginTop: -100,
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
    color: 'white',
    fontSize: 16,
  },
  passText: {
    color: 'white',
    fontSize: 12,
  },
  registerLink: {
    color: '#4A189B',
    fontSize: 16,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    width: '100%',
    height: '100%',
  },
});
