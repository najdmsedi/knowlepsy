import React, { useContext, useEffect, useState } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { BASE_URL } from '../config'; // Make sure to define your BASE_URL
import CustomAlert from '../components/CustomAlert/CustomAlert';
import { useRecoilValue } from 'recoil';
import { PatientAtom } from '../atoms';
import Ionicons from 'react-native-vector-icons/Ionicons'; // Assuming you're using Ionicons

const AddDoctor = () => {
    const { userInfo } = useContext(AuthContext);
    const { login } = useContext(AuthContext)
    const Patient = useRecoilValue<any>(PatientAtom);

    const [doctorEmail, setDoctorEmail] = useState('');
    const [doctorEmails, setDoctorEmails] = useState([]);
    const [isAlertVisible, setAlertVisible] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertTitle, setAlertTitle] = useState('');
    const [alertCallback, setAlertCallback] = useState<(inputValue: string) => void>(() => { });
    const [confirmDeleteEmail, setConfirmDeleteEmail] = useState('');

    useEffect(() => {
        if (userInfo.role === "patient") {
            setDoctorEmails(userInfo.doctors || []);
        } else if (userInfo.role === "caireGiver") {
            setDoctorEmails(Patient.doctors || []);
        }
    }, [userInfo, Patient]);

    const showAlert = (title: string, message: string, callback: (inputValue: string) => void, isPassword = false) => {
        setAlertTitle(title);
        setAlertMessage(message);
        setAlertCallback(() => callback);
        setAlertVisible(true);
    };

    const hideAlert = () => {
        setAlertVisible(false);
    };

    const reLogin = async (password: string) => {
        try {
            await login(userInfo.email, password)
        } catch (error) {
            showAlert('Error', 'An error occurred while relogin', () => { });
        }
    };

    const handlePasswordCheck = async (password: string) => {
        try {
            const email = userInfo.email
            const response = await axios.post(`${BASE_URL}/auth/login`, { email, password })
            if (response) {
                inviteDoctor(password);
            } else {
                showAlert('Error', 'Incorrect password', () => { });
            }
        } catch (error) {
            showAlert('Error', 'An error occurred while checking the password', () => { });
        }
    };

    const inviteDoctor = async (password: string) => {
        if (doctorEmail) {
            try {
                const response = await axios.put(`${BASE_URL}/user/addDoctorEmail/${userInfo._id}`, { doctorEmail });
                if (response.status === 200) {
                    // setDoctorEmails([...doctorEmails, doctorEmail]);
                    setDoctorEmail('');
                    showAlert('Success', 'Doctor invited successfully', () => { reLogin(password) }, false);
                } else {
                    showAlert('Error', 'Failed to invite doctor', () => { }, false);
                }
            } catch (error) {
                Alert.alert('Error', 'Failed to add doctor email');
                console.error('Failed to add doctor email:', error);
            }
        } else {
            Alert.alert('Error', 'Email already added or invalid');
        }
    };

    const startInviteProcess = () => {
        showAlert('Authentication', 'Please enter your password to continue.', handlePasswordCheck, true);
    };



    const deleteDoctor = async (item: string,password: string) => {
        try {
            const response = await axios.delete(`${BASE_URL}/user/deleteDoctorEmail/${userInfo._id}`, { data: { doctorEmail: item } });
            if (response.status === 200) {
                const updatedEmails = doctorEmails.filter((doctor) => doctor !== item);
                setDoctorEmails(updatedEmails);
                showAlert('Success', 'Doctor invited successfully', () => { reLogin(password) }, false);

            } else {
                Alert.alert('Error', 'Failed to delete doctor email');
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to delete doctor email');
            console.error('Failed to delete doctor email:', error);
        }
    };
    const handlePasswordCheckForDelete = async (item: string,password: string) => {
        try {
            const email = userInfo.email
            const response = await axios.post(`${BASE_URL}/auth/login`, { email, password })
            if (response) {
                deleteDoctor(item,password);
            } else {
                showAlert('Error', 'Incorrect password', () => { });
            }
        } catch (error) {
            showAlert('Error', 'An error occurred while checking the password', () => { });
        }
    };
    const confirmDelete = (item: string) => {
        setConfirmDeleteEmail(item);
        // showAlert('Confirm Delete', 'Are you sure you want to delete this doctor?', (inputValue: string) => deleteDoctor(email));
        showAlert('Confirm Delete', 'Are you sure you want to delete this doctor?', (password) => handlePasswordCheckForDelete(item,password));

    };

    return (
        <View style={styles.container}>
            <View style={styles.textContainer}>
                <Text style={styles.headerText}>Invited Doctors</Text>
                <Text style={styles.subHeaderText}>Auto Sending Report to doctor every day </Text>
            </View>
            <Text style={styles.title}>Doctors:</Text>
            <FlatList
                data={doctorEmails}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                    <View style={styles.emailContainer}>
                        <Text style={styles.email}>{item} </Text>
                        {userInfo.role === "patient" &&
                        <TouchableOpacity onPress={() => confirmDelete(item)}>
                            <Ionicons name="trash" size={20} color="red" />
                        </TouchableOpacity>
                        }
                    </View>
                )}
                ListEmptyComponent={<Text style={styles.noEmails}>No doctors invited yet.</Text>}
            />
            {userInfo.role === "patient" &&
                <>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter doctor's email"
                        value={doctorEmail}
                        onChangeText={setDoctorEmail}
                    />
                    <Button color={"#8356FF"} title="Invite Doctor" onPress={startInviteProcess} />
                    <CustomAlert
                        isVisible={isAlertVisible}
                        onClose={hideAlert}
                        title={alertTitle}
                        message={alertMessage}
                        onConfirm={alertCallback}
                        isPassword
                    />
                </>
            }
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    textContainer: {
        marginBottom: 20,
        alignItems: 'center',
    },
    headerText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
    subHeaderText: {
        fontSize: 16,
        color: '#666',
        marginTop: 5,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 10,
        color: 'black',
    },
    emailContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
        marginVertical: 5,
        backgroundColor: '#fcfdff',
        borderRadius: 5,
        borderColor:"black",
        borderWidth:0.5
    },
    email: {
        fontSize: 18,
        color: 'black',
    },
    noEmails: {
        fontSize: 18,
        color: '#888',
        marginVertical: 5,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        paddingHorizontal: 10,
        marginBottom: 10,
        borderRadius: 5,
        color: 'black'
    },
});

export default AddDoctor;
