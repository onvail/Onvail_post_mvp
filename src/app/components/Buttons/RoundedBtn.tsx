import React, {FunctionComponent} from 'react';
import {Text, TouchableOpacity} from 'react-native';
import tw from 'lib/tailwind';

interface Props {
  title: string;
  borderColor: string;
  onPress: () => void;
}

const RoundedBtn: FunctionComponent<Props> = ({
  title,
  borderColor,
  onPress,
}) => {
  const style = tw`border border-${borderColor} justify-center items-center w-30 py-3 rounded-full`;
  return (
    <TouchableOpacity style={style} onPress={onPress}>
      <Text style={tw`text-white font-poppinsRegular`}>{title}</Text>
    </TouchableOpacity>
  );
};

export default RoundedBtn;
