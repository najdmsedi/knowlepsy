import React, { FC, useCallback, useState } from "react";
import {  FlatList,  ListRenderItemInfo,  Modal,  SafeAreaView,  Text,  StyleSheet, TouchableOpacity,} from "react-native";
import BluetoothServices from "../services/BluetoothServices ";
import { useNavigation } from "@react-navigation/native";

type Device = {
  id: string;
  name: string;
  advertising: any;
};

type DeviceModalListItemProps = {
  item: ListRenderItemInfo<Device>;
  connectToPeripheral: (device: Device) => void;
  closeModal: () => void;
};

type DeviceModalProps = {
  devices: Device[];
  visible: boolean;
  connectToPeripheral: (device: Device) => void;
  closeModal: () => void;
};

export const DeviceModalListItem: FC<DeviceModalListItemProps> = (props) => {
  const { item, connectToPeripheral, closeModal } = props;
  const [error, setError] = useState<string | null>(null);
  const { redirectToAnotherPage } = BluetoothServices();
  const navigation = useNavigation();

  const connectAndCloseModal = useCallback(async () => {
    try {
      connectToPeripheral(item.item);      
      redirectToAnotherPage(navigation,"Home")
      closeModal();
    } catch (error) {
    }
  }, [closeModal, connectToPeripheral, item]);

  return (
    <TouchableOpacity onPress={connectAndCloseModal} style={modalStyle.ctaButton}>
      {error ? (
        <Text style={modalStyle.errorText}>{error}</Text>
      ) : (
        <Text style={modalStyle.ctaButtonText}>{item.item.name}</Text>
      )}
    </TouchableOpacity>
  );
};

const DeviceModal: FC<DeviceModalProps> = (props) => {
  const { devices, visible, connectToPeripheral, closeModal } = props;

  const renderDeviceModalListItem = useCallback(
    (item: ListRenderItemInfo<Device>) => {
      return (
        <DeviceModalListItem item={item} connectToPeripheral={connectToPeripheral} closeModal={closeModal}/>
      );
    },
    [closeModal, connectToPeripheral]
  );

  return (
    <Modal
      style={modalStyle.modalContainer}
      animationType="slide"
      transparent={false}
      visible={visible}
    >
      <SafeAreaView style={modalStyle.modalTitle}>
        <Text style={modalStyle.modalTitleText}>Scanning..</Text>
        <FlatList
          contentContainerStyle={modalStyle.modalFlatlistContiner}
          data={devices}
          renderItem={renderDeviceModalListItem}
        />
        <TouchableOpacity onPress={closeModal} style={modalStyle.ctaButton}>
          <Text style={modalStyle.ctaButtonText}>Close</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </Modal>
  );
};

const modalStyle = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: "#f2f2f2",
  },
  modalFlatlistContiner: {
    flex: 1,
    justifyContent: "center",
  },
  modalTitle: {
    flex: 1,
    backgroundColor: "#f2f2f2",
  },
  modalTitleText: {
    marginTop: 40,
    fontSize: 30,
    fontWeight: "bold",
    marginHorizontal: 20,
    textAlign: "center",
    color:'black'
  },
  ctaButton: {
    backgroundColor: "#5916C9",
    justifyContent: "center",
    alignItems: "center",
    height: 50,
    marginHorizontal: 20,
    marginBottom: 5,
    borderRadius: 8,
  },
  ctaButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
  errorText: {
    fontSize: 16,
    color: "red",
    textAlign: "center",
    paddingVertical: 10,
  },
});

export default DeviceModal;
