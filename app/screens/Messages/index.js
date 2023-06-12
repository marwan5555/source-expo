import React, {useState, useEffect, useRef} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  FlatList,
  Dimensions,
  Alert,
} from 'react-native';
import {Icon} from 'react-native-elements';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';

export default function Messages({navigation}) {
  const [messages, setMessages] = useState([]);
  const [send, setSend] = useState(true);
  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const notificationListener = useRef();
  const responseListener = useRef();

 

  useEffect(() => {
    const intervalId = setInterval(() => {
      load();
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);
 
  const load = async () => {
    try {
      const uid = await AsyncStorage.getItem('uid');
      fetch('https://onetravel.click/admin/chat/chat.php?&uid=' + uid)
        .then(responses => responses.json())
        .then(datas => {
          setMessages(datas);
        })
        .catch(error =>
          Alert.alert('แจ้งเตือน!', 'ไม่มีการเชื่อมต่อเครือข่าย'),
        );
    } catch (error) {}
  };

  const sendMessage = async () => {
    try {
      const uid = await AsyncStorage.getItem('uid');
      console.log('uid: ' + uid);
      if (inputMessage.trim() === '') {
        setInputMessage('');
      } else {
        setSend(false);
        fetch('https://onetravel.click/admin/chat/send_chat.php', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            uid: uid,
            msg: inputMessage,
          }),
        })
          .then(response => response.json())
          .then(responseJson => {
            console.log(responseJson);
            if (responseJson === 'success') {
              setMessages([
                ...messages,
                {
                  sender: 'user',
                  message: inputMessage,
                },
              ]);
              setInputMessage('');
              setSend(true);

              // ส่งการแจ้งเตือนใหม่
              sendPushNotification(inputMessage);
            } else {
              Alert.alert(responseJson);
            }
          })
          .catch(error => {
            Alert.alert('แจ้งเตือน!', 'ไม่สามารถส่งข้อความได้ ' + error);
            console.log(error);
          });
      }
    } catch (err) {
      console.log(err);
    }
  };

  const sendPushNotification = async message => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'ข้อความใหม่',
        body: message,
      },
      trigger: null,
    });
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.container}>
        <FlatList
          style={{backgroundColor: '#f2f2ff'}}
          inverted={true}
          data={JSON.parse(JSON.stringify(messages)).reverse()}
          renderItem={({item}) => (
            <TouchableWithoutFeedback>
              <View style={{marginTop: 6}}>
                <View
                  style={{
                    maxWidth: Dimensions.get('screen').width * 0.8,
                    backgroundColor:
                      item.sender === 'user' ? '#4169E1' : '#999',
                    alignSelf:
                      item.sender === 'user' ? 'flex-end' : 'flex-start',
                    marginHorizontal: 10,
                    padding: 10,
                    borderRadius: 15,
                    borderBottomLeftRadius: item.sender === 'user' ? 15 : 0,
                    borderBottomRightRadius: item.sender === 'user' ? 0 : 15,
                  }}>
                  <Text
                    style={{
                      color: '#fff',
                      fontSize: 16,
                    }}>
                    {item.message}
                  </Text>
                  <Text
                    style={{
                      color: '#dfe4ea',
                      fontSize: 10,
                      alignSelf:
                        item.sender === 'user' ? 'flex-end' : 'flex-start',
                    }}>
                    {item.time}
                  </Text>
                </View>
              </View>
            </TouchableWithoutFeedback>
          )}
        />

        <View style={{paddingVertical: 10}}>
          <View style={styles.messageInputView}>
            <TextInput
              defaultValue={inputMessage}
              style={styles.messageInput}
              placeholder="พิมพ์ข้อความ..."
              onChangeText={text => setInputMessage(text)}
              onSubmitEditing={() => {
                sendMessage();
              }}
            />
            <TouchableOpacity
              style={styles.messageSendView}
              onPress={() => {
                send ? sendMessage() : null;
              }}>
              <Icon name="send" type="material" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  headerLeft: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  userProfileImage: {height: '100%', aspectRatio: 1, borderRadius: 100},
  container: {
    flex: 1,
    backgroundColor: '#f2f2ff',
  },
  messageInputView: {
    display: 'flex',
    flexDirection: 'row',
    marginHorizontal: 14,
    backgroundColor: '#fff',
    borderRadius: 4,
  },
  messageInput: {
    height: 40,
    flex: 1,
    paddingHorizontal: 10,
  },
  messageSendView: {
    paddingHorizontal: 10,
    justifyContent: 'center',
  },
});
