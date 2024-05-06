import React, {FunctionComponent} from 'react';
import {
  ActivityIndicator,
  Text,
  TextStyle,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import tw from 'lib/tailwind';

interface Props {
  title: string;
  onPress: () => void;
  containerStyle?: ViewStyle;
  textStyle?: TextStyle;
  isLoading?: boolean;
}

const ProceedBtn: FunctionComponent<Props> = ({
  title,
  onPress,
  containerStyle,
  textStyle,
  isLoading,
}) => {
  const proceedBtnStyle = tw`bg-transparent border py-3 rounded-md justify-center items-center border-white`;
  const proceedBtnTextStyle = tw`text-white font-poppinsRegular`;
  return (
    <TouchableOpacity
      style={[proceedBtnStyle, containerStyle]}
      onPress={onPress}>
      {isLoading ? (
        <ActivityIndicator color="white" />
      ) : (
        <Text style={[proceedBtnTextStyle, textStyle]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

export default ProceedBtn;
