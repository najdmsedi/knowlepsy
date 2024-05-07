import  React, { useContext }from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import BluetoothServices from '../../services/BluetoothServices ';
import { useFocusEffect } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { AuthContext } from '../../context/AuthContext';

type SettingsScreenProps = {
  navigation: any;
};

export default function SettingsScreen({ navigation }: SettingsScreenProps) {
  const {logout} = useContext(AuthContext)

  const { checkState } = BluetoothServices();
  const [rectangleColor, setRectangleColor] = React.useState('#FFCBC9');
  const [BleColor, setBleColor] = React.useState('#D1837F');  
  const requestPermission = () => {
    navigation.navigate('ScanScreen');
  };
  const [text, setText] = React.useState('Click to connect');

  useFocusEffect(
    React.useCallback(() => {
      checkState().then((ch) => {
        if (ch == true) {
          setRectangleColor('#71db65');
          setBleColor('#5c8c57');
          setText('    Connected     ')
        } else if (ch == false) {
          setRectangleColor('#FFCBC9');
          setBleColor('#D1837F');
          setText('Click to connect')
        }
      });

      navigation.setOptions({
        title: '',
        headerRight: () => 
          <TouchableOpacity onPress={requestPermission}>
            <View style={[styles.rectangle, { backgroundColor: rectangleColor }]}>
              <Ionicons
                name={'bluetooth'}
                size={24}
                color={BleColor}
                style={styles.icon}
              />
              <Text style={styles.textB}>{text}</Text>
            </View>
          </TouchableOpacity>
      });
    }, [checkState])
  );

  return (
    <View style={styles.container}>
      <View style={styles.profileCircle}>
        <Text style={styles.initials}>NM</Text>
        <TouchableOpacity>
          <Ionicons style={styles.editIcon} name="pencil" size={30} color="white" />
        </TouchableOpacity>
      </View>
      <Text style={styles.userName}>Najd Mseddi</Text>
      <Text style={styles.UseraccountbuttonText}>User account </Text>
      <TouchableOpacity style={{ ...styles.Editbutton, marginTop: 0, paddingHorizontal: 34 }}>
        <Text style={styles.EditbuttonText}>Edit Profile </Text>
      </TouchableOpacity>
      <Text style={styles.ApplicationSettingsbuttonText}>Application Settings </Text>
      <TouchableOpacity style={{ ...styles.Editbutton, marginTop: -370, paddingHorizontal: 20 }}>
        <Text style={{ ...styles.EditbuttonText, fontSize: 14 }}>   Information   </Text>
      </TouchableOpacity>
      <TouchableOpacity style={{ ...styles.Editbutton, marginTop: 5, paddingHorizontal: 6 }}>
        <Text style={{ ...styles.EditbuttonText, fontSize: 14 }}>    Change Password</Text>
      </TouchableOpacity>
      <TouchableOpacity style={{ ...styles.Editbutton, marginTop: 5, paddingHorizontal: 20 }}>
        <Text style={{ ...styles.EditbuttonText, fontSize: 14 }}>Emergency Call</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={logout} style={{ ...styles.Editbutton, marginTop: 5, paddingHorizontal: 20, backgroundColor: '#e8bc56' }}>
        <Ionicons name="log-out-outline" size={20} style={{ marginLeft: 30 }} color="#7a0909" />
        <Text style={{ ...styles.EditbuttonText, fontSize: 14 }}> Logout </Text>
      </TouchableOpacity>
    </View>
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
    backgroundColor: 'purple',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    marginBottom: -80,
    marginRight: 270

  },
  initials: {
    color: 'white',
    fontSize: 24,
  },
  editIcon: {
    position: 'absolute',
    bottom: -25,
    right: -45,
  },

  userName: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#494646',
    marginBottom: 60,
    marginLeft: 60

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

  // EditbuttonIcon: {
  //   color: 'black',
  //   marginLeft: 100,
  // },




});
