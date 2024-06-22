import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, View, Text, Dimensions } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useRecoilValue } from 'recoil';
import { locationAtom } from '../../atoms';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';
import { BASE_URL } from '../../config';
interface Location {
  latitude: number;
  longitude: number;
}
const Map = () => {
  // const location = useRecoilValue(locationAtom);
  const { userInfo } = useContext(AuthContext);
  const [location, setLocation] = useState<Location | null>(null);
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const { userGuestInfo } = useContext(AuthContext);

  useEffect(() => {
    const fetchUser = async () => {
      console.log("userGuestInfo userGuestInfo", userGuestInfo);

    };

    fetchUser();
  }, []);


  const fetchLocation = async () => {
    console.log("userInfo", userInfo.patientIds[0]);

    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.get(`${BASE_URL}/GPS/GPS/${userInfo.patientIds[0]}`);
      setLocation(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch location');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLocation()
    const interval = setInterval(() => {
      fetchLocation()
    }, 30000);
    return () => clearInterval(interval);

  }, []);

  return (
    <View style={styles.container}>
      {userGuestInfo!=null &&
        <>
          <Text style={styles.title}>Track Patient Location</Text>
          <View style={styles.mapContainer}>
            <MapView
              style={styles.map}
              initialRegion={{
                latitude: 35.7398,
                longitude: 10.7600,
                latitudeDelta: 1,
                longitudeDelta: 1,
              }}
              showsUserLocation={true}
              zoomEnabled={true}
            >
              <Marker
                coordinate={{ latitude: location ? Number(location?.latitude) : 0, longitude: location ? Number(location?.longitude) : 40 }}
                title={userGuestInfo.firstName + " " + userGuestInfo.lastName}
                description={userGuestInfo.email}
              />
            </MapView>
          </View>
        </>
      }

      {userGuestInfo.length === 0 &&
        <>
          <Text style={styles.title}>You have no patient to care for.</Text>
          <View style={styles.mapContainer}>
            <MapView
              style={styles.map}
              initialRegion={{
                latitude: 35.7398,
                longitude: 10.7600,
                latitudeDelta: 1,
                longitudeDelta: 1,
              }}
              showsUserLocation={true}
              zoomEnabled={true}
            >
            </MapView>
          </View>
        </>
      }
    </View>
  );
};

export default Map;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#563596',
    marginBottom: 10,
  },
  mapContainer: {
    width: Dimensions.get('window').width * 0.95,
    height: Dimensions.get('window').height * 0.8,
    top: 30,
    borderWidth: 2,
    borderColor: '#563596',
    borderRadius: 10,
    overflow: 'hidden',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});
