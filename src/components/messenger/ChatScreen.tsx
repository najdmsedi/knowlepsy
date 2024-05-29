import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, ListRenderItem } from 'react-native';
import { Avatar } from 'react-native-paper';

type Message = {
  id: string;
  text: string;
  isUser: boolean;
  avatar: string;
};

const sampleMessages: Message[] = [
  {
    id: '1',
    text: 'Hello there!',
    isUser: false,
    avatar: 'https://placeimg.com/140/140/any',
  },
  {
    id: '2',
    text: 'Hi! How are you?',
    isUser: true,
    avatar: 'https://placeimg.com/140/140/any',
  },
  {
    id: '3',
    text: 'I am good, thank you!',
    isUser: false,
    avatar: 'https://placeimg.com/140/140/any',
  },
  {
    id: '4',
    text: 'Hello there!',
    isUser: false,
    avatar: 'https://placeimg.com/140/140/any',
  },
  {
    id: '5',
    text: 'Hi! How are you?',
    isUser: true,
    avatar: 'https://placeimg.com/140/140/any',
  },
  {
    id: '6',
    text: 'I am good, thank you!',
    isUser: false,
    avatar: 'https://placeimg.com/140/140/any',
  },
  {
    id: '7',
    text: 'Hello there!',
    isUser: false,
    avatar: 'https://placeimg.com/140/140/any',
  },
  {
    id: '8',
    text: 'Hi! How are you?',
    isUser: true,
    avatar: 'https://placeimg.com/140/140/any',
  },
  {
    id: '9',
    text: 'I am good, thank you!',
    isUser: false,
    avatar: 'https://placeimg.com/140/140/any',
  },
  {
    id: '10',
    text: 'Hello there!',
    isUser: false,
    avatar: 'https://placeimg.com/140/140/any',
  },
  {
    id: '11',
    text: 'Hi! How are you?',
    isUser: true,
    avatar: 'https://placeimg.com/140/140/any',
  },
  {
    id: '12',
    text: 'I am good, thank you!',
    isUser: false,
    avatar: 'https://placeimg.com/140/140/any',
  },
  {
    id: '13',
    text: 'Hello there!',
    isUser: false,
    avatar: 'https://placeimg.com/140/140/any',
  },
  {
    id: '14',
    text: 'Hi! How are you?',
    isUser: true,
    avatar: 'https://placeimg.com/140/140/any',
  },
  {
    id: '15',
    text: 'I am good, thank you!',
    isUser: false,
    avatar: 'https://placeimg.com/140/140/any',
  },
  {
    id: '16',
    text: 'Hello there!',
    isUser: false,
    avatar: 'https://placeimg.com/140/140/any',
  },
  {
    id: '17',
    text: 'Hi! How are you?',
    isUser: true,
    avatar: 'https://placeimg.com/140/140/any',
  },
  {
    id: '18',
    text: 'I am good, thank you!',
    isUser: false,
    avatar: 'https://placeimg.com/140/140/any',
  },
];

const ChatScreen = () => {
  const flatListRef = useRef<FlatList<Message>>(null);

  useEffect(() => {
    if (flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, []);

  const renderItem: ListRenderItem<Message> = ({ item }) => (
    <View style={[styles.messageContainer, item.isUser ? styles.messageRight : styles.messageLeft]}>
      {!item.isUser && <Avatar.Image size={36} source={{ uri: item.avatar }} />}
      <View style={[styles.messageBubble, item.isUser ? styles.bubbleRight : styles.bubbleLeft]}>
        <Text style={item.isUser ? styles.textRight : styles.textLeft}>{item.text}</Text>
      </View>
      {item.isUser && <Avatar.Image size={36} source={{ uri: item.avatar }} />}
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={sampleMessages}
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
        />
        <TouchableOpacity style={styles.sendButton}>
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
    backgroundColor: '#0084ff',
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
