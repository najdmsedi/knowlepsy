import { Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useContext, useState } from 'react'
import Toast from 'react-native-toast-message';
import axios from 'axios';
import { BASE_URL } from '../config';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Fontisto from 'react-native-vector-icons/Fontisto';
import { AuthContext } from '../context/AuthContext';

type SettingsScreenProps = {
  navigation: any;
};

function ChangePassword({ navigation }: SettingsScreenProps) {
  const [role, setRole] = useState('');
  const { userInfo } = useContext(AuthContext);
  const [password, setPassword] = useState('');
  const [passwordVerify, setPasswordVerify] = useState(false);
  const [showPassword, setShowPassword] = useState(true);

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
      password,
      role
    };
    console.log("userData", userData);
    // if (userData.firstName.length === 0 || userData.lastName.length === 0 || userData.email.length === 0 || userData.mobileNumber.length === 0 || userData.password.length === 0) {
    //   Toast.show({
    //     type: 'customErrorToast',
    //     text1: 'All fields are required !!'
    //   });
    // } else {
    //   try {
    //     const response = await axios.post(`${BASE_URL}/reghister`, userData, {
    //       headers: {
    //         'Content-Type': 'application/json',
    //       },
    //     });

    //     console.log("Response:", response.data);
    //     Toast.show({
    //       type: 'customSuccessToast',
    //       text1: 'Register Success'
    //     });
    //     navigation.navigate('LoginScreen');
    //   } catch (error) {
    //     console.log('Error adding data:', error);
    //     Toast.show({
    //       type: 'customErrorToast',
    //       text1: 'Failed to add data. Please try again later.'
    //     });
    //   }
    // }

  };

  return (
    <ScrollView contentContainerStyle={styles.scrollViewContent}>
      <View style={styles.container}>
        <Image source={require("../../assets/logo...png")} style={[{ width: 300, height: 150 }]} resizeMode="contain" />
        <View style={styles.inputContainer} >

          <View style={styles.action}>
            <FontAwesome name="lock" color="#5e2a89" style={styles.smallIcon} />
            <TextInput
              placeholder="Old Password"
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
              Password must contain uppercase, lowercase, number and be at least 6 characters long.
            </Text>
          )}

          <View style={styles.action}>
            <FontAwesome name="lock" color="#5e2a89" style={styles.smallIcon} />
            <TextInput
              placeholder="New Password"
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
              Password must contain uppercase, lowercase, number and be at least 6 characters long.
            </Text>
          )}

          <View style={styles.action}>
            <FontAwesome name="lock" color="#5e2a89" style={styles.smallIcon} />
            <TextInput
              placeholder="Confirm Password"
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
              Password must contain uppercase, lowercase, number and be at least 6 characters long.
            </Text>
          )}
        </View>
        <View>
          <TouchableOpacity style={styles.button} onPress={Register}>
            <Text style={styles.buttonText}>Update</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

export default ChangePassword

const styles = StyleSheet.create({
  scrollViewContent: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 130
  },
  button: {
    backgroundColor: '#4A189B',
    paddingVertical: 15,
    paddingHorizontal: 100,
    borderRadius: 10,
    marginTop: 30,
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
    marginBottom: -10,
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

    color: 'black',
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
    // paddingVertical: 10,
    borderRadius: 10,
    // flexDirection: 'row',
    // alignItems: 'center',
    padding: 10,
  },
});
