import React, { useState } from 'react';
import { View, KeyboardAvoidingView, Platform, Alert, TouchableOpacity } from 'react-native';
import { BaseStyle, useTheme } from '@config';
import { Header, SafeAreaView, Icon, Button, TextInput } from '@components';
import styles from './styles';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

export default function SignUp({ navigation }) {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const offsetKeyboard = Platform.select({
    ios: 0,
    android: 20,
  });

  const [password, setPassword] = useState('');
  const [password1, setPassword1] = useState('');
  const [name, setname] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState({
    password: true,
    email: true,
    name: true,
    phone: true,
    password1: true,
  });
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [password1Visible, setPassword1Visible] = useState(false);

  const onSignUp = () => {
    if (
      password == '' ||
      email == '' ||
      name == '' ||
      password1 == '' ||
      phone == '' ||
      password != password1
    ) {
      setSuccess({
        ...success,
        password: password != '' ? true : false,
        password1: password1 != '' ? true : false,
        email: email != '' ? true : false,
        name: name != '' ? true : false,
        phone: phone != '' ? true : false,
      });
      if (password !== password1) {
        Alert.alert('รหัสผ่านไม่ตรงกัน', 'โปรดกรอกรหัสผ่านให้ตรงกัน');
      }
    } else {
      setLoading(true);
      // Send a POST request to your API endpoint
      axios
        .post('https://onetravel.click/app/register.php', {
          password: password,
          email: email,
          name: name,
        })
        .then(response => {
          console.log(response.data);
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
        .catch(error => {
          // Handle server errors here
          setLoading(false);
          Alert.alert('มีข้อผิดพลาดเกิดขึ้นโปรดลองอีกครั้ง.');
          console.error(error);
          console.log(error.response);
        });
    }
  };

  return (
    <View style={{ flex: 1 }}>
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
        edges={['right', 'left', 'bottom']}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'android' ? 'height' : 'padding'}
          keyboardVerticalOffset={offsetKeyboard}
          style={{ flex: 1 }}
        >
          <View style={styles.contain}>
            <TextInput
              style={{ marginTop: 10 }}
              onChangeText={text => setname(text)}
              placeholder={t('input_name')}
              success={success.name}
              value={name}
            />
            <TextInput
              style={{ marginTop: 10 }}
              onChangeText={text => setPhone(text)}
              placeholder={t('เบอร์โทรศัพท์')}
              keyboardType="phone-pad"
              success={success.phone}
              value={phone}
              maxLength={10}
            />
            <TextInput
              style={{ marginTop: 10 }}
              onChangeText={text => setEmail(text)}
              placeholder={t('input_email')}
              keyboardType="email-address"
              success={success.email}
              value={email}
            />
            <TextInput
              style={{ marginTop: 10 }}
              onChangeText={text => setPassword(text)}
              onFocus={() => {
                setSuccess({
                  ...success,
                  password: true,
                });
              }}
              placeholder={t('ใช้ตัวเลข ตัวอักษร สัญลักษณ์ กรอบรหัสผ่าน6 ตัวขึ้นไป')}
              secureTextEntry={!passwordVisible}
              success={success.password}
              value={password}
              rightIcon={
                <TouchableOpacity
                  onPress={() => setPasswordVisible(!passwordVisible)}
                >
                  <Icon
                    name={passwordVisible ? 'eye' : 'eye-slash'}
                    size={20}
                    color={colors.text}
                  />
                </TouchableOpacity>
              }
            />
            <TextInput
              style={{ marginTop: 10 }}
              onChangeText={text => setPassword1(text)}
              onFocus={() => {
                setSuccess({
                  ...success,
                  password1: true,
                });
              }}
              placeholder={t('ยืนยันรหัสผ่าน')}
              secureTextEntry={!password1Visible}
              success={success.password1}
              value={password1}
              rightIcon={
                <TouchableOpacity
                  onPress={() => setPassword1Visible(!password1Visible)}
                >
                  <Icon
                    name={password1Visible ? 'eye' : 'eye-slash'}
                    size={20}
                    color={colors.text}
                  />
                </TouchableOpacity>
              }
            />
            <Button
              full
              style={{ marginTop: 20 }}
              loading={loading}
              onPress={() => onSignUp()}
            >
              {t('sign_up')}
            </Button>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}
