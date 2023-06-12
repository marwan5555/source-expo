// import {RefreshControl, FlatList, View,Image} from 'react-native';
// import {BaseStyle, useTheme} from '@config';
// import {useTranslation} from 'react-i18next';
// import {Header, SafeAreaView, Icon, ListThumbCircle} from '@components';
// import styles from './styles';
// import {NotificationData} from '@data';

// export default function Notification({navigation}) {
//   const {t} = useTranslation();
//   const {colors} = useTheme();

//   const [refreshing, setRefreshing] = useState(false);
//   const [notification, setNotification] = useState([]);

//   const fetchData = async () => {
//     try {
//       const response = await fetch('https://onetravel.click/app/notifications.php');
//       const data = await response.json();
//       console.log(data);
//       setNotification(data);
//     } catch (error) {
//       console.error(error);
//     } finally {
//       setRefreshing(false);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const onRefresh = () => {
//     setRefreshing(true);
//     fetchData();
//   };

//   return (
//     <View style={{flex: 1}}>
//       <Header
//         title={t('notification')}
//         renderLeft={() => {
//           return (
//             <Icon
//               name="arrow-left"
//               size={20}
//               color={colors.primary}
//               enableRTL={true}
//             />
//           );
//         }}
//         onPressLeft={() => {
//           navigation.goBack();
//         }}
//       />
//       <SafeAreaView style={BaseStyle.safeAreaView} edges={['right', 'left', 'bottom']}>
//         <FlatList
//           contentContainerStyle={{paddingHorizontal: 20, paddingVertical: 10}}
//           refreshControl={
//             <RefreshControl
//               colors={[colors.primary]}
//               tintColor={colors.primary}
//               refreshing={refreshing}
//               onRefresh={onRefresh}
//             />
//           }
//           data={notification}
//           keyExtractor={(item) => item.id.toString()}
//           renderItem={({item}) => (
//             <ListThumbCircle
//               image={item.image_path}
//               txtLeftTitle={item.title}
//               txtContent={item.description}
//               txtRight={item.notification_date}
//               style={{marginBottom: 5}}
//             />
//           )}
//         />
//       </SafeAreaView>
//     </View>
//   );
// }

import React, {useEffect, useState, useRef} from 'react';
import {RefreshControl, FlatList, View, Image, Platform} from 'react-native';
import {BaseStyle, useTheme} from '@config';
import {useTranslation} from 'react-i18next';
import {Header, SafeAreaView, Icon, ListThumbCircle} from '@components';
import styles from './styles';
import {NotificationData} from '@data';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export default function Notification({navigation}) {
  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();
  const {t} = useTranslation();
  const {colors} = useTheme();

  const [refreshing, setRefreshing] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const fetchData = async () => {
    try {
      const response = await fetch(
        'https://onetravel.click/app/notifications.php',
      );
      const data = await response.json();
      console.log(data);
      setNotifications(data);
    } catch (error) {
      console.error(error);
    } finally {
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  useEffect(() => {
    registerForPushNotificationsAsync().then(token => {
      setExpoPushToken(token);
      notis(token);
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

  const notis = async a => {
    const uid = await AsyncStorage.getItem('uid');

    axios
      .post('https://onetravel.click/app/notification.php', {
        uid: uid,
        token: a,
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
    let experienceId = '@onejs/BanPhukhaoThong';
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

  useEffect(() => {
    fetchData();
  }, []);

  console.log('tt:' + expoPushToken);

  return (
    <View style={{flex: 1}}>
      <Header
        title={t('notification')}
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
        <FlatList
          contentContainerStyle={{paddingHorizontal: 20, paddingVertical: 10}}
          refreshControl={
            <RefreshControl
              colors={[colors.primary]}
              tintColor={colors.primary}
              refreshing={refreshing}
              onRefresh={onRefresh}
            />
          }
          data={notifications}
          keyExtractor={item => item.id.toString()}
          renderItem={({item}) => (
            <ListThumbCircle
              image={item.image_path}
              txtLeftTitle={item.title}
              txtContent={item.description}
              txtRight={item.notification_date}
              style={{marginBottom: 5}}
            />
          )}
        />
      </SafeAreaView>
    </View>
  );
}

async function schedulePushNotification() {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "You've got mail! 📬",
      body: 'Here is the notification body',
      data: {data: 'goes here'},
    },
    trigger: {seconds: 2},
  });
}
