import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import LinearGradient from 'react-native-linear-gradient'
import Ionicons from 'react-native-vector-icons/Ionicons'
import StressLevelComponent from './Home/components/StressLevelComponent'
import SimpleStressLevelComponent from './SimpleStressLevelComponent'

const Stress = () => {
    return (
        <LinearGradient colors={['#FEFEFE', '#C4BCED']} style={styles.container}>

            <View style={styles.textContainer}>
                <Text style={styles.headerText}>Stress Levels</Text>
                <Text style={styles.subHeaderText}>Monitor and understand your stress levels </Text>
            </View>
            <View style={styles.stressBox}>
                <View style={styles.row}>
                    <SimpleStressLevelComponent marginTop={-3.7} title='Stress Level' color="#bcbcbc" status='happy' statusColor='#bcbcbc' marginLeft={-30} />
                    <Text style={styles.description}>This indicates that you are not connected</Text>
                </View>
            </View>
            <View style={styles.stressBox}>
                <View style={styles.row}>
                    <SimpleStressLevelComponent marginTop={-3.7} title='Stress Level' color="#FAF9FE" status='happy' statusColor='#3AA50E' marginLeft={-30} />
                    <Text style={styles.description}>This indicates that you have no stress</Text>
                </View>
            </View>

            <View style={styles.stressBox}>
                <View style={styles.row}>
                    <SimpleStressLevelComponent marginTop={-3.7} title='Stress Level' color="#FAF9FE" status='happy' statusColor='#D1837F' marginLeft={-30} />
                    <Text style={styles.description}>This indicates that your stress level is medium</Text>
                </View>
            </View>

            <View style={styles.stressBox}>
                <View style={styles.row}>
                    <SimpleStressLevelComponent marginTop={-3.7} title='Stress Level' color="#FAF9FE" status='sad' statusColor='#B50F0F' marginLeft={-30} />
                    <Text style={styles.description}>This indicates that your stress level is high</Text>
                </View>
            </View>
        </LinearGradient>
    )
}

export default Stress

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
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
    stressBox: {
        left: -70,
        top: 40,
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        padding: 30,
        marginVertical: 25,
        width: '70%',
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    description: {
        color: 'black',
        marginTop: 10,
        textAlign: 'center',
        fontSize: 16,
    },
})


// <Ionicons name={`happy-outline`} size={60} color={'#3AA50E'} style={{ top: -200,right: 120 }} />

// <Ionicons name={'happy-outline'} size={60} color={'#D1837F'} style={{ top: -100,right: 120  }} />

// <Ionicons name={'sad-outline'} size={60} color={'#B50F0F'} style={{ top: 10,right: 120  }} />