import React, {useState} from 'react';
import {FlatList, RefreshControl, View, TouchableOpacity} from 'react-native';
import {BaseStyle, useTheme} from '@config';
import {Header, SafeAreaView, Icon, Text} from '@components';
import styles from './styles';
import {useTranslation} from 'react-i18next';

export default function More({navigation}) {
  const {colors} = useTheme();
  const {t} = useTranslation();

  const [refreshing] = useState(false);
  const [screen] = useState([
    {
      screen: 'Review',
      icon: 'comments',
      title: 'รีวิว',
    },
    {
      screen: 'Notification',
      icon: 'paper-plane',
      title: 'แจ้งเตือน',
    },
    {
      screen: 'Messages',
      icon: 'comment',
      title: 'ข้อความ',
    },
  ]);

  return (
    <View style={{flex: 1}}>
      <Header
        title={t('more')}
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
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingBottom: 10,
          }}
          refreshControl={
            <RefreshControl
              colors={[colors.primary]}
              tintColor={colors.primary}
              refreshing={refreshing}
              onRefresh={() => {}}
            />
          }
          data={screen}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item, index}) => (
            <TouchableOpacity
              style={[styles.item, {borderBottomColor: colors.border}]}
              onPress={() => navigation.navigate(item.screen)}>
              <View style={{flexDirection: 'row'}}>
                <Icon
                  name={item.icon}
                  color={colors.primary}
                  size={18}
                  solid
                  style={{marginHorizontal: 10}}
                />
                <Text body1>{item.title}</Text>
              </View>
              <Icon
                name="angle-right"
                size={18}
                color={colors.primary}
                enableRTL={true}
              />
            </TouchableOpacity>
          )}
        />
      </SafeAreaView>
    </View>
  );
}
