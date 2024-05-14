import * as React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TouchableOpacity } from 'react-native-gesture-handler';
import DeviceModal from './DeviceConnectionModal';
import BluetoothServices from '../services/BluetoothServices '
import { useRecoilValue } from 'recoil';
import { ConnectedAtom } from '../atoms';

type ScanScreenProps = {
  navigation: any;
};

export default function ScanScreen({ navigation }: ScanScreenProps) {
  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: '',
    });
  }, [navigation]);

  const { initializeBluetooth, scan, connectToDevice, allDevices, disconnectFromDevice } = BluetoothServices();
  const connected = useRecoilValue(ConnectedAtom);


  const [isModalVisible, setIsModalVisible] = React.useState<boolean>(false);

  const scanForDevices = async () => {
    const isPermissionsEnabled = await initializeBluetooth();
    if (isPermissionsEnabled) {
      scan();
    }
  };

 

  const disconnect = () => {
    disconnectFromDevice();
    navigation.navigate('Home');
  };

  const openModal = async () => {
    const isPermissionsEnabled = await initializeBluetooth();
    if (isPermissionsEnabled) {
      await scanForDevices();
      setIsModalVisible(true);
    }
  };
  
  const hideModal = () => {
    setIsModalVisible(false);
  };
  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity onPress={connected ? disconnect : openModal} style={styles.ctaButton}>
        <Text style={styles.ctaButtonText}>
          {connected ? "Disconnect" : "Scan"}
        </Text>
      </TouchableOpacity>
      <DeviceModal closeModal={hideModal} visible={isModalVisible} connectToPeripheral={connectToDevice} devices={allDevices} />
      <View style={styles.heartRateTitleWrapper}>
        {/* {connected ? (
          <>
            <Text style={styles.heartRateTitleText}>you are connected to ally!</Text>
          </>
        ) : (
          <Text style={styles.heartRateTitleText}>Click scan to search for devices
          </Text>
        )} */}
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
    marginTop: 320,
    borderRadius: 8,
  },
  ctaButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
});