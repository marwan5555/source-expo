import React, { useState, useEffect } from 'react';
import { RefreshControl, FlatList, View, Text } from 'react-native';
import { BaseStyle, useTheme } from '@config';
import { Header, SafeAreaView, PostItem, ProfileAuthor, Icon } from '@components';
import { useTranslation } from 'react-i18next';
import AsyncStorage from "@react-native-async-storage/async-storage";


export default function BookingDetail({ navigation }) {
  const { colors } = useTheme();
  const { t } = useTranslation();

  const [refreshing] = useState(false);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      let uid = await AsyncStorage.getItem('uid');

      fetch('https://onetravel.click/app/book.php?uid=' + uid)
        .then(response => response.json())
        .then(data => {
          setPosts(data);
        });
    } catch (error) {
      console.error(error);
    }
  };

  console.log(posts);

  return (
    <View style={{ flex: 1 }}>
      <Header
        title={t('บันทึกการจ่าย')}
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
          navigation.navigate('Home');
        }}
        onPressRight={() => {}}
      />
      <SafeAreaView style={BaseStyle.safeAreaView} edges={['right', 'left', 'bottom']}>
        {posts.length > 0 ? (
          <FlatList
            refreshControl={
              <RefreshControl
                colors={[colors.primary]}
                tintColor={colors.primary}
                refreshing={refreshing}
                onRefresh={() => {}}
              />
            }
            data={posts}
            keyExtractor={(item, index) => item.id}
            renderItem={({ item, index }) => (
              <PostItem
                image={item.slip}
                title={item.hotel_name}
                description={item.status}
                check_in={item.check_in_date}
                check_out={item.check_out_date}
                onPress={() => navigation.navigate('PostDetail')}
              >
                <ProfileAuthor
                  image={item.authorImage}
                  name={item.name}
                  description={item.detail}
                  style={{ paddingHorizontal: 20 }}
                />
              </PostItem>
            )}
          />
        ) : (
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text>{t('ไม่มีการจ่าย')}</Text>
          </View>
        )}
      </SafeAreaView>
    </View>
  );
}
