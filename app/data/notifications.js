import {StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';

export default function notifications() {
  const [user, setUser] = useState(''); 
  fetch('https://onetravel.click/app/notifications.php') // ลิงค์ api
    .then(response => response.json())
    .then(data => setUser(data));
    console.log(user)
  return (
    <View>
      <Text>notifications</Text>
    </View>
  );
}

const styles = StyleSheet.create({});
