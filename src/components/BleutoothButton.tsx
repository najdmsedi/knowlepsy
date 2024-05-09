import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import BluetoothServices from '../services/BluetoothServices ';
import { useRecoilValue } from 'recoil';
import { ConnectedAtom } from '../atoms';

type ConstantBarProps = {
    color?: Color
};
export enum Color {
    RED = '#00FF00',
    GREEN = '#FFCBC9'
}

const ConstantBar: React.FC<ConstantBarProps> = ({ color }) => {
    const navigation = useNavigation();
    const connected = useRecoilValue(ConnectedAtom);
    const [rectangleColor, setRectangleColor] = React.useState('#FFCBC9');
    const [BleColor, setBleColor] = React.useState('#D1837F');
    const [text, setText] = React.useState('Click to connect');

    const requestPermission = () => {
        navigation.navigate('ScanScreen');
    };

    useEffect(() => {
        if (connected) {
            console.log("it is connected");
            setRectangleColor('#71db65');
            setBleColor('#5c8c57');
            setText('    Connected     ')
        } else {
            console.log("it's not connected");
            setRectangleColor('#FFCBC9');
            setBleColor('#D1837F');
            setText('Click to connect')
        }
    }, [connected])

    return (
        <TouchableOpacity onPress={requestPermission}>
            <View style={[styles.rectangle, { backgroundColor: rectangleColor }]}>
                <Ionicons
                    name={'bluetooth'}
                    size={24}
                    color={BleColor}
                    style={styles.icon}
                />
                <Text style={styles.textB}>{text}</Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FCFBFF'
    },
    text: {
        fontSize: 16,
        position: 'absolute',
        left: 10,
        right: 10,
        width: 'auto',
        height: 210,
        color: 'black'
    },
    textB: {
        fontSize: 13,
        fontWeight: 'bold',
        color: '#494646'
    },
    rectangle: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 8,
        borderRadius: 30,
        marginRight: 120,
    },
    icon: {
        marginRight: 10,
    },
});

export default ConstantBar;


