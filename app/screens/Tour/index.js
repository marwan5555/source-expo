import React, {useState , useEffect} from 'react';
import {FlatList, RefreshControl, View, Animated} from 'react-native';
import {BaseStyle, useTheme} from '@config';
import {Header, SafeAreaView, Icon, TourItem, FilterSort} from '@components';
import styles from './styles';
import * as Utils from '@utils';
import {TourData} from '@data';
import {useTranslation} from 'react-i18next';

export default function Tour({navigation}) {
  const {t} = useTranslation();
  const scrollAnim = new Animated.Value(0);
  const offsetAnim = new Animated.Value(0);
  const clampedScroll = Animated.diffClamp(
    Animated.add(
      scrollAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1],
        extrapolateLeft: 'clamp',
      }),
      offsetAnim,
    ),
    0,
    40,
  );
  const {colors} = useTheme();

  const [refreshing] = useState(false);
  const [modeView, setModeView] = useState('block');
  const [tours,setTours] = useState();
  useEffect(() => {
    fetch('https://onetravel.click/app/tours.php')
      .then(response => response.json())
      .then(data => {
        setTours(data);
      });
  }, []);
  const onChangeSort = () => {};

  const onFilter = () => {
    navigation.navigate('Filter');
  };


  const onChangeView = () => {
    Utils.enableExperimental();
    switch (modeView) {
      case 'block':
        setModeView('grid');

        break;
      case 'grid':
        setModeView('list');
        break;
      case 'list':
        setModeView('block');
        break;
      default:
        setModeView('block');
        break;
    }
  };

 
  const renderContent = () => {
    const navbarTranslate = clampedScroll.interpolate({
      inputRange: [0, 40],
      outputRange: [0, -40],
      extrapolate: 'clamp',
    });
    switch (modeView) {
      case 'block':
        return (
          <View style={{flex: 1}}>
            <Animated.FlatList
              contentContainerStyle={{
                paddingTop: 50,
              }}
              refreshControl={
                <RefreshControl
                  colors={[colors.primary]}
                  tintColor={colors.primary}
                  refreshing={refreshing}
                  onRefresh={() => {}}
                />
              }
              scrollEventThrottle={1}
              onScroll={Animated.event(
                [
                  {
                    nativeEvent: {
                      contentOffset: {
                        y: scrollAnim,
                      },
                    },
                  },
                ],
                {useNativeDriver: true},
              )}
              data={tours}
              key={'block'}
              keyExtractor={(item, index) => item.id}
              renderItem={({item, index}) => (
                <TourItem
                  block
                  image={item.image_path}
                  name={item.name}
                  location={item.location}
                  travelTime={item.location}
                  startTime={item.startTime}
                  price={item.price}
                  rate={item.rate}
                  rateCount={item.rateCount}
                  numReviews={item.numReviews}
                  author={item.author}
                  services={item.services}
                  style={{
                    marginBottom: 10,
                  }}
                  onPress={() => {
                    navigation.navigate('TourDetail',{id:item.id,
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
                      });
                  }}
                  onPressBookNow={() => {
                    navigation.navigate('PreviewBooking',{id:item.id,name:item.name,location:item.location,image:item.image_path,price:item.price,check_in:item.start_time,check_out:item.last,days:item.day,details:item.details,available:item.hotel});
                  }}
                />
              )}
            />
            <Animated.View
              style={[
                styles.navbar,
                {transform: [{translateY: navbarTranslate}]},
              ]}>
              {/* <FilterSort
                modeView={modeView}
                onChangeSort={onChangeSort}
                onChangeView={onChangeView}
                onFilter={onFilter}
              /> */}
            </Animated.View>
          </View>
        );
      case 'grid':
        return (
          <View style={{flex: 1}}>
            <Animated.FlatList
              contentContainerStyle={{
                paddingTop: 50,
              }}
              columnWrapperStyle={{
                paddingLeft: 5,
                paddingRight: 20,
              }}
              refreshControl={
                <RefreshControl
                  colors={[colors.primary]}
                  tintColor={colors.primary}
                  refreshing={refreshing}
                  onRefresh={() => {}}
                />
              }
              scrollEventThrottle={1}
              onScroll={Animated.event(
                [
                  {
                    nativeEvent: {
                      contentOffset: {
                        y: scrollAnim,
                      },
                    },
                  },
                ],
                {useNativeDriver: true},
              )}
              showsVerticalScrollIndicator={false}
              numColumns={2}
              data={tours}
              key={'gird'}
              keyExtractor={(item, index) => item.id}
              renderItem={({item, index}) => (
                <TourItem
                  grid
                  image={item.image_path}
                  name={item.name}
                  location={item.location}
                  travelTime={item.travelTime}
                  startTime={item.startTime}
                  price={item.price}
                  rate={item.rate}
                  rateCount={item.rateCount}
                  numReviews={item.numReviews}
                  author={item.author}
                  services={item.services}
                  style={{
                    marginBottom: 15,
                    marginLeft: 15,
                  }}
                  onPress={() => {
                    navigation.navigate('TourDetail');
                  }}
                  onPressBookNow={() => {
                    navigation.navigate('PreviewBooking',{id:item.id,name:item.name,location:item.location,image:item.image_path,price:item.price,check_in:item.check_in,check_out:item.check_out,days:item.days,details:item.details});
                  }}
                />
              )}
            />
            <Animated.View
              style={[
                styles.navbar,
                {
                  transform: [{translateY: navbarTranslate}],
                },
              ]}>
              <FilterSort
                modeView={modeView}
                onChangeSort={onChangeSort}
                onChangeView={onChangeView}
                onFilter={onFilter}
              />
            </Animated.View>
          </View>
        );

      case 'list':
        return (
          <View style={{flex: 1}}>
            <Animated.FlatList
              contentContainerStyle={{
                paddingTop: 50,
                paddingHorizontal: 20,
              }}
              refreshControl={
                <RefreshControl
                  colors={[colors.primary]}
                  tintColor={colors.primary}
                  refreshing={refreshing}
                  onRefresh={() => {}}
                />
              }
              scrollEventThrottle={1}
              onScroll={Animated.event(
                [
                  {
                    nativeEvent: {
                      contentOffset: {
                        y: scrollAnim,
                      },
                    },
                  },
                ],
                {useNativeDriver: true},
              )}
              data={tours}
              key={'list'}
              keyExtractor={(item, index) => item.id}
              renderItem={({item, index}) => (
                <TourItem
                  list
                  image={item.image_path}
                  name={item.name}
                  location={item.location}
                  travelTime={item.travelTime}
                  startTime={item.startTime}
                  price={item.price}
                  rate={item.rate}
                  rateCount={item.rateCount}
                  numReviews={item.numReviews}
                  author={item.author}
                  services={item.services}
                  style={{
                    marginBottom: 20,
                  }}
                  onPress={() => {
                    navigation.navigate('TourDetail');
                  }}
                  onPressBookNow={() => {
                    navigation.navigate('PreviewBooking',{id:item.id,name:item.name,location:item.location,image:item.image_path,price:item.price,check_in:item.check_in,check_out:item.check_out,days:item.days,details:item.details});
                  }}
                />
              )}
            />
            <Animated.View
              style={[
                styles.navbar,
                {
                  transform: [{translateY: navbarTranslate}],
                },
              ]}>
              <FilterSort
                modeView={modeView}
                onChangeSort={onChangeSort}
                onChangeView={onChangeView}
                onFilter={onFilter}
              />
            </Animated.View>
          </View>
        );
      default:
        return (
          <View style={{flex: 1}}>
            <Animated.FlatList
              contentContainerStyle={{
                paddingTop: 50,
              }}
              refreshControl={
                <RefreshControl
                  colors={[colors.primary]}
                  tintColor={colors.primary}
                  refreshing={refreshing}
                  onRefresh={() => {}}
                />
              }
              scrollEventThrottle={1}
              onScroll={Animated.event(
                [
                  {
                    nativeEvent: {
                      contentOffset: {
                        y: scrollAnim,
                      },
                    },
                  },
                ],
                {useNativeDriver: true},
              )}
              data={tours}
              key={'block'}
              keyExtractor={(item, index) => item.id}
              renderItem={({item, index}) => (
                <TourItem
                  block
                  image={item.image_path}
                  name={item.name}
                  location={item.location}
                  travelTime={item.travelTime}
                  startTime={item.startTime}
                  price={item.price}
                  rate={item.rate}
                  rateCount={item.rateCount}
                  numReviews={item.numReviews}
                  author={item.author}
                  services={item.services}
                  style={{
                    marginBottom: 10,
                  }}
                  onPress={() => {
                    navigation.navigate('TourDetail',
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
                      });
                  }}
                  onPressBookNow={() => {
                    navigation.navigate('PreviewBooking',{id:item.id,name:item.name,location:item.location,image:item.image_path,price:item.price,check_in:item.check_in,check_out:item.check_out,days:item.days,details:item.details});
                  }}
                />
              )}
            />
            <Animated.View
              style={[
                styles.navbar,
                {transform: [{translateY: navbarTranslate}]},
              ]}>
              {/* <FilterSort
                modeView={modeView}
                onChangeSort={onChangeSort}
                onChangeView={onChangeView}
                onFilter={onFilter}
              /> */}
            </Animated.View>
          </View>
        );
    }
  };

  return (
    <View style={{flex: 1}}>
      <Header
        title={t('tours')}
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
        // renderRight={() => {
        //   return <Icon name="search" size={20} color={colors.primary} />;
        // }}
        onPressLeft={() => {
          navigation.goBack();
        }}
        // onPressRight={() => {
        //   navigation.navigate('SearchHistory');
        // }}
      />
      <SafeAreaView
        style={BaseStyle.safeAreaView}
        edges={['right', 'left', 'bottom']}>
        {renderContent()}
      </SafeAreaView>
    </View>
  );
}
