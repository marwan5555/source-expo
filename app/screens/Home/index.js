import React, {useState,useEffect} from 'react';
import {View, Animated, TouchableOpacity, FlatList} from 'react-native';
import {
  Image,
  Text,
  Icon,
  HotelItem,
  Card,
  Button,
  SafeAreaView,
  EventCard,
} from '@components';
import {BaseStyle, Images, useTheme} from '@config';
import * as Utils from '@utils';
import styles from './styles';
import {PromotionData, TourData, HotelData} from '@data';
import {useTranslation} from 'react-i18next';

export default function Home({navigation}) {
  const {t} = useTranslation();
  const {colors} = useTheme();
  const [icons] = useState([
    {
      icon: 'calendar-alt',
      name: 'hotels',
      route: 'Hotel',
    },
    {
      icon: 'map-marker-alt',
      name: 'tours',
      route: 'Tour',
    },
    {
      icon: 'paper-plane',
      name: 'แจ้งเตือน',
      route: 'Notification',
    },
  ]);
  const [relate,setRelate] = useState();
  
  const [promotion] = useState(PromotionData);
  const [tours,setTours] = useState();
  const [hotels,setHotel] = useState();
  const [heightHeader, setHeightHeader] = useState(Utils.heightHeader());
  const deltaY = new Animated.Value(0);

  useEffect(() => {
    fetch('https://onetravel.click/app/eventslistdata.php')
      .then(response => response.json())
      .then(data => {
        setRelate(data);
      });
  }, []);

  useEffect(() => {
    fetch('https://onetravel.click/app/hotels.php')
      .then(response => response.json())
      .then(data => {
        setHotel(data);
      });
  }, []);
  useEffect(() => {
    fetch('https://onetravel.click/app/tours.php')
      .then(response => response.json())
      .then(data => {
        setTours(data);
      });
  }, []);


  const renderIconService = () => {
    return (
      <FlatList
        data={icons}
        numColumns={4}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item}) => {
          return (
            <TouchableOpacity
              style={styles.itemService}
              activeOpacity={0.9}
              onPress={() => {
                navigation.navigate(item.route);
              }}>
              <View
                style={[styles.iconContent, {backgroundColor: colors.card}]}>
                <Icon name={item.icon} size={18} color={colors.primary} solid />
              </View>
              <Text footnote grayColor numberOfLines={1}>
                {t(item.name)}
              </Text>
            </TouchableOpacity>
          );
        }}
      />
    );
  };

  const heightImageBanner = Utils.scaleWithPixel(140);
  const marginTopBanner = heightImageBanner - heightHeader;

  return (
    <View style={{flex: 1}}>
      <Animated.Image
        source={Images.trip3}
        style={[
          styles.imageBackground,
          {
            height: deltaY.interpolate({
              inputRange: [
                0,
                Utils.scaleWithPixel(100),
                Utils.scaleWithPixel(100),
              ],
              outputRange: [heightImageBanner, heightHeader, 0],
            }),
          },
        ]}
      />
      <SafeAreaView style={{flex: 1}} edges={['right', 'left']}>
        <FlatList
          onScroll={Animated.event([
            {
              nativeEvent: {
                contentOffset: {y: deltaY},
              },
            },
          ])}
          onContentSizeChange={() => setHeightHeader(Utils.heightHeader())}
          scrollEventThrottle={8}
          ListHeaderComponent={
            <View style={{paddingHorizontal: 20}}>
              <View
                style={[
                  styles.searchForm,
                  {
                    marginTop: marginTopBanner,
                    backgroundColor: colors.background,
                    borderColor: colors.border,
                    shadowColor: colors.border,
                  },
                ]}>
                <TouchableOpacity
                  onPress={() => navigation.navigate('Search')}
                  activeOpacity={0.9}>
                  <View
                    style={[
                      BaseStyle.textInput,
                      {backgroundColor: colors.card},
                    ]}>
                    <Text body1 grayColor>
                      {t('คุณกำลังหาอะไรอยู่')}
                    </Text>
                  </View>
                </TouchableOpacity>
                {renderIconService()}
              </View>
            </View>
          }
          ListFooterComponent={
            <View>
              <View>
                <Text title3 semibold style={styles.titleView}>
                  {t('ในวันนี้')}
                </Text>
                <FlatList
                  contentContainerStyle={{paddingLeft: 5, paddingRight: 20}}
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}
                  data={hotels}
                  keyExtractor={(item, index) => item.id}
                  renderItem={({item, index}) => (
                    <Card
                      style={[styles.promotionItem, {marginLeft: 15}]}
                      image={item.image_path}
                      onPress={() => navigation.navigate('HotelDetail',{id:item.id,name:item.name,location:item.location,image:item.image_path,price:item.price,check_in:item.check_in,check_out:item.check_out,days:item.days,details:item.details})}>
                      <Text subhead whiteColor>
                        {item.name}
                      </Text>
                      <Text title2 whiteColor semibold>
                        {item.location}
                      </Text>
                      <View style={styles.contentCartPromotion}>
                        <Button
                          style={styles.btnPromotion}
                          onPress={() => {
                            navigation.navigate('PreviewBooking',{id:item.id,name:item.name,location:item.location,image:item.image_path,price:item.price,check_in:item.check_in,check_out:item.check_out,days:item.days,details:item.details,available:item.available});
                          }}>
                          <Text body2 semibold whiteColor>
                            {t('จองตอนนี้')}
                          </Text>
                        </Button>
                      </View>
                    </Card>
                  )}
                />
              </View>
              {/* Hiking */}
              <View style={styles.titleView}>
                <Text title3 semibold>
                  {t('ทัวร์')}
                </Text>
                <Text body2 grayColor>
                  {t('let_find_tour')}
                </Text>
              </View>
              <FlatList
                contentContainerStyle={{paddingLeft: 5, paddingRight: 20}}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                data={tours}
                keyExtractor={(item, index) => item.id}
                renderItem={({item, index}) => (
                  <Card
                    style={[styles.tourItem, {marginLeft: 15}]}
                    image={item.image_path}
                    onPress={() => navigation.navigate('TourDetail',
                    {id:item.id,
                    img:item.image_path,
                    name:item.name,
                    location:item.location,
                    travel_time:item.travel_time,
                    start_time:item.start_time,
                    last:item.last,
                    price:item.price,
                    rating:item.rating,
                    day1:item.day1,
                    day2:item.day2,
                    day3:item.day3,
                    day4:item.day4,
                    image_day1:item.image_day1,
                    image_day2:item.image_day2,
                    image_day3:item.image_day3,
                    image_day4:item.image_day4,
                    name_day1:item.name_day1,
                    name_day2:item.name_day2,
                    name_day3:item.name_day3,
                    name_day4:item.name_day4,
                    description1:item.description1,
                    description2:item.description2,
                    description3:item.description3,
                    description4:item.description4,
                    })}>
                    <Text headline whiteColor semibold>
                      {item.name}
                    </Text>
                  </Card>
                )}
              />
              {/* Event*/}
              <View style={styles.titleView}>
                <Text title3 semibold>
                  {t('comming_event')}
                </Text>
                <Text body2 grayColor>
                  {t('let_find_event')}
                </Text>
              </View>
              <View>
                <FlatList
                  contentContainerStyle={{
                    paddingRight: 20,
                    paddingLeft: 5,
                  }}
                  horizontal={true}
                  data={relate}
                  showsHorizontalScrollIndicator={false}
                  keyExtractor={(item, index) => item.id}
                  renderItem={({item, index}) => (
                    <EventCard
                      image={item.image}
                      title={item.title}
                      time={item.time}
                      location={item.location}
                      onPress={() => navigation.navigate('EventDetail',{id:item.id,image:item.image,title:item.title,subtitle:item.subtitle,location:item.location,time:item.time})}
                      style={{marginLeft: 15}}
                    />
                  )}
                />
              </View>
              {/* Promotion */}
              <View style={styles.titleView}>
                <Text title3 semibold>
                  {t('promotion')}
                </Text>
                <Text body2 grayColor>
                  {t('let_find_promotion')}
                </Text>
                <Image source={Images.banner1} style={styles.promotionBanner} />
                <View style={[styles.line, {backgroundColor: colors.border}]} />
              </View>
              <FlatList
                columnWrapperStyle={{paddingLeft: 5, paddingRight: 20}}
                numColumns={2}
                data={hotels}
                keyExtractor={(item, index) => item.id}
                renderItem={({item, index}) => (
                  <HotelItem
                    grid
                    image={item.image_path}
                    name={item.name}
                    location={item.location}
                    price={item.price}
                    available={item.available}
                    rate={item.rate}
                    rateStatus={item.rateStatus}
                    numReviews={item.numReviews}
                    services={item.services}
                    style={{marginLeft: 15, marginBottom: 15}}
                    onPress={() => navigation.navigate('HotelDetail',
                    {id:item.id,
                      image_path:item.image_path,
                      name:item.name,
                      location:item.location,
                      price:item.price,
                      check_in:item.check_in,
                      check_out:item.check_out,
                      days:item.days,
                      details:item.details,
                      available:item.available,
                      rate:item.rate
                    })}
                  />
                )}
              />
            </View>
          }
        />
      </SafeAreaView>
    </View>
  );
}
