import { ActivityIndicator, Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import { ListItem } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import { BASE_URL } from '../../config';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';
import CustomAlert from '../CustomAlert/CustomAlert';

interface Invitation {
    _id: string;
    patientEmail: string;
    caireGiverEmail: string;
    pending: boolean;
}
const contacts: Invitation[] = [
    { _id: '1', patientEmail: 'Holiday festivities', caireGiverEmail: "Alicia: Can't wait to see everyone...", pending: true },
    { _id: '2', patientEmail: 'Sachiko Takahashi', caireGiverEmail: 'Happy holidays!', pending: true },
    { _id: '3', patientEmail: 'Alex Walker', caireGiverEmail: 'December break is a mood', pending: true },
];
const InvitationPage = () => {
    const [invitations, setInvitations] = useState<Invitation[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigation = useNavigation();
    const { userInfo } = useContext(AuthContext);
    const [isAlertVisible, setAlertVisible] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertTitle, setAlertTitle] = useState('');
    const [alertCallback, setAlertCallback] = useState<(inputValue: string) => void>(() => { });
    const { login } = useContext(AuthContext)

    const showAlert = (title: string, message: string, callback: (inputValue: string) => void, isPassword = false) => {
        setAlertTitle(title);
        setAlertMessage(message);
        setAlertCallback(() => callback);
        setAlertVisible(true);
    };
    const hideAlert = () => {
        setAlertVisible(false);
      };
    useEffect(() => {
        const fetchInvitationsForpatient = async () => {
            try {
                const response = await fetch(`${BASE_URL}/connection/getPendingPatientConnection/?patientId=${userInfo._id}`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                console.log(data);

                setInvitations(data);
            } catch (error: any) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };
        const fetchInvitationsForcaireGiver = async () => {
            try {
                const response = await fetch(`${BASE_URL}/connection/getPendingcaireGiverConnection/?caireGiverId=${userInfo._id}`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                console.log(data);

                setInvitations(data);
            } catch (error: any) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        if (userInfo.role == "patient") { fetchInvitationsForpatient() }

        if (userInfo.role == "caireGiver") { fetchInvitationsForcaireGiver() }


    }, [userInfo]);
    const reLogin = async (password: string) => {
        try {
            console.log("ena hnaaayaa", password);

            await login(userInfo.email, password)
        } catch (error) {
            showAlert('Error', 'An error occurred while relogin', () => { });
        }
    };
    const acceptInvitation = async (item: any, password: string) => {
        console.log(item);
        try {
            const response = await fetch(`${BASE_URL}/connection/acceptInvitation/?patientId=${item.patientId}&caireGiverId=${item.caireGiverId}`, {
                method: 'PUT',
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            if (response.status === 200) {
                showAlert('Success', 'caireGiver invited successfully', () => { reLogin(password) }, false);
            } else {
                showAlert('Error', 'Failed to invite caireGiver', () => { }, false);
            }
            const data = await response.json();
            Alert.alert('Success', 'Invitation accepted successfully');
            setInvitations((prevInvitations) => prevInvitations.filter((inv) => inv._id !== item.caireGiverId));
            console.log(data);
        } catch (error: any) {
            Alert.alert('Error', error.message);
        }

    }

    const handlePasswordCheck = async (item: any, password: string) => {
        try {
            const email = userInfo.email
            const response = await axios.post(`${BASE_URL}/auth/login`, { email, password })
            if (response) {
                acceptInvitation(item, password);
            } else {
                showAlert('Error', 'Incorrect password', () => { });
            }
        } catch (error) {
            showAlert('Error', 'An error occurred while checking the password', () => { });
        }
    };

    const startAcceptProcess = (item: any) => {
        showAlert('Authentication', 'Please enter your password to continue.', (password) => handlePasswordCheck(item, password), true);
    };

    const renderpatientItem = ({ item }: { item: Invitation }) => (
        <ListItem bottomDivider>
            <ListItem.Content>
                <ListItem.Title>Invitation sent to </ListItem.Title>
                <ListItem.Subtitle>{item.caireGiverEmail}</ListItem.Subtitle>
            </ListItem.Content>
            <Text style={styles.status}>{item.pending ? 'Pending ' : 'Accepted '}</Text>
        </ListItem>
    );

    const rendercaireGiverItem = ({ item }: { item: Invitation }) => (
        <>
            <TouchableOpacity onPress={() => startAcceptProcess(item)}>
                <ListItem bottomDivider>
                    <ListItem.Content>
                        <ListItem.Title>You have invitation from</ListItem.Title>
                        <ListItem.Subtitle>{item.patientEmail}</ListItem.Subtitle>
                    </ListItem.Content>
                    <Text style={styles.status}>{item.pending ? 'Pending ' : 'Accepted '}</Text>
                </ListItem>
            </TouchableOpacity>
            <CustomAlert
                isVisible={isAlertVisible}
                onClose={hideAlert}
                title={alertTitle}
                message={alertMessage}
                onConfirm={alertCallback}
                isPassword
            />
        </>
    );

    if (loading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>Error: {error}</Text>
            </View>
        );
    }

    if (invitations.length === 0) {
        return (
            <View style={styles.container}>
                <Text style={styles.noDataText}>No invitations found </Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {userInfo.role == "patient" &&
                <FlatList
                    data={invitations}
                    keyExtractor={(item) => item._id}
                    renderItem={renderpatientItem}
                />}
            {userInfo.role == "caireGiver" &&
                <FlatList
                    data={invitations}
                    keyExtractor={(item) => item._id}
                    renderItem={rendercaireGiverItem}
                />}

        </View>
    );
};

export default InvitationPage;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'center',
    },
    errorText: {
        color: 'red',
        fontSize: 16,
    },
    noDataText: {
        color: 'black',
        fontSize: 16,
        textAlign: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
    },

    status: {
        fontSize: 12,
        color: 'gray',
    },

});
