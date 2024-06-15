import React, { useContext, useEffect, useState } from 'react';
import { View } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import axios from 'axios';
import { useSetRecoilState } from 'recoil';
import { locationAtom } from '../../atoms';
import { BASE_URL } from '../../config';
import { AuthContext } from '../../context/AuthContext';

interface Location {
    latitude: number;
    longitude: number;
}

const LocationComponent: React.FC = () => {
    const [location, setLocation] = useState<Location | null>(null);
    const setLocations = useSetRecoilState(locationAtom);
    const { userInfo } = useContext(AuthContext);

    const getLocation = () => {
        Geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                setLocation({ latitude, longitude });
                sendLocation(userInfo._id, latitude, longitude);
                setLocations({ latitude, longitude });
            },
            (error) => {
                console.log(error.code, error.message);
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
        );
    };

    const sendLocation = (userId: string, latitude: number, longitude: number) => {
        axios.post(`${BASE_URL}/GPS/addLocation`, {
            userId,
            latitude,
            longitude
        })
            .then(response => {
                console.log('Location sent successfully', response.data);
            })
            .catch(error => {
                console.error('Error sending location', error);
            });
    };

    useEffect(() => {
        console.log("user from non ",userInfo);
        
        if (userInfo.role === "patient") {
            getLocation();
            const interval = setInterval(() => {
                getLocation();
            }, 30000);
            return () => clearInterval(interval);
        }
    }, []);

    return <View />;
};

export default LocationComponent;
