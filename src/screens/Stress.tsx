import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import LinearGradient from 'react-native-linear-gradient'
import Ionicons from 'react-native-vector-icons/Ionicons'
import StressLevelComponent from './Home/components/StressLevelComponent'

const Stress = () => {
    return (
        <LinearGradient colors={['#FEFEFE', '#C4BCED']} style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{color:"black",right:50,bottom:290}}>This is indicate that your stress  </Text>
            <Text style={{color:"black",right:50,bottom:293}}>is good  </Text>

            <StressLevelComponent title='Stress Level' color="#FAF9FE" marginTop={25} status='happy' statusColor='#3AA50E' />
            <Text style={{color:"black",right:50,bottom:40}}>This is indicate that your stress  </Text>
            <Text style={{color:"black",right:50,bottom:41}}>is Medium  </Text>
            <StressLevelComponent title='Stress Level' color="#FAF9FE" marginTop={300} status='happy' statusColor='#D1837F' />
           
            <Text style={{color:"black",right:50,bottom:-200}}>This is indicate that your stress  </Text>
            <Text style={{color:"black",right:50,bottom:-205}}>is high  </Text>
            <StressLevelComponent title='Stress Level' color="#FAF9FE" marginTop={600} status='sad' statusColor='#B50F0F' />

        </LinearGradient>
    )
}

export default Stress

const styles = StyleSheet.create({})


// <Ionicons name={`happy-outline`} size={60} color={'#3AA50E'} style={{ top: -200,right: 120 }} />

// <Ionicons name={'happy-outline'} size={60} color={'#D1837F'} style={{ top: -100,right: 120  }} />

// <Ionicons name={'sad-outline'} size={60} color={'#B50F0F'} style={{ top: 10,right: 120  }} />