import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useEffect, useState } from "react";
import axios from 'axios';
import { BASE_URL } from "../config";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLoading, setIsLoading] = useState(false)
    const [userToken, setUserToken] = useState(null)
    const [userInfo, setUserInfo] = useState(null)

    const login = async (email, password) => {
        setIsLoading(true);
            try {
                const loginResponse = await axios.post(`${BASE_URL}/login`, {email,password});
                const userDataResponse = await axios.post(`${BASE_URL}/userdata`, {token: loginResponse.data.data});
                setUserToken(loginResponse.data.data);
                setUserInfo(userDataResponse.data.data);
                AsyncStorage.setItem('userToken', loginResponse.data.data);
                AsyncStorage.setItem('userInfo', JSON.stringify(userDataResponse.data.data));
                console.log("userInfo",userInfo);
            } catch (error) {
                console.log(`Login error ${error}`);
            }
        setIsLoading(false)
    }

    const logout = () => {
        setIsLoading(true)
        setUserToken(null)
        setUserInfo(null)
        AsyncStorage.removeItem('userToken')
        AsyncStorage.removeItem('userInfo')
        setIsLoading(false)
    }

    const isLoggedIn = async () => {
        try {
            setIsLoading(true)
            let userToken = await AsyncStorage.getItem('userToken');
            let userInfo = await AsyncStorage.getItem('userInfo');
            userInfo = JSON.parse(userInfo);
            if(userInfo){
                setUserToken(userToken);
                setUserInfo(userInfo);
            }
            setIsLoading(false)
        } catch (e) {
            console.log(`isLogged in error ${e}`);
        }
    }
    useEffect(() => {
        isLoggedIn();
    }, [])
    return (
        <AuthContext.Provider value={{login, logout, isLoading, userToken, userInfo }}>
            {children}
        </AuthContext.Provider>
    )
}