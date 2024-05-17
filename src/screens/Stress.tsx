import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import LinearGradient from 'react-native-linear-gradient'
import Ionicons from 'react-native-vector-icons/Ionicons'

const Stress = () => {
    return (
        <LinearGradient colors={['#FEFEFE', '#C4BCED']} style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
           
            <Ionicons name={`happy-outline`} size={60} color={'#3AA50E'} style={{ top: -200,right: 120 }} />

            <Ionicons name={'happy-outline'} size={60} color={'#D1837F'} style={{ top: -100,right: 120  }} />

            <Ionicons name={'sad-outline'} size={60} color={'#B50F0F'} style={{ top: 10,right: 120  }} />
       
        </LinearGradient>
    )
}

export default Stress

const styles = StyleSheet.create({})