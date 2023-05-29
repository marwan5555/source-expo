import React, {useState} from 'react';
import {
  View,
  ScrollView,
  FlatList,
  Animated,
  TouchableOpacity,
} from 'react-native';
import {BaseColor, Images, useTheme} from '@config';
import {
  Header,
  SafeAreaView,
  Icon,
  Text,
  ProfileGroup,
  Tag,
  Image,
  Button,
  EventCard,
} from '@components';
import {useTranslation} from 'react-i18next';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';
import * as Utils from '@utils';
import styles from './styles';

export default function EventDetail({navigation,route}) {
  const deltaY = new Animated.Value(0);
  const heightImageBanner = Utils.scaleWithPixel(250, 1);
  const {colors} = useTheme();
  const {t} = useTranslation();

  const [heightHeader, setHeightHeader] = useState(Utils.heightHeader());

  return (
    <View style={{flex: 1}}>
      <Animated.View
        style={[
          styles.imgBanner,
          {
            height: deltaY.interpolate({
              inputRange: [
                0,
                Utils.scaleWithPixel(140),
                Utils.scaleWithPixel(140),
              ],
              outputRange: [heightImageBanner, heightHeader, heightHeader],
            }),
          },
        ]}>
        <Image source={{uri:route.params.image}} style={{flex: 1}} />
        <Animated.View
          style={{
            position: 'absolute',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            paddingHorizontal: 20,
            width: '100%',
            bottom: 15,
            opacity: deltaY.interpolate({
              inputRange: [
                0,
                Utils.scaleWithPixel(140),
                Utils.scaleWithPixel(140),
              ],
              outputRange: [1, 0, 0],
            }),
          }}>
    
        </Animated.View>
      </Animated.View>
      {/* Header */}
      <Header
        title=""
        renderLeft={() => {
          return (
            <Icon
              name="arrow-left"
              size={20}
              color={BaseColor.whiteColor}
              enableRTL={true}
            />
          );
        }}
        // renderRight={() => {
        //   return <Icon name="images" size={20} color={BaseColor.whiteColor} />;
        // }}
        onPressLeft={() => {
          navigation.goBack();
        }}
        // onPressRight={() => {
        //   navigation.navigate('PreviewImage');
        // }}
      />
      <SafeAreaView style={{flex: 1}} edges={['right', 'left', 'bottom']}>
        <ScrollView
          onScroll={Animated.event([
            {
              nativeEvent: {
                contentOffset: {y: deltaY},
              },
            },
          ])}
          onContentSizeChange={() => {
            setHeightHeader(Utils.heightHeader());
          }}
          scrollEventThrottle={8}>
          <View style={{height: 255 - heightHeader}} />
          <View
            style={{
              paddingHorizontal: 20,
              marginBottom: 20,
            }}>
            <Text title1 semibold numberOfLines={1} style={{marginBottom: 10}}>
              {route.params.title}
            </Text>
           
            <Text body2 semibold style={{marginTop: 10}}>
              {t('date_time')}
            </Text>
            <Text body2 grayColor style={{marginTop: 10, marginBottom: 20}}>
              {route.params.time}
            </Text>
            <Text body2 semibold>
              {t('address')}
            </Text>
            <Text body2 grayColor style={{marginVertical: 10}}>
              {route.params.location}
            </Text>
            
            <Text body2 semibold style={{marginTop: 20, marginBottom: 10}}>
              {t('description')}
            </Text>
            <Text body2 grayColor lineHeight={20}>
             {route.params.subtitle}
            </Text>
          </View>
          
          
        </ScrollView>
        {/* Pricing & Booking Process */}
      </SafeAreaView>
    </View>
  );
}
