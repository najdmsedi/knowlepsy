import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { useRecoilValue } from 'recoil';
import { ConnectedAtom } from '../atoms';
// import { MaterialCommunityIcons } from "@expo/vector-icons";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

type ConstantBarProps = {
    color?: Color,
    marginRight?: number
};
export enum Color {
    RED = '#00FF00',
    GREEN = '#FFCBC9'
}

const ConstantBar: React.FC<ConstantBarProps> = ({ color, marginRight = 120 }) => {
    const navigation = useNavigation();
    const connected = useRecoilValue(ConnectedAtom);
    const [rectangleColor, setRectangleColor] = React.useState('#FFCBC9');
    const [BleColor, setBleColor] = React.useState('#D1837F');
    const [text, setText] = React.useState('Click to connect');
    const [iconName, setIconName] = React.useState('bluetooth-off');

    const requestPermission = () => {
        navigation.navigate('ScanScreen');
    };

    useEffect(() => {
        if (connected) {
            console.log("it is connected");
            setRectangleColor('#BFF7CC');
            setBleColor('#5c8c57');
            setIconName('bluetooth');
            setText('Device is Paired')
        } else {
            console.log("it's not connected");
            setRectangleColor('#FFCBC9');
            setBleColor('#D1837F');
            setIconName('bluetooth-off');
            setText('Click to connect')
        }
    }, [connected])

    return (
        <TouchableOpacity onPress={requestPermission}>
            <View style={[styles.rectangle, { backgroundColor: rectangleColor, marginRight: marginRight }]}>
                <Icon
                    name={iconName}
                    size={24}
                    color={BleColor}
                    style={styles.icon}
                />
                {!connected &&
                    <View style={[styles.rectangle1, { backgroundColor: "#EF7266" }]}>
                        <Text style={{ ...styles.textB }} >{text}</Text>
                    </View>
                }
                {connected &&
                    <Text style={{ ...styles.textC }} >{text}</Text>
                }
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingRight: 16,
    },
    textB: {
        fontSize: 12,
        fontWeight: 'bold',
        color: 'white',
        marginLeft: 2,
    },
    textC: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#0A6C3D',
        marginLeft: 2,
    },
    rectangle: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 30,
    },
    rectangle1: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 5,
        paddingHorizontal: 5,
        borderRadius: 30,
    },
    icon: {
        marginRight: 10,
    },
});


export default ConstantBar;


