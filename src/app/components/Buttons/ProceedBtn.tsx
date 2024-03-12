import React, {FunctionComponent} from 'react';
import {Text, TextStyle, TouchableOpacity, ViewStyle} from 'react-native';
import tw from 'lib/tailwind';

interface Props {
  title: string;
  onPress: () => void;
  containerStyle?: ViewStyle;
  textStyle?: TextStyle;
}

const ProceedBtn: FunctionComponent<Props> = ({
  title,
  onPress,
  containerStyle,
  textStyle,
}) => {
  const proceedBtnStyle = tw`bg-transparent border py-3 rounded-md justify-center items-center border-white`;
  const proceedBtnTextStyle = tw`text-white font-poppinsRegular`;
  return (
    <TouchableOpacity
      style={[proceedBtnStyle, containerStyle]}
      onPress={onPress}>
      <Text style={[proceedBtnTextStyle, textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
};

export default ProceedBtn;
