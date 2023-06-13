import React, {useState, useEffect} from 'react';
import {View, ScrollView, TouchableOpacity} from 'react-native';
import {BaseStyle, BaseColor, useTheme} from '@config';
import {Header, SafeAreaView, Icon, Text, Button} from '@components';
import styles from './styles';
import {useTranslation} from 'react-i18next';
import Modal from 'react-native-modal';
import {Calendar} from 'react-native-calendars';


export default function PreviewBooking({navigation, route}) {
  const {t} = useTranslation();
  const {colors} = useTheme();
  const [night, setNight] = useState(1);
  const [adult, setAdult] = useState(0);
  const [children, setChildren] = useState(0);
  //
  const [markedDatesIn, setMarkedDatesIn] = useState({});
  const [markedDatesOut, setMarkedDatesOut] = useState({});
  const [totalPrice, setTotalPrice] = useState(0);
  const [checkInTime, setCheckInTime] = useState(checkInTime);
  const [checkOutTime, setCheckOutTime] = useState(checkOutTime);
  const [modalVisible, setModalVisible] = useState(false);
  const [startMode, setStartMode] = useState(true);
  const [renderCalendar, setRenderCalendar] = useState(true);
  
  //
  const openModal = (startMode = true) => {
    setModalVisible(true);
    setStartMode(startMode);
  };

  const setDaySelected = (selected, startMode = true) => {
    let markedIn = {};
    let markedOut = {};

    if (startMode) {
      markedIn[selected] = {
        selected: true,
        marked: true,
        selectedColor: colors.primary,
      };
      setMarkedDatesIn(markedIn);
      setCheckInTime(selected);
    } else {
      markedOut[selected] = {
        selected: true,
        marked: true,
        selectedColor: colors.primary,
      };
      setMarkedDatesOut(markedOut);
      setCheckOutTime(selected);
    }
  };

  useEffect(() => {
    setRenderCalendar(false);
    setTimeout(() => {
      setRenderCalendar(true);
    }, 250);
  }, [colors.card]);

  useEffect(() => {
    let markedIn = {};
    let markedOut = {};
    markedIn[checkInTime] = {
      selected: true,
      marked: true,
      selectedColor: colors.primary,
    };
    markedOut[checkOutTime] = {
      selected: true,
      marked: true,
      selectedColor: colors.primary,
    };
    setMarkedDatesIn(markedIn);
    setMarkedDatesOut(markedOut);
  }, [checkInTime, checkOutTime, colors.primary]);

  //
  const setValue = (mode, value) => {
    switch (value) {
      case 'adult':
        if (mode === 'up') {
          setAdult(adult + 1);
          setTotalPrice(totalPrice + 350);
        } else {
          setAdult(adult - 1 > 0 ? adult - 1 : 0);
          setTotalPrice(totalPrice - 350 >0 ? totalPrice - 350 :0);
        }
        break;
      case 'children':
        if (mode === 'up') {
          setChildren(children + 1);
          setTotalPrice(totalPrice + 250);
        } else {
          setChildren(children - 1 > 0 ? children - 1 : 0);
          setTotalPrice(totalPrice - 250 >0 ? totalPrice - 250:0);
        }
        break;
      case 'night':
        if (mode === 'up') {
          setNight(night + 1);
          setTotalPrice(totalPrice + route.params.price);
        } else {
          setNight(night - 1 > 0 ? night - 1 : 0);
          setTotalPrice(totalPrice - route.params.price);
        }
        break;
    }
  };
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
            {/*  */}
            <View
              style={[styles.contentPickDate, {backgroundColor: colors.card}]}>
              <Modal
                isVisible={modalVisible}
                backdropColor="rgba(0, 0, 0, 0.5)"
                backdropOpacity={1}
                animationIn="fadeIn"
                animationInTiming={600}
                animationOutTiming={600}
                backdropTransitionInTiming={600}
                backdropTransitionOutTiming={600}>
                {renderCalendar && (
                  <View
                    style={[
                      styles.contentCalendar,
                      {backgroundColor: colors.card},
                    ]}>
                    <Calendar
                      style={{
                        borderRadius: 8,
                        backgroundColor: colors.card,
                      }}
                      renderArrow={direction => {
                        return (
                          <Icon
                            name={
                              direction == 'left' ? 'angle-left' : 'angle-right'
                            }
                            size={14}
                            color={colors.primary}
                            enableRTL={true}
                          />
                        );
                      }}
                      markedDates={startMode ? markedDatesIn : markedDatesOut}
                      current={startMode ? checkInTime : checkOutTime}
                      onDayPress={day => {
                        setDaySelected(day.dateString, startMode);
                      }}
                      monthFormat={'dd-MM-yyyy'}
                      theme={{
                        calendarBackground: colors.card,
                        textSectionTitleColor: colors.text,
                        selectedDayBackgroundColor: colors.primary,
                        selectedDayTextColor: '#ffffff',
                        todayTextColor: colors.primary,
                        dayTextColor: colors.text,
                        textDisabledColor: BaseColor.grayColor,
                        dotColor: colors.primary,
                        selectedDotColor: '#ffffff',
                        arrowColor: colors.primary,
                        monthTextColor: colors.text,
                        textMonthFontWeight: 'bold',
                        textDayFontSize: 14,
                        textMonthFontSize: 16,
                        textDayHeaderFontSize: 14,
                      }}
                    />
                    <View style={styles.contentActionCalendar}>
                      <TouchableOpacity
                        onPress={() => {
                          if (startMode) {
                            setModalVisible(false);
                            setStartMode(true);
                            setCheckInTime(checkInTime);
                          } else {
                            setModalVisible(false);
                            setStartMode(false);
                            setCheckOutTime(checkOutTime);
                          }
                          onCancel();
                        }}>
                        <Text body2>Cancel</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => {
                          setModalVisible(false);
                          setStartMode(false);
                          setCheckInTime(checkInTime);
                        }}>
                        <Text body1 primaryColor>
                          {t('done')}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              </Modal>
              <TouchableOpacity
                style={styles.itemPick}
                onPress={() => openModal()}>
                <Text caption1 light style={{marginBottom: 5}}>
                  {t('check_in')}
                </Text>
                <Text headline semibold>
                  {checkInTime}
                </Text>
              </TouchableOpacity>
              <View
                style={[styles.linePick, {backgroundColor: colors.border}]}
              />
              <TouchableOpacity
                style={styles.itemPick}
                onPress={() => openModal(false)}>
                <Text caption1 light style={{marginBottom: 5}}>
                  {t('check_out')}
                </Text>
                <Text headline semibold>
                  {checkOutTime}
                </Text>
              </TouchableOpacity>
            </View>
            {/*  */}
            <View
              style={[styles.blockView, {borderBottomColor: colors.border}]}>
              {/* เช็คอิน/เช็คเอาท์แบบเก่า */}
              {/* <View style={{flexDirection: 'row', marginTop: 10}}>
                <View>
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
                  <Bookingcheckout />
                  </Text>
                </View>
              </View>
              <View style={{flexDirection: 'row', marginTop: 10}}>
                <View style={{flex: 1}}>
                  <Text body1>{t('duration')} </Text>
                </View>
                <View style={{flex: 1, alignItems: 'flex-end'}}>
                  <Text body2 semibold>
                    {route.params.days}
                    <View style={styles.iconRight}>
                      <TouchableOpacity
                        onPress={() => setValue('down', 'night')}>
                        <Icon
                          name="minus-circle"
                          size={24}
                          color={BaseColor.grayColor}
                        />
                      </TouchableOpacity>
                      <Text title1>{night}</Text>
                      <TouchableOpacity onPress={() => setValue('up', 'night')}>
                        <Icon
                          name="plus-circle"
                          size={24}
                          color={colors.primary}
                        />
                      </TouchableOpacity>
                      <Text caption1 semibold>
                        {t('night')}
                      </Text>
                    </View>
                  </Text>
                </View>
              </View> */}
              <View style={{padding: 10}}></View>
              <View style={[styles.contentFilterBottom]}>
                <View style={styles.contentSwipeDown}>
                  <View style={styles.lineSwipeDown} />
                </View>
                <View
                  style={[
                    styles.contentActionModalBottom,
                    {borderBottomColor: colors.border},
                  ]}></View>
                <View style={styles.lineRow}>
                  <View>
                    <Text body1>{t('adults')}</Text>
                    <Text caption1 grayColor>
                      ฿ 350
                    </Text>
                  </View>
                  <View style={styles.iconRight}>
                    <TouchableOpacity onPress={() => setValue('down', 'adult')}>
                      <Icon
                        name="minus-circle"
                        size={24}
                        color={BaseColor.grayColor}
                      />
                    </TouchableOpacity>
                    <Text title1>{adult}</Text>
                    <TouchableOpacity onPress={() => setValue('up', 'adult')}>
                      <Icon
                        name="plus-circle"
                        size={24}
                        color={colors.primary}
                      />
                    </TouchableOpacity>
                    <Text caption1 semibold>
                      {t('คน')}
                    </Text>
                  </View>
                </View>
                <View style={styles.lineRow}>
                  <View>
                    <Text body1>{t('children')}</Text>
                    <Text caption1 grayColor>
                      ฿ 250
                    </Text>
                  </View>
                  <View style={styles.iconRight}>
                    <TouchableOpacity
                      onPress={() => setValue('down', 'children')}>
                      <Icon
                        name="minus-circle"
                        size={24}
                        color={BaseColor.grayColor}
                      />
                    </TouchableOpacity>
                    <Text title1>{children}</Text>
                    <TouchableOpacity
                      onPress={() => setValue('up', 'children')}>
                      <Icon
                        name="plus-circle"
                        size={24}
                        color={colors.primary}
                      />
                    </TouchableOpacity>
                    <Text caption1 semibold>
                      {t('คน')}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
            <View
              style={[styles.blockView, {borderBottomColor: colors.border}]}>
              <Text body2 style={{marginBottom: 10}}>
                {t('room')}
              </Text>
              <Text body1 semibold style={{marginBottom: 5}}>
                {/* {route.params.available} */}
              </Text>
              <Text body2 style={{marginBottom: 5}}>
                {/* {route.params.details} */}
              </Text>
            </View>
          </View>
        </ScrollView>
        <View style={styles.contentButtonBottom}>
          <View>
            <Text title3 primaryColor semibold>
              ฿ {totalPrice}
            </Text>
          </View>
          <Button
            onPress={() =>
              navigation.navigate('CheckOut', {
                id: route.params.id,
                name: route.params.name,
                location: route.params.location,
                image: route.params.image_path,
                price:totalPrice ,
                check_in: route.params.check_in,
                check_out: route.params.check_out,
                days: route.params.days,
                details: route.params.details,
              })
            }>
            {t('continue')}
          </Button>
        </View>
      </SafeAreaView>
    </View>
  );
}
