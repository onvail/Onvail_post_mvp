import React, {FunctionComponent} from 'react';
import {TextStyle, Text, TextProps} from 'react-native';
import tw from 'lib/tailwind';

interface Props extends TextProps {
  children: React.ReactNode;
  style?: TextStyle;
}

const CustomText: FunctionComponent<Props> = ({children, style, ...props}) => {
  const customTextStyle = tw`font-poppinsRegular text-white`;
  return (
    <Text style={[customTextStyle, style]} {...props}>
      {children}
    </Text>
  );
};

export default CustomText;
