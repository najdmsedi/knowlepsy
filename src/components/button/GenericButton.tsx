import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'; // Assuming you're using FontAwesome for icons
import Ionicons from 'react-native-vector-icons/Ionicons';

interface Props {
    buttonText: string;
    icon?: string; // Make icon optional
    onPress: () => void;
    top?: number;
    bottom?: number;
}

const GenericButton: React.FC<Props> = ({ buttonText, icon, onPress, top,bottom }) => {
    return (
        <TouchableOpacity onPress={onPress} style={[styles.buttonContainer, { top: top }, { bottom: bottom }]}>
            <View style={styles.button}>
                <Text style={styles.buttonText}>{buttonText}</Text>
                {icon && (
                    <View style={styles.iconContainer}>
                        <Ionicons name={icon} size={23} color={"black"}/>
                    </View>
                )}
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    buttonText: {
        color: 'black',
        fontWeight: 'bold',
    },
    buttonContainer: {
        alignItems: 'center',
    },
    button: {
        backgroundColor: '#EDEBF7',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 25,
        flexDirection: 'row',
        alignItems: 'center',
        width: 380, // Set a fixed width for the button
        justifyContent: 'space-between', // To space the text and icon evenly
    },
    iconContainer: {
        marginLeft: 10, // Adjust margin as needed
    },
});

export default GenericButton;
