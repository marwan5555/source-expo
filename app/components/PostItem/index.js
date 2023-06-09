import React from 'react';
import {View, TouchableOpacity} from 'react-native';
import {Image, Text, Icon} from '@components';
import styles from './styles';
import PropTypes from 'prop-types';
import {BaseColor, useTheme} from '@config';
export default function PostItem(props) {
  const {colors} = useTheme();
  const {style, children, title, description, onPress, image,check_in,check_out} = props;
  return (
    <View style={style}>
      {children}
      <TouchableOpacity  activeOpacity={0.9}>
        <Image style={styles.imagePost} source={{uri:image}} />
        <Icon
          name="bookmark"
          solid
          size={24}
          color={BaseColor.whiteColor}
          style={{position: 'absolute', top: 10, right: 10}}
        />
      </TouchableOpacity>
      <View style={[styles.content, {borderBottomColor: colors.border}]}>
        <Text headline semibold style={{marginBottom: 6}}>
          {title}
        </Text>
        <Text body2>สถานะ: {description}</Text>
        <Text body2>check in: {check_in}</Text>
        <Text body2>check out: {check_out}</Text>
      </View>
    </View>
  );
}

PostItem.propTypes = {
  image: PropTypes.node.isRequired,
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  children: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.arrayOf(PropTypes.element),
  ]),
  title: PropTypes.string,
  description: PropTypes.string,
  check_in: PropTypes.string,
  check_out: PropTypes.string,
  onPress: PropTypes.func,
};

PostItem.defaultProps = {
  image: '',
  title: '',
  check_in:'',
  check_out:'',
  description: '',
  style: {},
  onPress: () => {},
};
