import React, {useState} from 'react';
import {
  View,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
  Alert,
  Button
} from 'react-native';
import {BaseStyle, BaseColor, useTheme} from '@config';
import {Header, SafeAreaView, TextInput, Icon, Text, } from '@components';
import {useTranslation} from 'react-i18next';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from "@react-native-async-storage/async-storage";
import styles from './styles';
import axios from 'axios';

export default function CheckOut({route, navigation}) {
  const [selectedImage, setSelectedImage] = useState(null);
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

  const selectImage = async () => {
    try {
      const {status} = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== 'granted') {
        console.error('Permission to access media library was denied');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync();

      if (!result.cancelled) {
        setSelectedImage(result.uri);
        uploadImage(result.uri);
      }
    } catch (error) {
      console.error('Error selecting image:', error);
    }
  };

  const uploadImage = async imageUri => {
    try {
      let uid = await AsyncStorage.getItem("uid");
      const formData = new FormData();
      formData.append('image', {
        uri: imageUri,
        name: 'image.jpg',
        type: 'image/jpeg',
      });
      formData.append('uid', uid);
      formData.append('hotel', route.params.name);
      formData.append('price', route.params.price);
      formData.append('check_in', route.params.check_in);
      formData.append('check_out', route.params.check_out);


      const response = await axios.post('https://onetravel.click/app/booking.php', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Image uploaded:', response.data);
      if(response.data.success ===true){
        onCheckOut()
      }else{
        Alert.alert('alert',response.data.success)
      }
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

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
              <Image
                source={require('../../assets/images/qr.jpg')}
                style={{width: 350, height: 350}}
              />
            </View>
            <Text style={{}}>฿ {route.params.price}</Text>
            <View
              style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
              {selectedImage && (
                <Image
                  source={{uri: selectedImage}}
                  style={{width: 200, height: 200, marginBottom: 20}}
                />
              )}
              <Button title="อัพโหลด" onPress={selectImage} />
            </View>
          </ScrollView>
          <View style={{paddingHorizontal: 20, paddingVertical: 15}}>
            
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}
