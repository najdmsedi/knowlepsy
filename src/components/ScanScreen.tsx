import * as React from 'react';
import { View, StyleSheet, Text, FlatList, ListRenderItemInfo, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { ConnectedAtom, DeviceCharacteristiqueAtom } from '../atoms';
import { useNavigation } from "@react-navigation/native";
import BluetoothServices from '../services/BluetoothServices ';
import ScanAnimation from './ScanAnimation';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';

type Device = {
  id: string;
  name: string;
  advertising: any;
};

type ScanScreenProps = {
  navigation: any;
};

type DeviceListItemProps = {
  item: ListRenderItemInfo<Device>;
  connectToPeripheral: (device: Device) => void;
};

const DeviceListItem: React.FC<DeviceListItemProps> = ({ item, connectToPeripheral }) => {
  const [error, setError] = React.useState<string | null>(null);
  const { redirectToAnotherPage } = BluetoothServices();
  const navigation = useNavigation();
  const setDeviceCharacteristique = useSetRecoilState(DeviceCharacteristiqueAtom);

  const connect = React.useCallback(async () => {
    try {
      connectToPeripheral(item.item);
      setDeviceCharacteristique(item as any)
      redirectToAnotherPage(navigation, "Home");
    } catch (error) {
      setError(error as any);
    }
  }, [connectToPeripheral, item]);

  return (
    <TouchableOpacity onPress={connect} style={styles.ctaButton}>
      {error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : (
        <View style={styles.ctaContent}>
          <View style={styles.iconContainer}>
            <Ionicons name={'watch-outline'} size={40} color={'#5916C9'} />
            {/* <Ionicons name={'wifi-outline'} size={24} color={'#5916C9'} style={styles.wifiIcon} /> */}
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.ctaButtonText1}>{item.item.name}</Text>
            <Text style={styles.ctaButtonText2}>{item.item.id}</Text>
          </View>
          <Ionicons name={'chevron-forward-outline'} size={30} color={'#E4E1F9'} style={styles.icon2} />
        </View>
      )}
      
    </TouchableOpacity>
  );
};

export default function ScanScreen({ navigation }: ScanScreenProps) {
  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: '',
    });
  }, [navigation]);

  const { initializeBluetooth, scan, connectToDevice, allDevices, disconnectFromDevice } = BluetoothServices();
  const connected = useRecoilValue(ConnectedAtom);

  React.useEffect(() => {
    const scanForDevices = async () => {
      const isPermissionsEnabled = await initializeBluetooth();
      if (isPermissionsEnabled) {
        scan();
      }
    };

    const intervalId = setInterval(scanForDevices, 5000);

    return () => clearInterval(intervalId);
  }, [initializeBluetooth, scan]);

  const disconnect = () => {
    disconnectFromDevice();
    navigation.navigate('Home');
  };

  const renderDeviceListItem = React.useCallback(
    (item: ListRenderItemInfo<Device>) => (
      <DeviceListItem item={item} connectToPeripheral={connectToDevice} />
    ),
    [connectToDevice]
  );

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#FEFEFE', '#F3F1FB']} style={styles.container}>
        <View style={styles.topContainer}>
          {connected ? (
            <Text style={styles.heartRateTitleText}>You are connected to a device!</Text>
          ) : (
            <ScanAnimation />
          )}
        </View>
        {connected && (
          <TouchableOpacity onPress={disconnect} style={styles.disconnectButton}>
            <Text style={styles.ctaButtonText}>Disconnect</Text>
          </TouchableOpacity>
        )}
        {!connected && (
          <FlatList
            contentContainerStyle={styles.deviceListContainer}
            data={allDevices}
            renderItem={renderDeviceListItem}
            keyExtractor={(item) => item.id}
          />
        )}
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f2f2",
  },
  topContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  heartRateTitleText: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    marginHorizontal: 20,
    color: "black",
  },
  disconnectButton: {
    backgroundColor: "#5916C9",
    justifyContent: "center",
    alignItems: "center",
    height: 50,
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 8,
  },
  ctaButton: {
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    height: 90,
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 8,
  },
  ctaContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    alignItems: 'center',
    marginRight: 10,
  },
  wifiIcon: {
    position: 'absolute',
    bottom: -5,
  },
  textContainer: {
    flex: 1,
  },
  ctaButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "black",
  },
  ctaButtonText1: {
    fontSize: 15,
    fontWeight: "bold",
    color: "black",
  },
  ctaButtonText2: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#8B8990",
  },
  icon2: {
    marginRight: 10,
  },
  errorText: {
    fontSize: 16,
    color: "red",
    textAlign: "center",
    paddingVertical: 10,
  },
  deviceListContainer: {
    flex: 1,
    justifyContent: "flex-start",
    marginTop: 20,
  },
});
