import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import TopComponent from './components/TopComponent';
import ConstantBar from '../../components/BleutoothButton';
import LinearGradient from 'react-native-linear-gradient';

type SleepScreenProps = {
    navigation: any;
};

export default function SleepTrackScreen({ navigation }: SleepScreenProps) {
    useEffect(() => {
        navigation.setOptions({
            title: '',
            headerRight: () => <ConstantBar />,
        });
    }, []);

    return (
        <LinearGradient colors={['#FEFEFE', '#EDEBF7']} style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <TopComponent color='#F5F3FF' Time='04:00 pm' info='tracker ends 2h ago' marginTop={20}></TopComponent>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
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
});

