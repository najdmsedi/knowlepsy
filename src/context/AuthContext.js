import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useEffect, useState } from "react";
import axios from 'axios';
import { BASE_URL } from "../config";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLoading, setIsLoading] = useState(false)
    const [userToken, setUserToken] = useState(null)
    const [userInfo, setUserInfo] = useState(null)
    const [userGuestInfo, setUserGuestInfo] = useState(null)

    const login = async (email, password) => {
        setIsLoading(true);
            try {
                const loginResponse = await axios.post(`${BASE_URL}/login`, {email,password});
                const userDataResponse = await axios.post(`${BASE_URL}/userdata`, {token: loginResponse.data.data});
                let patientData=null
                let doctorData=null

                if(userDataResponse.data.data.role === "patient"){
                    patientData = userDataResponse.data.data;
                    if(userDataResponse.data.data.doctorId){
                    doctorData = await axios.get(`${BASE_URL}/user/${userDataResponse.data.data.doctorId}`);
                    doctorData = doctorData.data;
                    }
                    console.log("----patient----");
                    console.log("patientData",patientData);
                    console.log("doctorData",doctorData);
                    console.log("----patient----");
                    setUserGuestInfo(doctorData);
                    AsyncStorage.setItem('userGuestInfo', JSON.stringify(doctorData));
                }
                else if(userDataResponse.data.data.role === "doctor"){
                    doctorData = userDataResponse.data.data;
                    try {
                        patientData = await axios.get(`${BASE_URL}/patients/${userDataResponse.data.data._id}`);
                        patientData = patientData.data.patients[0]
                    } catch (error) {
                        console.log("get patient from doctor error", error);
                    }
                    console.log("----doctor----");
                    console.log("patientData",patientData);
                    console.log("doctorData",doctorData);
                    console.log("----doctor----");
                    setUserGuestInfo(patientData);
                    AsyncStorage.setItem('userGuestInfo', JSON.stringify(patientData));
                }

                setUserInfo(userDataResponse.data.data);
                setUserToken(loginResponse.data.data);
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
        setUserGuestInfo(null);
        AsyncStorage.removeItem('userToken')
        AsyncStorage.removeItem('userInfo')
        AsyncStorage.removeItem('userGuestInfo')
        setIsLoading(false)
    }

    const isLoggedIn = async () => {
        try {
            setIsLoading(true)
            let userToken = await AsyncStorage.getItem('userToken');
            let userInfo = await AsyncStorage.getItem('userInfo');
            let userGuestInfo = await AsyncStorage.getItem('userGuestInfo')
            userInfo = JSON.parse(userInfo);
            userGuestInfo = JSON.parse(userGuestInfo);
            if(userInfo){
                setUserToken(userToken);
                setUserInfo(userInfo);
            }
            if(userGuestInfo){
                setUserGuestInfo(userGuestInfo);
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
        <AuthContext.Provider value={{login, logout, isLoading, userToken, userInfo, userGuestInfo }}>
            {children}
        </AuthContext.Provider>
    )
}