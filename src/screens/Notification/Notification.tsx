import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const Notification = () => {
  return (
    <View style={styles.container}>
    <Text style={styles.noDataText}>No Notification found </Text>
</View>
  )
}

export default Notification

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'center',
    },
    noDataText: {
        color: 'black',
        fontSize: 16,
        textAlign: 'center', 
        justifyContent: 'center',
        alignSelf: 'center',
    },
})