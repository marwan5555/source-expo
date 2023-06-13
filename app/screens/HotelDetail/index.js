import React, {useState, useEffect} from 'react';
import {View, ScrollView, Animated, Image} from 'react-native';
import {BaseColor, useTheme} from '@config';
import {
  Header,
  SafeAreaView,
  Icon,
  Text,
  StarRating,
  Button,
} from '@components';
import * as Utils from '@utils';
import styles from './styles';
import {useTranslation} from 'react-i18next';

export default function HotelDetail({navigation, route}) {
  const {colors} = useTheme();
  const {t} = useTranslation();

  const [heightHeader, setHeightHeader] = useState(Utils.heightHeader());
  const [region] = useState({
    latitude: 1.9344,
    longitude: 103.358727,
    latitudeDelta: 0.05,
    longitudeDelta: 0.004,
  });

  const deltaY = new Animated.Value(0);

  useEffect(() => {
    Animated.timing(deltaY, {
      toValue: 200,
      useNativeDriver: false,
    }).start();
  }, []);

  const heightImageBanner = Utils.scaleWithPixel(250);
  const marginTopBanner = heightImageBanner - heightHeader - 40;

  const handleScroll = event => {
    const offsetY = event.nativeEvent.contentOffset.y;
    deltaY.setValue(offsetY);
  };

  return (
    <View style={{flex: 1}}>
      <Image
        source={{uri: route.params?.image || ''}}
        style={[styles.imgBanner]}
      />
      <Header
        title={t('')}
        renderLeft={() => (
          <Icon
            name="arrow-left"
            size={20}
            color={BaseColor.whiteColor}
            enableRTL={true}
          />
        )}
        onPressLeft={() => navigation.goBack()}
      />
      <SafeAreaView style={{flex: 1}} edges={['right', 'left', 'bottom']}>
        <ScrollView
          onScroll={handleScroll}
          onContentSizeChange={() => setHeightHeader(Utils.heightHeader())}
          scrollEventThrottle={16}>
          <View style={{paddingHorizontal: 20}}>
            <View
              style={[
                styles.contentBoxTop,
                {
                  marginTop: marginTopBanner,
                  backgroundColor: colors.card,
                  shadowColor: colors.border,
                  borderColor: colors.border,
                },
              ]}>
              <Text title2 semibold style={{marginBottom: 5}}>
                {route.params?.name}
              </Text>
              <StarRating
                disabled={true}
                starSize={14}
                maxStars={5}
                rating={4.5}
                selectedStar={rating => {}}
                fullStarColor={BaseColor.yellowColor}
              />
              <Text body2 style={{marginTop: 5, textAlign: 'center'}}>
                {route.params?.details}
              </Text>
            </View>
            <View
              style={[styles.blockView, {borderBottomColor: colors.border}]}>
              <Text headline semibold>
                {t('hotel_description')}
              </Text>
              <Text body2 style={{marginTop: 5}}>
                {route.params?.details}
              </Text>
            </View>
            <View
              style={[styles.blockView, {borderBottomColor: colors.border}]}>
              <Text headline semibold>
                {t('good_to_know')}
              </Text>
              <View style={{flexDirection: 'row', marginTop: 5}}>
                <View style={{flex: 1, justifyContent: 'center'}}>
                  <Text body2 grayColor>
                    {t('check_in_from')}
                  </Text>
                  <Text body2 accentColor semibold>
                    {route.params?.check_in}
                  </Text>
                </View>
                <View style={{flex: 1, justifyContent: 'center'}}>
                  <Text body2 grayColor>
                    {t('check_out_from')}
                  </Text>
                  <Text body2 accentColor semibold>
                    {route.params?.check_out}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
        <View
          style={[styles.contentButtonBottom, {borderTopColor: colors.border}]}>
          <View>
            <Text caption1 semibold>
              {t('price')}
            </Text>
            <Text title3 primaryColor semibold>
              {route.params?.price}
            </Text>
            <Text caption1 semibold style={{marginTop: 5}}>
              {t('ราคาต่อคืน')}
            </Text>
          </View>
          <View style={styles.contentCartPromotion}>
            <Button
              style={styles.btnPromotion}
              onPress={() => {
                navigation.navigate('PreviewBooking', {
                  id: route.params?.id,
                  name: route.params?.name,
                  location: route.params?.location,
                  image: route.params?.image_path,
                  price: route.params?.price,
                  check_in: route.params?.check_in,
                  check_out: route.params?.check_out,
                  days: route.params?.days,
                  details: route.params?.details,
                });
              }}>
              <Text body2 semibold whiteColor>
                {t('จองตอนนี้')}
              </Text>
            </Button>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}
