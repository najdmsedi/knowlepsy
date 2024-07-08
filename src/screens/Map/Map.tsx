import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, View, Text, Dimensions } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useRecoilValue } from 'recoil';
import { PatientAtom, PatientsAtom, locationAtom } from '../../atoms';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';
import { BASE_URL } from '../../config';
interface Location {
  latitude: number;
  longitude: number;
}
export interface Patient {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  birthdayDate: string;
  gender: string;
  mobileNumber: string;
  caireGiverIds: string[];
  doctorIds: string[];
  fcmToken: string;
  role: string;
  patientIds: string[];
  password: string;
  __v: number;
}
interface PatientLocation {
  location: Location;
  patientId: Patient;
}
const Map = () => {
  // const location = useRecoilValue(locationAtom);
  const { userInfo } = useContext(AuthContext);
  const [locations, setLocations] = useState<PatientLocation[]>([]);
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const { userGuestInfo } = useContext(AuthContext);
  const Patient = useRecoilValue<any>(PatientAtom);
  const Patients = useRecoilValue(PatientsAtom);

  useEffect(() => {
    const fetchUser = async () => {
      // console.log("userGuestInfo userGuestInfo", Patients);

    };
    // console.log("location location", locations);

    fetchUser();
  }, []);


  // const fetchLocation = async () => {
  //   console.log("userInfo", userInfo.patientIds[0]);

  //   setIsLoading(true);
  //   setError(null);

  //   try {
  //     const response = await axios.get(`${BASE_URL}/GPS/GPS/${userInfo.patientIds[0]}`);
  //     setLocations(response.data);
  //   } catch (err: any) {
  //     setError(err.response?.data?.message || 'Failed to fetch location');
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const fetchLocations = async () => {
    console.log("Starting to fetch locations for all patients");

    setIsLoading(true);
    setError(null);

    try {
      let allLocations = []; // Array to hold all fetched locations

      // Loop through each patient ID and fetch the location
      for (const patient of Patients as any) {
        // console.log("patient patient patient patient", patient);

        const response = await axios.get(`${BASE_URL}/GPS/GPS/${patient._id}`);
        allLocations.push({
          patientId: patient,
          location: response.data
        }); // Store each patient's location with their ID
      }
      // console.log("allLocations allLocations", allLocations);

      // Update the state with all fetched locations
      setLocations(allLocations);
    } catch (err) {
      // Handle errors: log and set error state
      console.error('Error fetching locations', err);
      // setError(err.response?.data?.message || 'Failed to fetch location');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLocations()

    const interval = setInterval(() => {
      fetchLocations()
    }, 30000);
    return () => clearInterval(interval);

  }, []);

  return (
    <View style={styles.container}>
      {Patients.length > 0 &&
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

              {locations.map(({ location, patientId }) => (
                <Marker
                  key={patientId._id}
                  coordinate={{ latitude: Number(location.latitude), longitude: Number(location.longitude) }}
                  title={`${patientId.firstName} ${patientId.lastName}`}
                  description={patientId.email}
                />
              ))}

            </MapView>
          </View>
        </>
      }

      {Patients.length === 0 &&
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
