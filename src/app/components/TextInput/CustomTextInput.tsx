import React, {FunctionComponent} from 'react';
import {TextInput, TextInputProps} from 'react-native';
import tw from 'lib/tailwind';
import {Colors} from 'app/styles/colors';

interface Props extends TextInputProps {}

const CustomTextInput: FunctionComponent<Props> = ({...props}) => {
  return (
    <TextInput
      placeholderTextColor={Colors.grey}
      style={tw`bg-white rounded-md font-poppinsRegular p-3 mb-6 text-primary`}
      {...props}
    />
  );
};

export default CustomTextInput;
