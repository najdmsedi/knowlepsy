import React, { useContext, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { AuthContext } from '../../context/AuthContext';
import ConstantBar from '../../components/BleutoothButton';
import BluetoothServices from '../../services/BluetoothServices '
import GenericButton from '../../components/button/GenericButton';
import LinearGradient from 'react-native-linear-gradient';
import LargeButton from '../../components/button/LargeButton';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/TabNavigator';
import { useNavigation } from '@react-navigation/native';


type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

export default function SettingsScreen() {
  const { logout } = useContext(AuthContext)
  const { userInfo } = useContext(AuthContext)
  const { disconnectFromDevice } = BluetoothServices();

  const navigation = useNavigation<HomeScreenNavigationProp>();


  const log = () => {
    disconnectFromDevice()
    logout()
  }
  useEffect(() => {
    if (userInfo.role === 'patient') {
      navigation.setOptions({
        title: '',
        headerRight: () => <ConstantBar marginRight={104} />,
      });
    } else if (userInfo.role === 'doctor') {
      navigation.setOptions({
        headerShown: false, // This will completely remove the header
      });
    }
  }, [userInfo.role, navigation]);
  const handleButtonPress = () => { }
  const handleEditProfile = () => { navigation.navigate('EditProfile') }
  const handleChangePassword = () => { navigation.navigate('ChangePassword') }

  return (
    <LinearGradient colors={['#FEFEFE', '#EDEBF7']} style={styles.container}>
      <View style={styles.profileCircle}>
        <Text style={styles.initials}>{userInfo.firstName.charAt(0)}{userInfo.lastName.charAt(0)} </Text>
        <TouchableOpacity>
          <View style={[styles.cercleIcon, { borderRadius: 25 }]}>
            <Ionicons style={styles.editIcon} name="pencil" size={20} color="white" />
          </View>
        </TouchableOpacity>
      </View>
      <View style={{ left: 30 }}>
        <Text style={styles.userName}>{userInfo.firstName + " " + userInfo.lastName}</Text>
        <Text style={styles.userEmail}>{userInfo.email}</Text>
      </View>

      <Text style={styles.UseraccountbuttonText}>User account </Text>
      <GenericButton buttonText='Edit Profile' onPress={handleEditProfile} icon='caret-forward-outline' top={-10} />

      <Text style={styles.ApplicationSettingsbuttonText}>Application Settings </Text>
      <GenericButton buttonText='Information' onPress={handleButtonPress} icon='caret-forward-outline' top={-370} />
      <GenericButton buttonText='Change Password' onPress={handleChangePassword} icon='caret-forward-outline' top={-355} />
      <GenericButton buttonText='Emergency Call' onPress={handleButtonPress} icon='caret-forward-outline' top={-340} />

      <LargeButton buttonText='Logout' onPress={log} icon='log-out-outline' top={-325} />
      <Image source={require("../../../assets/logo...png")} style={[{ width: 300, height: 300, bottom: 350 }]} resizeMode="contain" />


    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 50,
  },
  profileCircle: {
    width: 100,
    height: 100,
    borderRadius: 70,
    backgroundColor: '#9682C7',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    marginBottom: -80,
    marginRight: 270
  },
  initials: {
    color: 'white',
    fontSize: 28,
    bottom: -15,
    right: -3,
  },
  editIcon: {
    position: 'absolute',
  },
  userName: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#494646',
    marginBottom: 60,
    marginLeft: -10
  },
  userEmail: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#494646',
    marginLeft: -5,
    top: -55
  },
  UseraccountbuttonText: {
    color: '#7944cf',
    fontSize: 23,
    marginRight: 230,
    marginBottom: 20,
  },
  ApplicationSettingsbuttonText: {
    color: '#7944cf',
    fontSize: 23,
    marginRight: 150,
    marginBottom: 390,
  },
  Editbutton: {
    backgroundColor: '#d4ceeb',
    paddingVertical: 15,
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
  },
  EditbuttonText: {
    color: 'black',
    fontWeight: 'bold',
    marginRight: 240,
  },
  cercleIcon: {
    width: 35,
    height: 35,
    backgroundColor: '#5717BC',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 50,
    bottom: -15,
    right: -50,
  },
  textB: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#494646'
  },
  rectangle: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 20,
    marginRight: 120,
  },
  icon: {
    marginRight: 10,
  },
});
