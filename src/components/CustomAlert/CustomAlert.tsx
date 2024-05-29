import React, { useState } from 'react';
import { View, Text, Button, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import Modal from 'react-native-modal';

interface CustomAlertProps {
    isVisible: boolean;
    onClose: () => void;
    title: string;
    message: string;
    onConfirm: (inputValue: string) => void;
    isPassword?: boolean;
}

const CustomAlert: React.FC<CustomAlertProps> = ({ isVisible, onClose, title, message, onConfirm, isPassword = false }) => {
    const [inputValue, setInputValue] = useState('');

    return (
        <Modal isVisible={isVisible}>
            <View style={styles.modalContent}>
                <Text style={styles.title}>{title} </Text>
                <Text style={styles.message}>{message} </Text>
                {isPassword && (
                    <TextInput
                        style={styles.input} 
                        placeholder="Enter password"
                        secureTextEntry
                        value={inputValue}
                        onChangeText={setInputValue}
                    />
                )}
                <TouchableOpacity style={styles.button} onPress={() => { onConfirm(inputValue); onClose(); }}>
                    <Text style={styles.buttonText}>OK </Text>
                </TouchableOpacity>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContent: {
        backgroundColor: 'white',
        padding: 22,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 4,
        borderColor: 'rgba(0, 0, 0, 0.1)',
    },
    title: {
        color: "black",
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 12,
    },
    message: {
        color: "black",
        fontSize: 16,
        marginBottom: 12,
    },
    input: {
        color:"black",
        width: '100%',
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        padding: 10,
        marginBottom: 12,
    },
    button: {
        backgroundColor: '#4A189B',
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 5,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
    },
});

export default CustomAlert;
