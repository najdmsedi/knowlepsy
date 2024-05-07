import {createNativeStackNavigator} from '@react-navigation/native-stack';
import RegisterScreen from '../screens/Auth/Register/Register';
import LoginScreen from '../screens/Auth/Login/LoginScreen';

const Stack = createNativeStackNavigator();

const AuthStack = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
       <Stack.Screen name="LoginScreen" component={LoginScreen} options={{ headerShown: false }} />
       <Stack.Screen name="RegisterScreen" component={RegisterScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
};

export default AuthStack;
