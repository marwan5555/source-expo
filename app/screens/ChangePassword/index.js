import React,{ useState, useEffect }from 'react'
import { StyleSheet, Text, View,ScrollView,TouchableOpacity,FlatList,ActivityIndicator,TextInput,Alert } from 'react-native'
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ProgressDialog } from 'react-native-simple-dialogs';
import {Header, SafeAreaView, PostItem, ProfileAuthor,Icon} from '@components';

export default function ChangePassword({route,navigation}) {

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handlePress = async () => {
        try {
            let uid = await AsyncStorage.getItem("uid");
            if (!password) {
                Alert.alert('แจ้งเตือน!','กรุณากรอกรหัสผ่านใหม่!');
              } else if (password.length<6) {
                Alert.alert('แจ้งเตือน!','กรุณากรอกรหัสผ่านใหม่ 6ตัวขึ้นไป!');
              } else if (!confirmPassword) {
                Alert.alert('แจ้งเตือน!','กรุณากรอกยืนยันรหัสผ่านใหม่!');
              } else if (password !== confirmPassword) {
                Alert.alert('แจ้งเตือน!','กรุณายืนยันรหัสผ่านให้ตรงกัน!');
              } else{
                setLoading(!loading);
                fetch('https://onetravel.click/app/change_password.php', {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({

              id: uid,
              password: password
           
            })
           
          }).then((response) => response.json()) 
                .then((responseJson) => {
          
                  if(responseJson === 'เปลี่ยนรหัสผ่านสำเร็จ')
                  {
                      //AsyncStorage.setItem("Email",email);
                      Alert.alert('แจ้งเตือน!',responseJson);
                      navigation.goBack();
           
                  }
                  else{
                    setLoading(!loading);
                    Alert.alert('แจ้งเตือน!',responseJson);
                    console.log(responseJson)
                  }
          // Showing response message coming from server after inserting records.
           //       Alert.alert(responseJson);
                 // navigation.navigate('Profile');
                }).catch((error) => {
                  console.log(error);
                });
              }
            } catch (err) {
              console.log(err);
          }
        }
    return (
      <View style={styles.container}>
        <Header
        title={'เปลี่ยนรหัสผ่าน'}
        renderLeft={() => {
          return (
            <Icon
              name="arrow-left"
              size={20}
              enableRTL={true}
            />
          );
        }}
        onPressLeft={() => {
          navigation.goBack();
        }}
        onPressRight={() => {}}
      />
      <ScrollView>
      <ProgressDialog
      title="รอซักครู่"
      activityIndicatorColor="blue"
      activityIndicatorSize="large"
      message="กำลังโหลด..."
      visible={loading}
  />
      <View style={{padding:50}}></View>
        <Text style={styles.register}>เปลี่ยนรหัสผ่าน</Text>
      <View style={{paddingHorizontal:20}}>
    
        <Text style={styles.label}>รหัสผ่านใหม่</Text>
        <View style={styles.ViewInput}>
          <TextInput 
              placeholder="รหัสผ่าน" 
              secureTextEntry={true}
              onChangeText={(txt) => setPassword(txt)}
              value={password}
          />
        </View>
        <Text style={styles.label}>ยืนยันรหัสผ่านใหม่</Text>
        <View style={styles.ViewInput}>
          <TextInput 
              placeholder="ยืนยันรหัสผ่าน" 
              secureTextEntry={true}
              onChangeText={(txt) => setConfirmPassword(txt)}
              value={confirmPassword}
          />
        </View>
              <View style={styles.buttonStack}>
                  <TouchableOpacity
                onPress={() => handlePress()}
                  style={styles.buttons}
                  >
                      <Text style={styles.registers}>เปลี่ยนรหัสผ่าน</Text>
                  </TouchableOpacity>
                  
              </View>
      </View>
  
        
        </ScrollView>
      </View>
    )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(244,242,242,1)"
  },
  register: {
    textAlign:'center',
    color: "rgba(6,5,5,1)",
    fontSize: 30,
  },
  label:{
    fontSize:16
  },
  ViewInput:{
    borderRadius: 5,
    backgroundColor: "rgba(217,232,252,1)",
    padding:5
  },
  ViewInputs:{
    borderRadius: 5,

    backgroundColor: "rgba(217,232,252,1)",

  },
  buttons: {

    backgroundColor: "#E5634D",
    borderColor: "#000000",
    borderRadius: 50
  },
  registers: {
    padding:10,

    color: "rgba(255,255,255,1)",
  
    fontSize: 24,
    textAlign:'center'
  },
  buttonStack:{
    paddingHorizontal:55,
    paddingTop:35,
    paddingBottom:35
   // alignItems:'center'
  }
})
