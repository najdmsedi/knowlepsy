import React from 'react';
import {View, Text, StyleSheet } from 'react-native';
import { GestureHandlerRootView, TouchableOpacity } from 'react-native-gesture-handler';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface RectangleProps {
  title?: string;
  marginTop?: number;
  paddingHorizontal?: number;
  borderRadius?: number;

  handleButtonPress():void;
}

const ButtonSettings: React.FC<RectangleProps> = ({ handleButtonPress ,marginTop=20,paddingHorizontal=20 ,title='test',borderRadius= 20}) => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
    <TouchableOpacity onPress={handleButtonPress} style={[styles.Editbutton,{marginTop: marginTop,paddingHorizontal: paddingHorizontal,borderRadius:borderRadius}]}>
        <Text style={styles.EditbuttonText}>{title}</Text>
        {/* <Ionicons name="caret-forward-outline" size={20} style={{marginLeft:10}} color="black" /> */}
    </TouchableOpacity>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  Editbutton: {
    backgroundColor: '#d4ceeb',
    paddingVertical: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  EditbuttonText: {
    color: 'black',
    fontSize: 14,
    fontWeight: 'bold',
    marginRight: 200,
  },

});

export default ButtonSettings;
