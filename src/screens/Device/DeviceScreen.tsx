import * as React from 'react';
import { View, Text } from 'react-native';
import ConstantBar from '../../IsConnectedButton';

export default function DeviceScreen({ navigation }) {
    React.useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => <ConstantBar />,
            title: '',
        });
    }, [navigation]);

    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            
            <Text
                onPress={() => navigation.navigate('Home')}
                style={{ fontSize: 26, fontWeight: 'bold' }}>Details Screen</Text>
        </View>
    );
}