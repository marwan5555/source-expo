import React, {useState, useEffect} from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  FlatList,
  RefreshControl,
} from 'react-native';
import {BaseStyle, BaseColor, Images, useTheme} from '@config';
import {
  Image,
  Header,
  SafeAreaView,
  Icon,
  Text,
  Card,
  TourDay,
  Button,
} from '@components';
import {TabView, TabBar} from 'react-native-tab-view';
import styles from './styles';
import {UserData, TourData} from '@data';
import {useTranslation} from 'react-i18next';

export default function TourDetail({navigation, route}) {
  console.log(route);
  const {colors} = useTheme();
  const {t} = useTranslation();

  const [index, setIndex] = useState(0);
  const [routes] = useState([
    {key: 'information', title: t('ข้อมูล')},
    {key: 'tour', title: t('ทัวร์')},
  ]);
  const [userData] = useState(UserData[0]);

  useEffect(() => {
    fetch('https://onetravel.click/app/tours.php')
      .then(response => response.json())
      .then(data => {
        setTours(data);
      });
  }, []);
  // When tab is activated, set what's index value
  const handleIndexChange = index => setIndex(index);

  // Customize UI tab bar
  const renderTabBar = props => (
    <TabBar
      {...props}
      scrollEnabled
      indicatorStyle={[styles.indicator, {backgroundColor: colors.primary}]}
      style={[styles.tabbar, {backgroundColor: colors.background}]}
      tabStyle={styles.tab}
      inactiveColor={BaseColor.grayColor}
      activeColor={colors.text}
      renderLabel={({route, focused, color}) => (
        <View style={{flex: 1, width: 130, alignItems: 'center'}}>
          <Text headline semibold={focused} style={{color}}>
            {route.title}
          </Text>
        </View>
      )}
    />
  );

  // Render correct screen container when tab is activated

  return (
    <View style={{flex: 1}}>
      <Header
        title={route.params.name}
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
        <View style={{flex: 1}}>
          <View
            style={[
              styles.contentButtonBottom,
              {borderTopColor: colors.border},
            ]}>
            <View>
              <ScrollView>
                <View style={{paddingHorizontal: 20, marginTop: 20}}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    <Text headline semibold>
                      รูป
                    </Text>
                  </View>
                  <View style={styles.contentImageGird}>
                    <View style={{flex: 4, marginRight: 10}}>
                      <Card
                        image={route.params.img}></Card>
                    </View>
                    <View style={{flex: 6}}>
                      <View style={{flex: 1}}>
                        <Card
                          image=
                            {route.params.image_day1}></Card>
                      </View>
                      <View
                        style={{
                          flex: 1,
                          flexDirection: 'row',
                          marginTop: 10,
                        }}>
                        <View style={{flex: 6, marginRight: 10}}>
                          <Card
                            image={
                              route.params.image_day2
                            }></Card>
                        </View>
                        <View style={{flex: 4}}>
                          <Card
                            image={route.params.image_day3
                            }></Card>
                        </View>
                      </View>
                    </View>
                  </View>
                  <Text headline semibold style={{marginTop: 20}}></Text>
                  <Text headline semibold style={{marginTop: 20}}>
                    {route.params.day1}
                  </Text>
                  <Image
                    source={{uri:route.params.image_day1}}
                    style={{height: 120, width: '100%', marginTop: 10}}
                  />
                  <Text body2 style={{marginTop: 10}}></Text>
                  <Text body2 style={{marginTop: 10}}>
                    {route.params.description1}
                  </Text>
                  <Text headline semibold style={{marginTop: 20}}>
                    {route.params.day2}
                  </Text>
                  <Image
                    source={{uri:route.params.image_day2}}
                    style={{height: 120, width: '100%', marginTop: 10}}
                  />
                  <Text body2 style={{marginTop: 10}}>
                    {route.params.description2}
                  </Text>
                  <Text headline semibold style={{marginTop: 20}}>
                    {route.params.day3}
                  </Text>
                  <Image
                    source={{uri:route.params.image_day3}}
                    style={{height: 120, width: '100%', marginTop: 10}}
                  />
                  <Text body2 style={{marginTop: 10}}>
                    <Text body2 style={{marginTop: 10}}>
                    {route.params.description2}
                  </Text>
                  </Text>
                  <Text body2 style={{marginTop: 10}}>
                  </Text>
                  <Text body2 style={{marginTop: 10}}>
                    .....................................................................................................................................................
                  </Text>
                </View>
              </ScrollView>
            </View>
          </View>
        </View>
        <Button
              onPress={() =>
                navigation.navigate('PreviewBooking', {
                  id: route.params.id,
                  name: route.params.name,
                  location: route.params.location,
                  image: route.params.image_path,
                  price: route.params.price,
                  check_in: route.params.start_time,
                  check_out: route.params.last,
                  days: route.params.days,
                  details: route.params.details,
                })
              }>
              {t('book_now'+' '+(route.params.price)+'   '+'บาท')}
            </Button>
      </SafeAreaView>
    </View>
  );
}
