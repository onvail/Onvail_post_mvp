import React, {FunctionComponent} from 'react';
import {TextStyle, Text} from 'react-native';
import tw from 'lib/tailwind';

interface Props {
  children: React.ReactNode;
  style?: TextStyle;
}

const CustomText: FunctionComponent<Props> = ({children, style}) => {
  const customTextStyle = tw`font-poppinsRegular text-white`;
  return <Text style={[customTextStyle, style]}>{children}</Text>;
};

export default CustomText;
