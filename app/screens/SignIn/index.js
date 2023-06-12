import React, {useState, useEffect, useRef} from 'react';
import {useDispatch} from 'react-redux';
import {AuthActions} from '@actions';
import {
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import {BaseStyle, useTheme} from '@config';
import {Header, SafeAreaView, Icon, Text, Button, TextInput} from '@components';
import styles from './styles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useTranslation} from 'react-i18next';
import * as Notifications from 'expo-notifications';
import axios from 'axios';
import Constants from 'expo-constants';

export default function SignIn({navigation}) {
  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();
  const {colors} = useTheme();
  const {t} = useTranslation();
  const dispatch = useDispatch();
  const offsetKeyboard = Platform.select({
    ios: 0,
    android: 20,
  });

  const [email, setemail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState({email: true, password: true});

  /**
   * call when action login
   *
   */
  const onLogin = () => {
    if (email == '' || password == '') {
      setSuccess({
        ...success,
        email: false,
        password: false,
      });
    } else {
      setLoading(true);
      axios
        .post('https://onetravel.click/app/login.php', {
          email: email,
          password: password,
        })
        .then(
          response => {
            console.log(response);
            // Handle the response from the server
            if (response.data.result === 'success') {
              AsyncStorage.setItem('uid', response.data.user.id);
              notis(response.data.user.id);
              // Login successful
              dispatch(
                AuthActions.authentication(true, response => {
                  setLoading(false);
                  navigation.goBack();
                }),
              );
            } else if (response.data.error === 'Invalid password') {
              // Handle invalid password here
              alert('Invalid password');
              setLoading(false);
            } else {
              // Handle other errors here
              Alert.alert('แจ้งเตือน', response.data.result);
              setLoading(false);
              // Display error message here
            }
          },
          error => {
            console.log(error);
            setLoading(false);
            // Handle server errors here
          },
        );
    }
  };

  useEffect(() => {
    registerForPushNotificationsAsync().then(token => {
      setExpoPushToken(token);
      //notis(token,response.data.user.id);
    });

    notificationListener.current =
      Notifications.addNotificationReceivedListener(notification => {
        setNotification(notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener(response => {
        console.log(response);
      });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener);
      Notifications.removeNotificationSubscription(responseListener);
    };
  }, []);

  const notis = async uid => {
    axios
      .post('https://onetravel.click/app/notification.php', {
        uid: uid,
        token: expoPushToken,
      })
      .then(
        response => {
          console.log(response);
          // Handle the response from the server
        },
        error => {},
      );
  };

  async function registerForPushNotificationsAsync() {
    let token;
    let experienceId = undefined;
    if (!Constants.manifest) {
      experienceId = '@onejs/BanPhukhaoThong';
    }
    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }
    token = (await Notifications.getExpoPushTokenAsync({experienceId})).data;
    return token;
  }

  console.log('token: ' + expoPushToken);

  return (
    <View style={{flex: 1}}>
      <Header
        title={t('sign_in')}
        renderLeft={() => {
          return (
            <Icon
              name="arrow-left"
              size={20}
              color={colors.primary}
              enableRTL={true}
            />
          );
        }}
        onPressLeft={() => {
          navigation.goBack();
        }}
      />
      <SafeAreaView
        style={BaseStyle.safeAreaView}
        edges={['right', 'left', 'bottom']}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'android' ? 'height' : 'padding'}
          keyboardVerticalOffset={offsetKeyboard}
          style={{flex: 1}}>
          <View style={styles.contain}>
            <TextInput
              onChangeText={text => setemail(text)}
              onFocus={() => {
                setSuccess({
                  ...success,
                  email: true,
                });
              }}
              placeholder={t('อีเมล์')}
              success={success.email}
              value={email}
            />
            <TextInput
              style={{marginTop: 10}}
              onChangeText={text => setPassword(text)}
              onFocus={() => {
                setSuccess({
                  ...success,
                  password: true,
                });
              }}
              placeholder={t('รหัสผ่าน')}
              secureTextEntry={true}
              success={success.password}
              value={password}
            />
            <Button
              style={{marginTop: 20}}
              full
              loading={loading}
              onPress={() => {
                onLogin();
              }}>
              {t('sign_in')}
            </Button>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}
