// App.jsx
import React from 'react';
import { Text, View } from 'react-native';
import { BaseToast, ErrorToast } from 'react-native-toast-message';

interface CustomToastProps {
  text1: string;
  text2: string;
  props: {
    uuid: string;
  };
}

export const toastConfig = {

  success: (props: any) => (
    <BaseToast
      {...props}
      style={{ borderLeftColor: 'pink' }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontSize: 15,
        fontWeight: '400'
      }}
    />
  ),

  error: (props: any) => (
    <ErrorToast
      {...props}
      text1Style={{
        fontSize: 17
      }}
      text2Style={{
        fontSize: 15
      }}
    />
  ),

  customErrorToast: ({ text1, text2, props }: CustomToastProps) => (
    <View style={{ height: 60, width: '50%', padding: 15, backgroundColor: '#e50b0b', borderRadius: 50 }}>
      <Text style={{ textAlign: "center" }}>{text1}</Text>
      <Text>{text2}</Text>
      <Text>{props.uuid}</Text>
    </View>
  ),

  customSuccessToast: ({ text1, text2, props }: CustomToastProps) => (
    <View style={{ height: 60, width: '50%', padding: 15, backgroundColor: '#B4DFC4', borderRadius: 50 }}>
      <Text style={{ textAlign: "center" }}>{text1}</Text>
      <Text>{text2}</Text>
      <Text>{props.uuid}</Text>
    </View>
  )
};

