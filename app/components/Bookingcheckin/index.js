import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import { Text, Icon } from '@components';
import styles from './styles';
import { Calendar } from 'react-native-calendars';
import Modal from 'react-native-modal';
import { BaseColor, useTheme, DefaultFont } from '@config';
import { useTranslation } from 'react-i18next';

export default function BookingTime(props) {
  const { t } = useTranslation();

  const [markedDatesIn, setMarkedDatesIn] = useState({});
  const [checkInTime, setCheckInTime] = useState(props.checkInTime);
  const [modalVisible, setModalVisible] = useState(false);
  const [renderCalendar, setRenderCalendar] = useState(true);
  const { style, onCancel, onChange, minDate, maxDate } = props;
  const { colors } = useTheme();

  const openModal = () => {
    setModalVisible(true);
  };

  const setDaySelected = (selected) => {
    const markedIn = {};
    markedIn[selected] = {
      selected: true,
      marked: true,
      selectedColor: colors.primary,
    };
    setMarkedDatesIn(markedIn);
    setCheckInTime(selected);
  };

  useEffect(() => {
    setRenderCalendar(false);
    setTimeout(() => {
      setRenderCalendar(true);
    }, 250);
  }, [colors.card]);

  useEffect(() => {
    const markedIn = {};
    markedIn[props.checkInTime] = {
      selected: true,
      marked: true,
      selectedColor: colors.primary,
    };
    setMarkedDatesIn(markedIn);
  }, [props.checkInTime, colors.primary]);

  return (
    <View
      style={[styles.contentPickDate, { backgroundColor: colors.card }, style]}
    >
      <Modal
        isVisible={modalVisible}
        backdropColor="rgba(0, 0, 0, 0.5)"
        backdropOpacity={1}
        animationIn="fadeIn"
        animationInTiming={600}
        animationOutTiming={600}
        backdropTransitionInTiming={600}
        backdropTransitionOutTiming={600}
      >
        {renderCalendar && (
          <View
            style={[styles.contentCalendar, { backgroundColor: colors.card }]}
          >
            <Calendar
              style={{
                borderRadius: 8,
                backgroundColor: colors.card,
              }}
              renderArrow={(direction) => {
                return (
                  <Icon
                    name={direction == 'left' ? 'angle-left' : 'angle-right'}
                    size={14}
                    color={colors.primary}
                    enableRTL={true}
                  />
                );
              }}
              markedDates={markedDatesIn}
              current={checkInTime}
              minDate={minDate}
              maxDate={maxDate}
              onDayPress={(day) => {
                setDaySelected(day.dateString);
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
                textDayFontFamily: DefaultFont,
                textMonthFontFamily: DefaultFont,
                textDayHeaderFontFamily: DefaultFont,
                textMonthFontWeight: 'bold',
                textDayFontSize: 14,
                textMonthFontSize: 16,
                textDayHeaderFontSize: 14,
              }}
            />
            <View style={styles.contentActionCalendar}>
              <TouchableOpacity
                onPress={() => {
                  setModalVisible(false);
                  onCancel();
                }}
              >
                <Text body1>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setModalVisible(false);
                  onChange(checkInTime);
                }}
              >
                <Text body1 primaryColor>
                  {t('done')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </Modal>
      <TouchableOpacity style={styles.itemPick} onPress={openModal}>
         <Text caption1 light style={{ marginBottom: 5 }}>
          {t('check_in')}
        </Text>  
        {/* คำว่าเช็คอิน */}
        <Text headline semibold>
          {checkInTime}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

BookingTime.propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  checkInTime: PropTypes.string,
  minDate: PropTypes.string,
  maxDate: PropTypes.string,
  onCancel: PropTypes.func,
  onChange: PropTypes.func,
};

BookingTime.defaultProps = {
  style: {},
  checkInTime: '2023-06-13',
  minDate: '2023-02-16',
  maxDate: '2023-06-30',
  onCancel: () => {},
  onChange: () => {},
};
