import React, {useState} from 'react';
import {View, KeyboardAvoidingView, Platform,Alert} from 'react-native';
import {BaseStyle, useTheme} from '@config';
import {Header, SafeAreaView, Icon, Button, TextInput} from '@components';
import styles from './styles';
import {useTranslation} from 'react-i18next';
import axios from 'axios';

export default function SignUp({navigation}) {
  const {colors} = useTheme();
  const {t} = useTranslation();
  const offsetKeyboard = Platform.select({
    ios: 0,
    android: 20,
  });

  const [password, setPassword] = useState('');
  const [name, setname] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState({
    password: true,
    email: true,
    name:true
  });
  const onSignUp = () => {
    if (password == '' || email == '' || name == '') {
      setSuccess({
        ...success,
        password: password != '' ? true : false,
        email: email != '' ? true : false,
        name: name != '' ? true : false,
      });
    } else {
      setLoading(true);
      // Send a POST request to your API endpoint
      axios
        .post('https://onetravel.click/app/register.php', {
          password: password,
          email: email,
          name: name,
        })
        .then((response) => {
          console.log(response.data)
          // Handle the response from the server
          // If the signup was successful, navigate the user back
          if (response.data === 'success') {
            setLoading(false);
            navigation.goBack();
            Alert.alert('สมัครสำเร็จ', response.data);
          } else {
            // Handle unsuccessful signup here
            setLoading(false);
            // Display error message here
            Alert.alert('สมัครสมาชิกล้มเหลว', response.data);
          }
        })
        .catch((error) => {
          // Handle server errors here
          setLoading(false);
          Alert.alert('มีข้อผิดพลาดเกิดขึ้นโปรดลองอีกครั้ง.');
          console.error(error);
          console.log(error.response);
        });
    }
  };
  

  return (
    <View style={{flex: 1}}>
      <Header
        title={t('sign_up')}
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
            style={{marginTop: 10}}
            onChangeText={text => setname(text)}
            placeholder={t('input_name')}
            success={success.name}
            value={name}
            />
            <TextInput
            style={{marginTop: 10}}
            onChangeText={text => setEmail(text)}
            placeholder={t('input_email')}
            keyboardType="email-address"
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
              placeholder={t('input_password')}
              secureTextEntry={true}
              success={success.password}
              value={password}
            />
            <Button
              full
              style={{marginTop: 20}}
              loading={loading}
              onPress={() => onSignUp()}>
              {t('sign_up')}
            </Button>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}
