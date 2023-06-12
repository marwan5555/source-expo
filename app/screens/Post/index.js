import React, { useState, useEffect } from 'react';
import {
  RefreshControl,
  FlatList,
  View,
  Button,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  Share,
  TextInput,
  Modal,
} from 'react-native';
import { BaseStyle, useTheme } from '@config';
import { Header, SafeAreaView, PostItem, ProfileAuthor } from '@components';
import styles from './styles';
import { Feather as Icon, FontAwesome as FAIcon } from '@expo/vector-icons';
import { PostData } from '@data';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Post({ navigation }) {
  const { colors } = useTheme();
  const { t } = useTranslation();

  const [refreshing, setRefreshing] = useState(false);
  const [posts, setPosts] = useState([]);
  const [likedPosts, setLikedPosts] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [comments, setComments] = useState([]);

  const handleShare = async (txt) => {
    try {
      await Share.share({
        message: txt,
      });
    } catch (error) {
      console.error('Sharing error:', error);
    }
  };

  const fetchComments = async (postId) => {
    try {
      const response = await fetch(`https://onetravel.click/app/comments.php?id=${postId}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching comments:', error);
      return [];
    }
  };

  useEffect(() => {
    fetch('https://onetravel.click/app/posts.php')
      .then((response) => response.json())
      .then((data) => {
        setPosts(data);
      })
      .catch((error) => {
        console.error('Error fetching posts:', error);
      });
  }, []);

  const handleLikePost = async (id) => {
    try {
      const response = await axios.post('https://onetravel.click/app/like.php', {
        id: id,
      });
      if (response.data === 'success') {
        setLikedPosts((prevLikedPosts) => {
          if (prevLikedPosts.includes(id)) {
            return prevLikedPosts.filter((postId) => postId !== id);
          } else {
            return [...prevLikedPosts, id];
          }
        });
      }
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleCommentPost = async (id) => {
    let uid = await AsyncStorage.getItem('uid');
    try {
      const response = await axios.post('https://onetravel.click/app/comment.php', {
        comment: commentText,
        id: id,
        uid: uid,
      });
      if (response.data === 'success') {
        setCommentText('');
      }
    } catch (error) {
      console.error('Error commenting on post:', error);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetch('https://onetravel.click/app/posts.php')
      .then((response) => response.json())
      .then((data) => {
        setPosts(data);
        setRefreshing(false);
      })
      .catch((error) => {
        console.error('Error fetching posts:', error);
        setRefreshing(false);
      });
  };

  return (
    <View style={{ flex: 1 }}>
      <Header title={t('post')} />
      <SafeAreaView style={BaseStyle.safeAreaView} edges={['right', 'left', 'bottom']}>
        <FlatList
          refreshControl={
            <RefreshControl colors={[colors.primary]} tintColor={colors.primary} refreshing={refreshing} onRefresh={handleRefresh} />
          }
          data={posts}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View>
              <View style={styles1.post}>
                {/* Post Header */}
                <View style={styles1.postHeader}>
                  <Image
                    style={{ width: 50, height: 50, borderRadius: 100 }}
                    source={{
                      uri: `https://picsum.photos/500/500?random=${item.id}`,
                    }}
                  />
                  <View style={{ flex: 1, paddingHorizontal: 10 }}>
                    <Text style={{ fontSize: 18 }}>Admin</Text>
                    <Text style={{}}></Text>
                  </View>
                  <TouchableOpacity style={{ paddingHorizontal: 6 }}>
                    <Icon name="more-horizontal" size={24} />
                  </TouchableOpacity>
                </View>
                {/* Post Content */}
                <View style={{ paddingHorizontal: 6 }}>
                  {/* Post Content Text */}
                  <Text style={{}}>{item.title}</Text>
                  {/* Post Content Image */}
                  <Image style={styles1.postContentImage} source={{ uri: item.image_path }} />
                </View>
                {/* Interactions Bar */}
                <View style={styles1.interactionBar}>
                  <TouchableOpacity onPress={() => handleLikePost(item.id)}>
                    <FAIcon
                      name={likedPosts.includes(item.id) ? 'heart' : 'heart-o'}
                      size={18}
                      color={likedPosts.includes(item.id) ? 'red' : 'black'}
                    />
                  </TouchableOpacity>
                  <Text style={styles1.interactionText}>{item.likes} ถูกใจ</Text>
                  <TouchableOpacity
                    style={styles1.interactionButton}
                    onPress={() => {
                      setModalVisible(true);
                      fetchComments(item.id)
                        .then((comments) => setComments(comments))
                        .catch((error) => console.error('Error fetching comments:', error));
                    }}
                  >
                    <Icon name="message-square" size={24} />
                    <Text style={{ marginLeft: 6 }}>ความคิดเห็น</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleShare(item.title)} style={styles1.interactionButton}>
                    <Icon name="share-2" size={24} />
                    <Text style={{ marginLeft: 6 }}>แชร์</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles1.commentContainer}>
                <TextInput
                  style={styles1.commentInput}
                  placeholder="ป้อนความคิดเห็น..."
                  value={commentText}
                  onChangeText={(text) => setCommentText(text)}
                />
                <TouchableOpacity style={styles1.commentButton} onPress={() => handleCommentPost(item.id)}>
                  <Text style={{ color: 'white' }}>ส่ง</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
        {/* Comment Modal */}
        <Modal animationType="slide" transparent={true} visible={modalVisible}>
          <View style={styles1.modalContainer}>
            <View style={styles1.modalContent}>
              <Text style={styles1.modalTitle}>ความคิดเห็น</Text>
              <FlatList
                data={comments}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <View style={styles1.commentItem}>
                    <Text style={styles1.commentText}>{item.message}</Text>
                  </View>
                )}
              />
              <TouchableOpacity style={styles1.modalCloseButton} onPress={() => setModalVisible(false)}>
                <Text style={styles1.modalCloseButtonText}>ปิด</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </View>
  );
}

const styles1 = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fbfbfb',
    paddingTop: 40,
  },
  post: {
    borderWidth: 1.2,
    borderColor: '#dfe4ea',
    borderRadius: 4,
    backgroundColor: '#fff',
    marginTop: 20,
  },
  postHeader: { padding: 6, flexDirection: 'row', alignItems: 'center' },
  postContentImage: {
    width: '100%',
    height: 300,
    borderRadius: 10,
    marginTop: 10,
  },
  interactionBar: {
    backgroundColor: '#fafafa',
    height: 40,
    marginHorizontal: 20,
    marginTop: -20,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  interactionText: {
    fontFamily: 'NSRegular',
    color: '#000',
    marginLeft: 4,
  },
  interactionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    width: '90%',
  },
  modalTitle: {
    fontFamily: 'NSBold',
    fontSize: 18,
    marginBottom: 10,
  },
  commentItem: {
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#dfe4ea',
  },
  commentText: {
    fontFamily: 'NSRegular',
    fontSize: 14,
  },
  modalCloseButton: {
    backgroundColor: 'blue',
    borderRadius: 4,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignSelf: 'flex-end',
    marginTop: 10,
  },
  modalCloseButtonText: {
    color: '#fff',
  },
  commentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    marginHorizontal: 20,
  },
  commentInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#dfe4ea',
    borderRadius: 4,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginRight: 10,
  },
  commentButton: {
    backgroundColor: 'blue',
    borderRadius: 4,
    paddingHorizontal: 16,
    paddingVertical: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
