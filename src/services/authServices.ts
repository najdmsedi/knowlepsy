import { useNavigation } from "@react-navigation/native";
import { Alert } from "react-native";

const registerUser = async (firstname: string, lastname: string, email: string, password: string, mobileNumber: number) => {
    const navigation = useNavigation();

    const userData = {
      firstname,
      lastname,
      email,
      password,
      mobileNumber
    };
  
    try {
      const response = await fetch('http://192.168.1.14:3000/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
  
      if (!response.ok) {
        throw new Error('Failed to add data');
      }
  
      const responseData = await response.json();
      console.log("Response:", responseData);
      // navigation.navigate('LoginScreen');
    } catch (error) {
      console.log('Error adding data:', error);
      // Show alert with error message
      Alert.alert('Error', 'Failed to add data. Please try again later.');
    }
  };
  
  export default registerUser;
  