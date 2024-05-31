import React, { useState, useEffect, useRef, useCallback, useContext } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, ListRenderItem } from 'react-native';
import { Avatar } from 'react-native-paper';
import { useIsFocused } from '@react-navigation/native';
import { BASE_URL } from '../../config';
import { AuthContext } from '../../context/AuthContext';
import Ionicons from 'react-native-vector-icons/Ionicons';

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

const ChatScreen = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState('');
  const flatListRef = useRef<FlatList<Message>>(null);
  const isFocused = useIsFocused();
  const { userInfo } = useContext(AuthContext);
  const { userGuestInfo } = useContext(AuthContext);
  let userGuestInfoID = "";
  let userAvatar = "";
  let otherUserAvatar = "";
  const fetchMessages = useCallback(async () => {
    try {
      const response = await fetch(`${BASE_URL}/messages/${userInfo._id}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch messages: ${response.statusText}`);
      }
      const data = await response.json();
      const formattedMessages = data.map((msg: any) => ({
        id: msg._id,
        text: msg.text,
        isUser: msg.senderId === userInfo._id,
        avatar: msg.senderId === userInfo._id ? userAvatar : otherUserAvatar,
      }));
      setMessages(formattedMessages);
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    }
  }, [userInfo._id, userAvatar, otherUserAvatar]);

  useEffect(() => {
    if (isFocused) {
      fetchMessages();
    }
  }, [isFocused, fetchMessages]);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchMessages();
    }, 5000);

    return () => clearInterval(interval);
  }, [fetchMessages]);

  useEffect(() => {
    if (flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!text.trim()) {
      return;
    }
    if (userInfo.role === "patient") {
      userGuestInfoID = userGuestInfo.user._id;
    } else if (userInfo.role === "doctor") {
      userGuestInfoID = userGuestInfo._id;
    }

    const newMessage = {
      senderId: userInfo._id,
      receiverId: userGuestInfoID,
      text: text,
    };

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
        avatar: userAvatar,
      }]);
      setText('');
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const renderItem: ListRenderItem<Message> = ({ item }) => (
    <View style={[styles.messageContainer, item.isUser ? styles.messageRight : styles.messageLeft]}>
      {!item.isUser &&
        // <Avatar.Image size={36} source={{ uri: item.avatar || defaultAvatar }} />
        <Ionicons name="person-circle" size={20} color="black" />

      }
      <View style={[styles.messageBubble, item.isUser ? styles.bubbleRight : styles.bubbleLeft]}>
        <Text style={item.isUser ? styles.textRight : styles.textLeft}>{item.text} </Text>
      </View>
      {item.isUser &&
        // <Avatar.Image size={36} source={{ uri: item.avatar || defaultAvatar }} />
        <Ionicons name="person-circle-outline" size={20} color="black" />

      }
    </View>
  );

  return (
    <View style={styles.container}>
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
