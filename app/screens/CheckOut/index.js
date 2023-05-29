import React, {useState} from 'react';
import {View, KeyboardAvoidingView, Platform, ScrollView,Image} from 'react-native';
import {BaseStyle, BaseColor, useTheme} from '@config';
import {Header, SafeAreaView, TextInput, Icon, Text, Button} from '@components';
import {useTranslation} from 'react-i18next';
import styles from './styles';

export default function CheckOut({route, navigation}) {
  const {colors} = useTheme();
  const {t} = useTranslation();
  const offsetKeyboard = Platform.select({
    ios: 0,
    android: 20,
  });

  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [postCode, setPostCode] = useState('');
  const [country, setCountry] = useState('');
  const [contactName, setContactName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [success] = useState({
    street: true,
    city: true,
    postCode: true,
    country: true,
    contactName: true,
    email: true,
    phone: true,
  });

  /**
   *
   * Called when process checkout
   */
  const onCheckOut = () => {
    const bookingType = route.params?.bookingType;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      switch (bookingType) {
        case 'Event':
          navigation.navigate('EventTicket');
          break;
        case 'Bus':
          navigation.navigate('BusTicket');
          break;
        default:
          navigation.navigate('BookingDetail');
          break;
      }
    }, 500);
  };

  return (
    <View style={{flex: 1}}>
      <Header
        title={t('check_out')}
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
        onPressRight={() => {}}
      />
      <SafeAreaView
        style={BaseStyle.safeAreaView}
        edges={['right', 'left', 'bottom']}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'android' ? 'height' : 'padding'}
          keyboardVerticalOffset={offsetKeyboard}
          style={{flex: 1}}>
          <ScrollView contentContainerStyle={{paddingHorizontal: 20}}>
            <View style={{flexDirection: 'row', marginTop: 10}}>
              
              <Image source={require('../../assets/images/qr.jpg')} 
              style={{width:350,height:350}} />
            
            </View>
          </ScrollView>
          <View style={{paddingHorizontal: 20, paddingVertical: 15}}>
            <Button
              loading={loading}
              full
              onPress={() => {
                onCheckOut();
              }}>
              {t('check_out')}
            </Button>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}
