import React from 'react';
import { StyleSheet, View, Text, Dimensions } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

const Map = () => {
  return (
    <View style={styles.container}>
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
            coordinate={{ latitude: 34.7398, longitude: 10.7600 }}
            title={"Najd Mseddi"}
            description={""}
          />
        </MapView>
      </View>
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
    top:30,
    borderWidth: 2,
    borderColor: '#563596',
    borderRadius: 10,
    overflow: 'hidden',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});
