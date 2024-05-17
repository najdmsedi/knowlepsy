import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'; // Assuming you're using FontAwesome for icons
import Ionicons from 'react-native-vector-icons/Ionicons';

interface Props {
    buttonText: string;
    icon?: string; // Make icon optional
    onPress: () => void;
    top?: number;
}

const LargeButton: React.FC<Props> = ({ buttonText, icon, onPress, top }) => {
    return (
        <TouchableOpacity onPress={onPress} style={[styles.buttonContainer, { top: top }]}>
            <View style={styles.button}>
                {icon && (
                    <View style={styles.iconContainer}>
                        <Ionicons name={icon} size={25} color={"#B42916"}/>
                    </View>
                )}
                <Text style={styles.buttonText}>{buttonText}</Text>

            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    buttonText: {
        color: 'black',
        fontWeight: 'bold',
        left:15,
        fontSize: 17
    },
    buttonContainer: {
        alignItems: 'center',
    },
    button: {
        backgroundColor: '#F7C2C1',
        paddingVertical: 20,
        paddingHorizontal: 20,
        borderRadius: 15,
        flexDirection: 'row',
        alignItems: 'center',
        width: 380, // Set a fixed width for the button
    },
    iconContainer: {
        marginLeft: 10, // Adjust margin as needed
    },
});

export default LargeButton;
