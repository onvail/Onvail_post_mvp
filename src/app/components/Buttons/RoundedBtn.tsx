import React, {FunctionComponent} from 'react';
import {
  StyleProp,
  Text,
  TouchableOpacity,
  ViewStyle,
  TextStyle,
} from 'react-native';
import tw from 'lib/tailwind';

interface Props {
  title: string;
  borderColor?: string;
  onPress: () => void;
  containerStyle: StyleProp<ViewStyle>;
  textStyle: StyleProp<TextStyle>;
}

const RoundedBtn: FunctionComponent<Props> = ({
  title,
  borderColor,
  onPress,
  containerStyle,
  textStyle,
}) => {
  const style =
    containerStyle ??
    tw`border border-${
      borderColor ?? 'transparent'
    } justify-center items-center w-30 py-3 rounded-full`;
  textStyle = textStyle ?? tw`text-white font-poppinsRegular`;
  return (
    <TouchableOpacity style={style} onPress={onPress}>
      <Text style={textStyle}>{title}</Text>
    </TouchableOpacity>
  );
};

export default RoundedBtn;
