import React from 'react';
import {View, ScrollView} from 'react-native';
import {BaseStyle, BaseColor, useTheme} from '@config';
import {Header, SafeAreaView, Icon, Text, Button} from '@components';
import styles from './styles';
import {useTranslation} from 'react-i18next';

export default function PreviewBooking({navigation,route}) {
  const {t} = useTranslation();
  const {colors} = useTheme();

  return (
    <View style={{flex: 1}}>
      <Header
        title={t('preview_booking')}
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
        <ScrollView>
          <View style={{paddingHorizontal: 20}}>
            <View
              style={[styles.blockView, {borderBottomColor: colors.border}]}>
              <Text body2 style={{marginBottom: 10}}>
                {t('hotels')}
              </Text>
              <Text body1 semibold>
                {route.params.name}
              </Text>
            </View>
            <View
              style={[styles.blockView, {borderBottomColor: colors.border}]}>
              <View style={{flexDirection: 'row', marginTop: 10}}>
                <View style={{flex: 1}}>
                  <Text body2>{t('check_in')}</Text>
                </View>
                <View style={{flex: 1, alignItems: 'flex-end'}}>
                  <Text body2 semibold>
                    {route.params.check_in}
                  </Text>
                
                </View>
              </View>
              <View style={{flexDirection: 'row', marginTop: 10}}>
                <View style={{flex: 1}}>
                  <Text body2>{t('check_out')}</Text>
                </View>
                <View style={{flex: 1, alignItems: 'flex-end'}}>
                  <Text body2 semibold>
                  {route.params.check_out}
                  </Text>
                  
                </View>
              </View>
              <View style={{flexDirection: 'row', marginTop: 10}}>
                <View style={{flex: 1}}>
                  <Text body2>{t('duration')}</Text>
                </View>
                <View style={{flex: 1, alignItems: 'flex-end'}}>
                  <Text body2 semibold>
                  {route.params.days}
                  </Text>
                </View>
              </View>
            </View>
            <View
              style={[styles.blockView, {borderBottomColor: colors.border}]}>
              <Text body2 style={{marginBottom: 10}}>
                {t('room')}
              </Text>
              <Text body1 semibold style={{marginBottom: 5}}>
              {route.params.available}
              </Text>
              <Text body2 style={{marginBottom: 5}}>
              {route.params.details}              
              </Text>
            </View>
          </View>
        </ScrollView>
        <View
          style={[styles.contentButtonBottom, {borderTopColor: colors.border}]}>
          <View>
           
            <Text title3 primaryColor semibold>
             ฿ {route.params.price}
            </Text>
          </View>
          <Button onPress={() => navigation.navigate('CheckOut',{id:route.params.id,name:route.params.name,location:route.params.location,image:route.params.image_path,price:route.params.price,check_in:route.params.check_in,check_out:route.params.check_out,days:route.params.days,details:route.params.details})}>
            {t('continue')}
          </Button>
        </View>
      </SafeAreaView>
    </View>
  );
}
