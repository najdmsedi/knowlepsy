import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Icon } from 'react-native-elements';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/TabNavigator';
import { useNavigation } from '@react-navigation/native';

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

const AddAnotherButton = () => {
    const navigation = useNavigation<HomeScreenNavigationProp>();
    const handlePress = () => {navigation.navigate('InvitecaireGiver')};
    return (
        <TouchableOpacity style={styles.button} onPress={handlePress}>
            <Icon name="add-circle-outline" type="ionicon" color="#8A57ED" />
            <Text style={styles.buttonText}>Add Caregiver</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 15,
        borderRadius: 5,
        marginVertical: 10,
    },
    buttonText: {
        marginLeft: 10,
        color: '#8A57ED',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default AddAnotherButton;
