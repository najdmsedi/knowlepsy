import { Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import React, { useContext, useState, useEffect } from 'react';
import Toast from 'react-native-toast-message';
import axios from 'axios';
import { BASE_URL } from '../config';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Fontisto from 'react-native-vector-icons/Fontisto';
import { AuthContext } from '../context/AuthContext';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/TabNavigator';
import { useNavigation } from '@react-navigation/native';
import DatePicker from 'react-native-date-picker';

type SettingsScreenProps = {
  navigation: any;
};
type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

function EditProfile({}: SettingsScreenProps) {
  const { userInfo, login, password } = useContext(AuthContext);

  const [firstname, setFirstName] = useState(userInfo.firstName);
  const [firstNameVerify, setFirstNameVerify] = useState(true);

  const [lastname, setLastName] = useState(userInfo.lastName);
  const [lastNameVerify, setLastNameVerify] = useState(true);

  const [email, setEmail] = useState(userInfo.email);
  const [emailVerify, setEmailVerify] = useState(true);

  const [mobileNumber, setMobileNumber] = useState(userInfo.mobileNumber);
  const [mobileNumberVerify, setMobileNumberVerify] = useState(true);

  const navigation = useNavigation<HomeScreenNavigationProp>();

  const [birthday, setBirthday] = useState(new Date(userInfo.birthdayDate));
  const [open, setOpen] = useState(false);


  const reLogin = async (password: string) => {
    try {
      console.log("userInfo.email",userInfo.email);
      
      await login(userInfo.email, password);
    } catch (error) {
      console.log('Error re-logging in:', error);
    }
  };

  useEffect(() => {
    setFirstName(userInfo.firstName);
    setLastName(userInfo.lastName);
    setEmail(userInfo.email);
    setMobileNumber(userInfo.mobileNumber);
  }, [userInfo]);

  function handleFirstName(e: any) {
    const text = e.nativeEvent.text;
    setFirstName(text);
    setFirstNameVerify(text.length > 1);
  }

  function handleLastname(e: any) {
    const text = e.nativeEvent.text;
    setLastName(text);
    setLastNameVerify(text.length > 1);
  }

  function handleEmail(e: any) {
    const text = e.nativeEvent.text;
    setEmail(text);
    setEmailVerify(/^[\w.%+-]+@[\w.-]+\.[a-zA-Z]{2,}$/.test(text));
  }

  function handleMobileNumber(e: any) {
    const text = e.nativeEvent.text;
    setMobileNumber(text);
    setMobileNumberVerify(/^\d{8}$/.test(text));
  }
  function handleBirthdayConfirm(date: Date) {
    setOpen(false);
    setBirthday(date);
  }
  const updateUser = async () => {
    const userData = {
      firstName: firstname,
      lastName: lastname,
      email,
      mobileNumber,
      birthdayDate: birthday
    };

    if (userData.firstName.length === 0 || userData.lastName.length === 0 || userData.email.length === 0 || userData.mobileNumber.length === 0) {
      Toast.show({
        type: 'customErrorToast',
        text1: 'All fields are required !!'
      });
    } else {
      try {
        const response = await axios.put(`${BASE_URL}/user/updateUser/${userInfo._id}`, userData, {
          headers: {
            'Content-Type': 'application/json',
          },
        });

        console.log("Response:", response.data);
        Toast.show({
          type: 'customSuccessToast',
          text1: 'Profile Updated Successfully'
        });
        console.log("password",password);
        
        reLogin(password);
        navigation.navigate('Home');
      } catch (error) {
        console.log('Error updating data:', error);
        Toast.show({
          type: 'customErrorToast',
          text1: 'Failed to update data. Please try again later.'
        });
      }
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollViewContent}>
      <View style={styles.container}>
        <Image source={require("../../assets/logo...png")} style={[{ width: 300, height: 150 }]} resizeMode="contain" />
        <View style={styles.inputContainer}>
          <View style={styles.action}>
            <FontAwesome name="user-o" color="#5e2a89" style={styles.smallIcon} />
            <TextInput
              placeholder="First Name"
              placeholderTextColor="gray"
              style={styles.textInput}
              value={firstname}
              onChange={handleFirstName}
            />
            {firstNameVerify ? (
              <Feather name="check-circle" color="green" size={20} />
            ) : (
              <Ionicons name="alert-circle" color="red" size={20} />
            )}
          </View>
          {!firstNameVerify && (
            <Text style={{ marginLeft: 20, color: 'red' }}>
              Name should be more than 1 character.
            </Text>
          )}

          <View style={styles.action}>
            <FontAwesome name="user-o" color="#5e2a89" style={styles.smallIcon} />
            <TextInput
              placeholder="Last Name"
              placeholderTextColor="gray"
              style={styles.textInput}
              value={lastname}
              onChange={handleLastname}
            />
            {lastNameVerify ? (
              <Feather name="check-circle" color="green" size={20} />
            ) : (
              <Ionicons name="alert-circle" color="red" size={20} />
            )}
          </View>
          {!lastNameVerify && (
            <Text style={{ marginLeft: 20, color: 'red' }}>
              Name should be more than 1 character.
            </Text>
          )}

          <View style={styles.action}>
            <Fontisto name="email" color="#5e2a89" size={24} style={{ marginLeft: 0, paddingRight: 5 }} />
            <TextInput
              placeholder="E-mail"
              placeholderTextColor="gray"
              style={styles.textInput}
              value={email}
              onChange={handleEmail}
            />
            {emailVerify ? (
              <Feather name="check-circle" color="green" size={20} />
            ) : (
              <Ionicons name="alert-circle" color="red" size={20} />
            )}
          </View>
          {!emailVerify && (
            <Text style={{ marginLeft: 20, color: 'red' }}>
              Enter a proper email address
            </Text>
          )}

          <View style={styles.action}>
            <FontAwesome name="mobile" color="#5e2a89" size={35} style={{ paddingRight: 10, marginTop: -7, marginLeft: 5 }} />
            <TextInput
              placeholder="Mobile Number"
              placeholderTextColor="gray"
              style={styles.textInput}
              value={mobileNumber}
              onChange={handleMobileNumber}
              maxLength={8}
            />
            {mobileNumberVerify ? (
              <Feather name="check-circle" color="green" size={20} />
            ) : (
              <Ionicons name="alert-circle" color="red" size={20} />
            )}
          </View>
          {!mobileNumberVerify && (
            <Text style={{ marginLeft: 20, color: 'red' }}>
              Phone number should be exactly 8 digits.
            </Text>
          )}
            <View style={styles.action}>
            <FontAwesome name="calendar" color="#5e2a89" style={styles.smallIcon} />
            <TouchableOpacity onPress={() => setOpen(true)} style={styles.textInput}>
              <Text style={{ color: birthday ? 'black' : '#e0e0e0' }}>
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
        </View>
        <View>
          <TouchableOpacity style={styles.button} onPress={updateUser}>
            <Text style={styles.buttonText}>Update</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

export default EditProfile;

const styles = StyleSheet.create({
  scrollViewContent: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 130,
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
    marginLeft: 15,
  },
  registerLink: {
    color: '#4A189B',
    fontSize: 16,
    marginLeft: 10,
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
});
