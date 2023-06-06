import React, { useState, useEffect } from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { BaseStyle, Images, useTheme } from '@config';
import { Header, SafeAreaView, Icon, Image, Text, TextInput } from '@components';
import styles from './styles';
import { useTranslation } from 'react-i18next';
import io from 'socket.io-client'; // Import socket.io-client

export default function Messages() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const offsetKeyboard = Platform.select({
    ios: 0,
    android: 20,
  });
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    // Connect to Socket.io server
    const newSocket = io('http://your-socket-server-url');

    newSocket.on('connect', () => {
      console.log('Connected to Socket.io server');
    });

    newSocket.on('disconnect', () => {
      console.log('Disconnected from Socket.io server');
    });

    newSocket.on('receiveMessage', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    setSocket(newSocket);

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, []);

  const sendMessage = () => {
    if (socket && input.trim() !== '') {
      const message = {
        id: Math.random().toString(),
        message: input,
        created: new Date().toLocaleTimeString(),
      };

      socket.emit('sendMessage', message);

      setMessages((prevMessages) => [...prevMessages, message]);

      setInput('');
    }
  };

  const renderItem = ({item}) => {
    if (item.user) {
      return (
        <View style={styles.userContent}>
          <Image
            source={item.user.avatar}
            style={[styles.avatar, {borderColor: colors.border}]}
          />
          <View style={{paddingHorizontal: 8, flex: 7}}>
            <Text caption1>{item.user.name}</Text>
            <View
              style={[
                styles.userContentMessage,
                {backgroundColor: colors.primaryLight},
              ]}>
              <Text body2 whiteColor>
                {item.message}
              </Text>
            </View>
          </View>
          <View style={styles.userContentDate}>
            <Text footnote numberOfLines={1}>
              {item.created}
            </Text>
          </View>
        </View>
      );
    }

    return (
      <View style={styles.meContent}>
        <View style={styles.meContentDate}>
          <Text footnote numberOfLines={1}>
            {item.created}
          </Text>
        </View>
        <View style={{paddingLeft: 8, flex: 7}}>
          <View
            style={[styles.meContentMessage, {backgroundColor: colors.card}]}>
            <Text body2>{item.message}</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={{flex: 1}}>
      <Header title={t('messages')} />
      <SafeAreaView
        style={BaseStyle.safeAreaView}
        edges={['right', 'left', 'bottom']}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'android' ? 'height' : 'padding'}
          keyboardVerticalOffset={offsetKeyboard}
          style={{flex: 1}}>
          <View style={{flex: 1}}>
            <FlatList
              data={messages}
              keyExtractor={(item) => item.id}
              renderItem={renderItem}
            />
          </View>
          <View style={styles.inputContent}>
            <View style={{flex: 1}}>
              <TextInput
                style={styles.input}
                placeholder={t('type_message')}
                onChangeText={setInput}
                value={input}
                onSubmitEditing={sendMessage}
              />
            </View>
            <TouchableOpacity
              style={[styles.sendIcon, {backgroundColor: colors.primary}]}
              onPress={sendMessage}>
              <Icon
                name="paper-plane"
                size={20}
                color="white"
                enableRTL={true}
              />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}
