import { ActivityIndicator, Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import { ListItem } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import { BASE_URL } from '../../config';
import { AuthContext } from '../../context/AuthContext';

interface Invitation {
    _id: string;
    patientEmail: string;
    doctorEmail: string;
    pending: boolean;
}
const contacts: Invitation[] = [
    { _id: '1', patientEmail: 'Holiday festivities', doctorEmail: "Alicia: Can't wait to see everyone...", pending: true },
    { _id: '2', patientEmail: 'Sachiko Takahashi', doctorEmail: 'Happy holidays!', pending: true },
    { _id: '3', patientEmail: 'Alex Walker', doctorEmail: 'December break is a mood', pending: true },
];
const InvitationPage = () => {
    const [invitations, setInvitations] = useState<Invitation[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigation = useNavigation();
    const { userInfo } = useContext(AuthContext);

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
        const fetchInvitationsForDoctor = async () => {
            try {
                const response = await fetch(`${BASE_URL}/connection/getPendingDoctorConnection/?doctorId=${userInfo._id}`);
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

        if (userInfo.role == "doctor") { fetchInvitationsForDoctor() }


    }, [userInfo]);

    const acceptInvitation = async (item:any) => {
        console.log(item);
        try {
            const response = await fetch(`${BASE_URL}/connection/acceptInvitation/?patientId=${item.patientId}&doctorId=${item.doctorId}`, {
              method: 'PUT',
            });
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            const data = await response.json();
            Alert.alert('Success', 'Invitation accepted successfully');
            setInvitations((prevInvitations) => prevInvitations.filter((inv) => inv._id !== item.doctorId));
            console.log(data);
          } catch (error: any) {
            Alert.alert('Error', error.message);
          }

    }
    const renderpatientItem = ({ item }: { item: Invitation }) => (
        <ListItem bottomDivider>
            <ListItem.Content>
                <ListItem.Title>Invitation sent to </ListItem.Title>
                <ListItem.Subtitle>{item.doctorEmail}</ListItem.Subtitle>
            </ListItem.Content>
            <Text style={styles.status}>{item.pending ? 'Pending ' : 'Accepted '}</Text>
        </ListItem>
    );

    const renderdoctorItem = ({ item }: { item: Invitation }) => (
        <TouchableOpacity onPress={() => acceptInvitation(item)}>
            <ListItem bottomDivider>
                <ListItem.Content>
                    <ListItem.Title>You have invitation from</ListItem.Title>
                    <ListItem.Subtitle>{item.patientEmail}</ListItem.Subtitle>
                </ListItem.Content>
                <Text style={styles.status}>{item.pending ? 'Pending ' : 'Accepted '}</Text>
            </ListItem>
        </TouchableOpacity>
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
                <Text style={styles.noDataText}>No invitations found</Text>
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
            {userInfo.role == "doctor" &&
                <FlatList
                    data={invitations}
                    keyExtractor={(item) => item._id}
                    renderItem={renderdoctorItem}
                />}

        </View>
    );
};

export default InvitationPage;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    errorText: {
        color: 'red',
        fontSize: 16,
    },
    noDataText: {
        color: 'black',
        fontSize: 16,
    },
    status: {
        fontSize: 12,
        color: 'gray',
    },

});
