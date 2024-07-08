import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useEffect, useState } from "react";
import axios from 'axios';
import { BASE_URL } from "../config";
import { PatientAtom, PatientsAtom } from "../atoms";
import { useRecoilValue, useSetRecoilState } from "recoil";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLoading, setIsLoading] = useState(false)
    const [userToken, setUserToken] = useState(null)
    const [userInfo, setUserInfo] = useState(null)
    const [password, setPassword] = useState("")

    const [userGuestInfo, setUserGuestInfo] = useState([]);
    const [patientId, setpatientId] = useState(null);
    const setPatient = useSetRecoilState(PatientAtom);
    const setPatients = useSetRecoilState(PatientsAtom);

    const Patient = useRecoilValue(PatientAtom);

    // const login = async (email, password) => {
    //     setIsLoading(true);
    //         try {
    //             const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {email,password});
    //             console.log(loginResponse);
    //             const userDataResponse = await axios.post(`${BASE_URL}/auth/userdata`, {token: loginResponse.data.data});
    //             let patientData=null
    //             let caireGiverData=[null]

    //             // if(userDataResponse.data.data.role === "patient"){
    //             //     patientData = userDataResponse.data.data;
    //             //     if(userDataResponse.data.data.caireGiverId){
    //             //     caireGiverData = await axios.get(`${BASE_URL}/user/${userDataResponse.data.data.caireGiverId}`);
    //             //     caireGiverData = caireGiverData.data;
    //             //     }
    //             //     console.log("----patient----");
    //             //     console.log("patientData",patientData);
    //             //     console.log("caireGiverData",caireGiverData);
    //             //     console.log("----patient----");
    //             //     setUserGuestInfo(caireGiverData);
    //             //     AsyncStorage.setItem('userGuestInfo', JSON.stringify(caireGiverData));
    //             // }
    //             // else if(userDataResponse.data.data.role === "caireGiver"){
    //             //     caireGiverData = userDataResponse.data.data;
    //             //     try {
    //             //         patientData = await axios.get(`${BASE_URL}/user/patients/${userDataResponse.data.data._id}`);
    //             //         patientData = patientData.data.patients[0]
    //             //     } catch (error) {
    //             //         console.log("get patient from caireGiver error", error);
    //             //     }
    //             //     console.log("----caireGiver----");
    //             //     console.log("patientData",patientData);
    //             //     console.log("caireGiverData",caireGiverData);
    //             //     console.log("----caireGiver----");
    //             //     setUserGuestInfo(patientData);
    //             //     AsyncStorage.setItem('userGuestInfo', JSON.stringify(patientData));
    //             // }

    //             if(userDataResponse.data.data.role === "caireGiver"){
    //                 caireGiverData = userDataResponse.data.data;
    //                 const response = await axios.get(`${BASE_URL}/user/${userDataResponse.data.data.patientIds[0]}`);
    //                 setUserGuestInfo(response.data);
    //                 AsyncStorage.setItem('userGuestInfo', JSON.stringify(response.data));
    //             }

    //             setUserInfo(userDataResponse.data.data);
    //             setUserToken(loginResponse.data.data);
    //             AsyncStorage.setItem('userToken', loginResponse.data.data);
    //             AsyncStorage.setItem('userInfo', JSON.stringify(userDataResponse.data.data));
    //             console.log("userInfo",userInfo); 
    //         } catch (error) {
    //             console.log(`Login error ${error}`);
    //         }
    //     setIsLoading(false)
    // }
    const login = async (email, password) => {
        setIsLoading(true);
        try {
            console.log("email", email);
            console.log("password", password);
            setPassword(password)
            await AsyncStorage.setItem('password', password);
            const loginResponse = await axios.post(`${BASE_URL}/auth/login`, { email, password });
            const userDataResponse = await axios.post(`${BASE_URL}/auth/userdata`, { token: loginResponse.data.data });
            console.log("userDataResponse.data.data.role", userDataResponse.data.data.role);

            let patientData = null;
            let caireGiverData = [null];
            if (userDataResponse.data.data.role === "patient") {
                setpatientId(userDataResponse.data.data._id);
                await AsyncStorage.setItem('patientId', userDataResponse.data.data._id);
            }
            if (userDataResponse.data.data.role === "caireGiver") {

                // caireGiverData = userDataResponse.data.data;
                if (userDataResponse.data.data.patientIds.length) {
                    const allPatientData = [];
                    for (let i = 0; i < userDataResponse.data.data.patientIds.length; i++) {
                        const patientId = userDataResponse.data.data.patientIds[i];
                        const response = await axios.get(`${BASE_URL}/user/${patientId}`);
                        allPatientData.push(response.data);
                    }
                    setPatients(allPatientData)
                    await AsyncStorage.setItem('Patients', JSON.stringify(allPatientData));
                    setPatient(allPatientData[0])
                    console.log("allPatientData",allPatientData);
                    console.log("allPatientData[0]",allPatientData[0]);
                    console.log("allPatientData[0]._id",allPatientData[0]._id);

                    // const response = await axios.get(`${BASE_URL}/user/${userDataResponse.data.data.patientIds[0]}`);
                    // console.log("response", response);
                    setpatientId(allPatientData[0]._id)
                    // console.log("response.data",response.data);
                    // setUserGuestInfo(response.data);
                    // setPatient(response.data)
                    // await AsyncStorage.setItem('userGuestInfo', JSON.stringify(response.data));
                    await AsyncStorage.setItem('patientId', allPatientData[0]._id);
                    await AsyncStorage.setItem('Patient', JSON.stringify(allPatientData[0]));
                }
                console.log("Patient", Patient);

            }

            setUserInfo(userDataResponse.data.data);
            setUserToken(loginResponse.data.data);
            await AsyncStorage.setItem('userToken', loginResponse.data.data);
            await AsyncStorage.setItem('userInfo', JSON.stringify(userDataResponse.data.data));
            console.log("userInfo", userInfo);

            setIsLoading(false);
            return true; // Indicating the login was successful
        } catch (error) {
            console.log(`Login error ${error}`);
            setIsLoading(false);
            return false; // Indicating the login failed
        }
    };
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
            let userGuestInfo = await AsyncStorage.getItem('userGuestInfo');
            let patientId = await AsyncStorage.getItem('patientId');
            let Patient = await AsyncStorage.getItem('Patient');
            let Patients = await AsyncStorage.getItem('Patients');
            let password = await AsyncStorage.getItem('password');
      
            userInfo = JSON.parse(userInfo);
            userGuestInfo = JSON.parse(userGuestInfo);
            Patient = JSON.parse(Patient);
            Patients = JSON.parse(Patients);

            // patientId = JSON.parse(patientId);
            console.log("patientId patientId", patientId);
            if (password) {
                setPassword(password)
            }
            if (userInfo) {
                setUserToken(userToken);
                setUserInfo(userInfo);
            }
            if (userGuestInfo) {
                setUserGuestInfo(userGuestInfo);
            }
            if (patientId) {
                setpatientId(patientId);
            }
            if (Patient) {
                setPatient(Patient);
            }
            if (Patients) {
                setPatients(Patients);
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
        <AuthContext.Provider value={{ login, logout, isLoading, userToken, userInfo, userGuestInfo, patientId, password }}>
            {children}
        </AuthContext.Provider>
    )
}