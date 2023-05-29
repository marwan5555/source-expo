import React, {useState, useEffect} from 'react';
import {View, ScrollView, TouchableOpacity} from 'react-native';
import {useDispatch} from 'react-redux';
import {AuthActions} from '@actions';
import {BaseStyle, useTheme} from '@config';
import {
  Header,
  SafeAreaView,
  Icon,
  Text,
  Button,
  ProfileDetail,
  ProfilePerformance,
} from '@components';
import styles from './styles';
import {useTranslation} from 'react-i18next';

export default function Profile({navigation}) {
  const {colors} = useTheme();
  const {t} = useTranslation();

  const [loading, setLoading] = useState(false);
  const [userData, setUser] = useState();
  const dispatch = useDispatch();
  useEffect(() => {
    fetch('https://onetravel.click/app/user.php')
      .then(response => response.json())
      .then(data => {
        console.log(data);
        setUser(data);
      });
  }, []);

  const onLogOut = () => {
    setLoading(true);
    dispatch(AuthActions.authentication(false, response => {}));
  };

  return (
    <View style={{flex: 1}}>
      <Header
        title={t('profile')}
        renderRight={() => {
          return <Icon name="bell" size={24} color={colors.primary} />;
        }}
      />
      <SafeAreaView
        style={BaseStyle.safeAreaView}
        edges={['right', 'left', 'bottom']}>
        <ScrollView>
          <View style={styles.contain}>
            {userData && (
              <ProfileDetail
                image={require('@assets/images/profile-1.jpg')}
                textFirst={userData.name}
              />
            )}
            {userData && (
              <ProfilePerformance
                data={userData.performance}
                style={{marginTop: 20, marginBottom: 20}}
              />
            )}
            <TouchableOpacity
              style={[
                styles.profileItem,
                {borderBottomColor: colors.border, borderBottomWidth: 1},
              ]}
              onPress={() => {
                navigation.navigate('ProfileEdit');
              }}>
              <Text body1>{t('edit_profile')}</Text>
              <Icon
                name="angle-right"
                size={18}
                color={colors.primary}
                style={{marginLeft: 5}}
                enableRTL={true}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.profileItem,
                {borderBottomColor: colors.border, borderBottomWidth: 1},
              ]}
              onPress={() => {
                navigation.navigate('ChangePassword');
              }}>
              <Text body1>{t('change_password')}</Text>
              <Icon
                name="angle-right"
                size={18}
                color={colors.primary}
                style={{marginLeft: 5}}
                enableRTL={true}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.profileItem}
              onPress={() => {
                navigation.navigate('Setting');
              }}>
              <Text body1>{t('setting')}</Text>
              <Icon
                name="angle-right"
                size={18}
                color={colors.primary}
                style={{marginLeft: 5}}
                enableRTL={true}
              />
            </TouchableOpacity>
          </View>
        </ScrollView>
        <View style={{paddingHorizontal: 20, paddingVertical: 15}}>
          <Button full loading={loading} onPress={() => onLogOut()}>
            {t('sign_out')}
          </Button>
        </View>
      </SafeAreaView>
    </View>
  );
}
