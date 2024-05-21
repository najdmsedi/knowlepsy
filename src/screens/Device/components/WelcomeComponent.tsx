import React from 'react';
import { View, Text, StyleSheet, ListRenderItemInfo } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useRecoilValue } from 'recoil';
import { ConnectedAtom, DeviceCharacteristiqueAtom } from '../../../atoms';

type Device = {
  id: string;
  name: string;
  advertising: any;
};

interface RectangleProps {
  welcome?: string;
  name?: string;
  color?: string;
  marginTop: number;
  item?: ListRenderItemInfo<Device>;
}

type ScanScreenProps = {
  navigation: any;
};


const WelcomeComponent: React.FC<RectangleProps> = ({ name, welcome, color = '#ADD8E6', marginTop,item }) => {
  const connected = useRecoilValue(ConnectedAtom);
  const DeviceCharacteristique = useRecoilValue(DeviceCharacteristiqueAtom);
  if(DeviceCharacteristique){
    item = DeviceCharacteristique
  }

  console.log("from here item",item?.item.advertising.localName);

  return (
    <View style={[styles.wrapper, { top: marginTop }]}>
      {connected &&
        <LinearGradient
          colors={[color, '#E3D8FF']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.container}
        >
          <View style={styles.leftContent}>
            <Text style={styles.name}>Connected to device: </Text>
            <Text style={styles.welcome}>{item?.item.advertising.localName}</Text>
          </View>
          {connected &&
            <View style={styles.icons}>
              <Ionicons name={'watch-outline'} size={65} color={'#5916C9'} style={styles.smartwatchIcon} />
              <View style={styles.wifiCircle}>
                <Ionicons name={'wifi-outline'} size={15} color={'#5916C9'} style={{ left: 0.5 }} />
              </View>
            </View>
          }
        </LinearGradient>
      }

      {!connected &&
        <LinearGradient
          colors={['#FFDEDB', '#FCF2F2']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.container}
        >
          <View style={styles.leftContent}>
            <Text style={styles.welcome2}>Disconnected</Text>
            <Text style={styles.name2}>Scan Device to Connect</Text>
          </View>
          {!connected &&
            <View style={styles.icons}>
              <Ionicons name={'watch-outline'} size={65} color={'#DE8081'} style={styles.smartwatchIcon} />
              <View style={styles.wifiCircle2}>
                <Ionicons name={'close-circle-outline'} size={15} color={'white'} style={{ left: 0.1 }} />
              </View>
            </View>
          }
        </LinearGradient>
      }
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    left: 10,
    right: 10,
    marginBottom: 20,
  },
  container: {
    width: '100%',
    height: 130,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15,
  },
  leftContent: {
    position: 'absolute',
    left: 10,
    top: 20,
  },
  welcome: {
    fontSize: 13,
    fontWeight: 'bold',
    marginBottom: 1,
    marginTop:2,
    color: '#9C86F2',
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
    marginTop: 5,
    color: '#2A0D73',
  },
  welcome2: {
    fontSize: 13,
    fontWeight: 'bold',
    marginBottom: 1,
    marginTop: 15,
    color: '#DE8081',
  },
  name2: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
    marginTop: 5,
    color: '#A58889',
  },
  wifiCircle: {
    width: 20,
    height: 20,
    borderRadius: 25,
    backgroundColor: '#E5E1F9',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 45,  // Adjust this value to position correctly relative to the smartwatch icon
    left: 40,   // Adjust this value to position correctly relative to the smartwatch icon
  },
  wifiCircle2: {
    width: 20,
    height: 20,
    borderRadius: 25,
    backgroundColor: '#FF6C6B',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 45,  // Adjust this value to position correctly relative to the smartwatch icon
    left: 40,   // Adjust this value to position correctly relative to the smartwatch icon
  },
  smartwatchIcon: {
    marginRight: 10,
  },
  icons: {
    position: 'absolute',
    bottom: 30, // Adjust to position the whole icons container
    right: 10,
  },
});

export default WelcomeComponent;
