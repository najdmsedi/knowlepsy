import { Button, Linking, Modal, StyleSheet, Text, TouchableHighlight, TouchableOpacity, View } from 'react-native'
import React from 'react'

interface BluetoothModalProps {
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const BluetoothModal: React.FC<BluetoothModalProps> = ({ showModal, setShowModal }) => {
  const openSettings = () => {
    Linking.openSettings();
    setShowModal(false);
  };

  return (
    <Modal
      visible={showModal}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setShowModal(false)}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalText}>Nearby device permission denied.</Text>
          <Text style={styles.modalText}>Please enable it manually in app settings.</Text>
          <TouchableOpacity style={styles.button} onPress={openSettings} >
            <Text style={styles.buttonText}>OK</Text>
          </TouchableOpacity>        
        </View>
      </View>
    </Modal>
  );
};
const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 10,
    textAlign: 'center',
    fontSize: 16,
    color: 'black',
  },
  button: {
    width: 200,
    height: 50, 
    marginTop: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#5e2a89',
  },
  buttonText: {
    fontSize: 18,
    color: 'white',
  },
});

export default BluetoothModal;