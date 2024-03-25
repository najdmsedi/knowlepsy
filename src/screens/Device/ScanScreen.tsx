import * as React from 'react';
import { View,StyleSheet, Text, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TouchableOpacity } from 'react-native-gesture-handler';
import DeviceModal from '../../components/DeviceConnectionModal';
import BluetoothServices from '../../services/BluetoothServices '

export default function ScanScreen({ navigation }) {
  React.useLayoutEffect(() => {
    navigation.setOptions({
        title: '',
    });    
}, [navigation]);

const { checkState,redirectToAnotherPage,initializeBluetooth, scan,connectToDevice,allDevices ,connectedDevice,disconnectFromDevice} = BluetoothServices();
const [isModalVisible, setIsModalVisible] = React.useState<boolean>(false);  
const [test, setTest] = React.useState(null);

  const scanForDevices = async () => {    
      const isPermissionsEnabled = await initializeBluetooth();
      if (isPermissionsEnabled) {
        scan();
      }
  };

  const hideModal = () => {    
    setIsModalVisible(false);
  };

  const disconnect = () => {    
    disconnectFromDevice();
    redirectToAnotherPage(navigation,"HomeScreen")
  };

  const openModal = async () => {
    const isPermissionsEnabled = await initializeBluetooth();
    if (isPermissionsEnabled) {
      await scanForDevices(); 
      setIsModalVisible(true);
    }
  };

 React.useEffect(() => {
  checkState().then((ch) => {
    setTest(ch)
  });
}, []); 

    return (
      <SafeAreaView style={styles.container}>
        <TouchableOpacity onPress={test ? disconnect : openModal} style={styles.ctaButton}>
          <Text style={styles.ctaButtonText}>
            {test ? "Disconnect" : "Scan"}
          </Text>
        </TouchableOpacity>
      <DeviceModal closeModal={hideModal} visible={isModalVisible} connectToPeripheral={connectToDevice} devices={allDevices} />
      <View style={styles.heartRateTitleWrapper}>
        {test ? (
          <>
            
            <Text style={styles.heartRateTitleText}>you are connected to ally!</Text>
          </>
        ) : (
          <Text style={styles.heartRateTitleText}>Click scan to search for devices 
          </Text>
        )}
      </View>
     
    </SafeAreaView>
    );

    
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#f2f2f2",
    },
    heartRateTitleWrapper: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    heartRateTitleText: {
      fontSize: 30,
      fontWeight: "bold",
      textAlign: "center",
      marginHorizontal: 20,
      color: "black",
    },
    heartRateText: {
      fontSize: 25,
      marginTop: 15,
    },
    ctaButton: {
      backgroundColor: "#5916C9",
      justifyContent: "center",
      alignItems: "center",
      height: 50,
      marginHorizontal: 20,
      marginBottom: 5,
      borderRadius: 8,
    },
    ctaButtonText: {
      fontSize: 18,
      fontWeight: "bold",
      color: "white",
    },
  });