import * as React from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useFocusEffect } from '@react-navigation/native';
import BluetoothServices from '../../services/BluetoothServices ';

export default function SleepTrackScreen({ navigation }) {

    const { checkState } = BluetoothServices();
    const [rectangleColor, setRectangleColor] = React.useState('#FFCBC9');
    const [BleColor, setBleColor] = React.useState('#D1837F');
    const requestPermission = () => {
        navigation.navigate('ScanScreen');
    };
    useFocusEffect(
        React.useCallback(() => {
            checkState().then((ch) => {
                if (ch == true) {
                    setRectangleColor('#71db65');
                    setBleColor('#5c8c57')
                  } else if (ch == false) {
                    setRectangleColor('#FFCBC9');
                    setBleColor('#D1837F')
                  }
            });
            navigation.setOptions({
                title: '',
                headerRight: () => <TouchableOpacity onPress={requestPermission}>
                    <View style={[styles.rectangle, { backgroundColor: rectangleColor }]}>
                        <Ionicons
                            name={'bluetooth'}
                            size={24}
                            color={BleColor}
                            style={styles.icon}
                        />
                        <Text style={styles.textB}>Click to connect</Text>
                    </View>
                </TouchableOpacity>
            });

        }, [checkState]) 
    );

    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text
                onPress={() => navigation.navigate('sleep')}
                style={{ fontSize: 26, fontWeight: 'bold' }}>Sleep Screen</Text>
        </View>
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

