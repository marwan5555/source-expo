import React, {useState, useEffect} from 'react';
import {RefreshControl, FlatList, View,Image} from 'react-native';
import {BaseStyle, useTheme} from '@config';
import {useTranslation} from 'react-i18next';
import {Header, SafeAreaView, Icon, ListThumbCircle} from '@components';
import styles from './styles';
import {NotificationData} from '@data';

export default function Notification({navigation}) {
  const {t} = useTranslation();
  const {colors} = useTheme();

  const [refreshing, setRefreshing] = useState(false);
  const [notification, setNotification] = useState([]);

  const fetchData = async () => {
    try {
      const response = await fetch('https://onetravel.click/app/notifications.php');
      const data = await response.json();
      console.log(data);
      setNotification(data);
    } catch (error) {
      console.error(error);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

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
      <SafeAreaView style={BaseStyle.safeAreaView} edges={['right', 'left', 'bottom']}>
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
          data={notification}
          keyExtractor={(item) => item.id.toString()}
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

