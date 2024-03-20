import * as React from 'react';
import { View,StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PulseIndicator } from '../../../PulseIndicator';
import { TouchableOpacity } from 'react-native-gesture-handler';
import DeviceModal from '../../../DeviceConnectionModal';
import useBLE from '../../../useBLE';

export default function ScanScreen({ navigation }) {
  React.useLayoutEffect(() => {
    navigation.setOptions({
        title: '',
    });
}, [navigation]);

  const {requestPermissions,scanForPeripherals,allDevices,connectToDevice,connectedDevice,heartRate,disconnectFromDevice,} = useBLE();
  const [isModalVisible, setIsModalVisible] = React.useState<boolean>(false);

  const scanForDevices = async () => {
    console.log('188');
    
    const isPermissionsEnabled = await requestPermissions();
    if (isPermissionsEnabled) {
      console.log('12');

      scanForPeripherals();
    }
  };

  const hideModal = () => {
    console.log('13');

    setIsModalVisible(false);
  };

  const openModal = async () => {
    console.log('15');

    scanForDevices();
    setIsModalVisible(true);
  };

    return (
      <SafeAreaView style={styles.container}>
         <TouchableOpacity
        onPress={connectedDevice ? disconnectFromDevice : openModal}
        style={styles.ctaButton}
      >
        <Text style={styles.ctaButtonText}>
          {connectedDevice ? "Disconnect" : "Scan"}
        </Text>
      </TouchableOpacity>
      <DeviceModal
        closeModal={hideModal}
        visible={isModalVisible}
        connectToPeripheral={connectToDevice}
        devices={allDevices}
      />
      <View style={styles.heartRateTitleWrapper}>
        {connectedDevice ? (
          <>
            <PulseIndicator />
            <Text style={styles.heartRateTitleText}>Your Heart Rate Is:</Text>
            <Text style={styles.heartRateText}>{heartRate} bpm</Text>
          </>
        ) : (
          <Text style={styles.heartRateTitleText}>
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