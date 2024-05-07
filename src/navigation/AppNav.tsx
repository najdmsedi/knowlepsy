import { ActivityIndicator, StyleSheet, Text, View } from 'react-native'
import React, { useContext } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import AuthStack from './AuthStack'
import { AuthContext } from '../context/AuthContext'
import TabNavigator from './TabNavigator'

const AppNav = () => {
    const { isLoading, userToken } = useContext(AuthContext);
    if (isLoading) {
        return(
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size={'large'} />
        </View>
        )
    }
    return (
        <NavigationContainer>
            {userToken !== null ? <TabNavigator /> : <AuthStack />}
        </NavigationContainer>
    )
}

export default AppNav

const styles = StyleSheet.create({})