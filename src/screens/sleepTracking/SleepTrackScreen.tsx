import * as React from 'react';
import { View, Text } from 'react-native';
import ConstantBar from '../../IsConnectedButton';

export default function SleepTrackScreen({ navigation }) {
    React.useLayoutEffect(() => {
        navigation.setOptions({
            title: '',
            headerRight: () => <ConstantBar />, // Add ConstantBar component to the headerRight

        });
    }, [navigation]);

    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text
                onPress={() => navigation.navigate('sleep')}
                style={{ fontSize: 26, fontWeight: 'bold' }}>Details Screen</Text>
        </View>
    );
}