import React, { useState, useEffect, useRef, useCallback, useContext } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, ListRenderItem } from 'react-native';
import { RouteProp, useIsFocused, useRoute } from '@react-navigation/native';
import { BASE_URL } from '../../config';
import { AuthContext } from '../../context/AuthContext';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { io } from 'socket.io-client';
import { RootStackParamList } from '../../navigation/TabNavigator';

type Message = {
  id: string;
  text: string;
  isUser: boolean;
  avatar: string;
};

type ChatScreenProps = {
  userId: string;
  otherUserId: string;
  userAvatar: string;
  otherUserAvatar: string;
};
type ChatScreenRouteProp = RouteProp<RootStackParamList, 'ChatScreen'>;

const ChatScreen = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState('');
  const [userGuestInfoID, setuserGuestInfoID] = useState(" ");

  const flatListRef = useRef<FlatList<Message>>(null);
  const isFocused = useIsFocused();
  const { userInfo } = useContext(AuthContext);
  const route = useRoute<ChatScreenRouteProp>();
  const { item } = route.params;

  const socket = useRef(io(BASE_URL)).current;

  useEffect(() => {
    const getuserGuestInfoID = async () => {      
      try {
        if(userInfo.role === "patient"){
          setuserGuestInfoID(item.caireGiverId) 
        }
        else if (userInfo.role === "caireGiver"){
          setuserGuestInfoID(item.patientId)
        }
      } catch (error) {
        console.log("getConnection error",error);
      }
    } 
    getuserGuestInfoID()
  }, [item.caireGiverId, item.patientId, userInfo.role]);

  const fetchMessages = useCallback(async () => {
    try {
      console.log("Starting fetch from:", `${BASE_URL}/messages/${userInfo._id}/${item._id}`);
      const response = await fetch(`${BASE_URL}/messages/${userInfo._id}/${item._id}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch messages: ${response.statusText}`);
      }
  
      console.log("Fetch response status:", response.status);
  
      const data = await response.json();
      console.log("Parsed data:", data);
  
      if (!Array.isArray(data)) {
        throw new Error("Data is not an array");
      }
  
      const formattedMessages = data.map((msg) => {
        if (!msg._id || !msg.text || !msg.senderId) {
          throw new Error("Message format is incorrect");
        }
  
        return {
          id: msg._id,
          text: msg.text,
          isUser: msg.senderId === userInfo._id,
          avatar: msg.senderId === userInfo._id ? userInfo.avatar : item.avatar,
        };
      });
  
      console.log("Formatted messages:", formattedMessages);
      setMessages(formattedMessages);
      console.log("Messages set in state successfully");
      
    } catch (error: any) {
      console.error('Error fetching messages:', error);
    }
  }, [userInfo._id, item._id, userInfo.avatar, item.avatar]);

  useEffect(() => {
    if (isFocused) {
      fetchMessages();
    }
  }, [isFocused, fetchMessages]);

  useEffect(() => {
    if (flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  useEffect(() => {
    socket.on('connect', () => {
      console.log('Connected to WebSocket server');
      socket.emit('joinRoom', { roomId: item._id });
    });

    socket.on('receiveMessage', (message) => {
      console.log('Received message:', message);
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          id: message._id,
          text: message.text,
          isUser: message.senderId === userInfo._id,
          avatar: message.senderId === userInfo._id ? userInfo.avatar : item.avatar,
        },
      ]);
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from WebSocket server');
    });

    return () => {
      socket.disconnect();
    };
  }, [item._id, socket, userInfo._id, userInfo.avatar, item.avatar]);

  const sendMessage = async () => {
    if (!text.trim()) {
      return;
    }

    const newMessage = {
      senderId: userInfo._id,
      receiverId: userGuestInfoID,
      text: text,
      connectionId: item._id
    };
    console.log("newMessage", newMessage);

    try {
      const response = await fetch(`${BASE_URL}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newMessage),
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(`Failed to send message: ${response.status} ${response.statusText} - ${errorMessage}`);
      }

      const savedMessage = await response.json();
      setMessages([...messages, {
        id: savedMessage._id,
        text: savedMessage.text,
        isUser: true,
        avatar: userInfo.avatar,
      }]);
      setText('');

      // Emit the message via WebSocket
      socket.emit('sendMessage', newMessage);

    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const renderItem: ListRenderItem<Message> = ({ item }) => (
    <View style={[styles.messageContainer, item.isUser ? styles.messageRight : styles.messageLeft]}>
      {!item.isUser && <Ionicons name="person-circle" size={20} color="black" />}
      <View style={[styles.messageBubble, item.isUser ? styles.bubbleRight : styles.bubbleLeft]}>
        <Text style={item.isUser ? styles.textRight : styles.textLeft}>{item.text} </Text>
      </View>
      {item.isUser && <Ionicons name="person-circle-outline" size={20} color="black" />}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {userInfo.role === "patient" &&
        <Text style={styles.headerText}>{item.caireGiverName}</Text>
      }
      {userInfo.role === "caireGiver" &&
        <Text style={styles.headerText}>{item.patientName}</Text>
      }
      </View>
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        style={styles.messagesList}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type a message"
          placeholderTextColor="black"
          value={text}
          onChangeText={setText}
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 10,
    backgroundColor: '#8356FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
  messagesList: {
    flex: 1,
    padding: 10,
  },
  messageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  messageLeft: {
    justifyContent: 'flex-start',
  },
  messageRight: {
    justifyContent: 'flex-end',
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 10,
    borderRadius: 15,
    marginHorizontal: 10,
  },
  bubbleLeft: {
    backgroundColor: '#e1e1e1',
  },
  bubbleRight: {
    backgroundColor: '#8356FF',
  },
  textLeft: {
    color: '#000',
  },
  textRight: {
    color: '#fff',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#eaeaea',
    padding: 10,
    backgroundColor: '#ffffff',
  },
  input: {
    color: 'black',
    flex: 1,
    height: 40,
    borderColor: '#eaeaea',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 15,
    marginRight: 10,
    backgroundColor: '#f9f9f9',
  },
  sendButton: {
    backgroundColor: '#8356FF',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default ChatScreen;
