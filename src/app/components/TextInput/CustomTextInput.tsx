import React, {FunctionComponent} from 'react';
import {TextInput, TextInputProps, View} from 'react-native';
import tw from 'lib/tailwind';
import {Colors} from 'app/styles/colors';
import Icon from 'app/components/Icons/Icon';

interface Props extends TextInputProps {
  inputType?: 'Password' | 'Text';
  passwordVisibility?: boolean;
  handlePasswordVisibility?: () => void;
}

const CustomTextInput: FunctionComponent<Props> = ({
  inputType,
  passwordVisibility,
  handlePasswordVisibility,
  ...props
}) => {
  return (
    <View
      style={tw`bg-white h-12 rounded-md mb-6 justify-between flex-row items-center px-3`}>
      <TextInput
        placeholderTextColor={Colors.grey}
        style={tw` font-poppinsRegular text-sm w-10/11  text-primary`}
        {...props}
      />
      {inputType === 'Password' && (
        <Icon
          name={passwordVisibility ? 'eye-off' : 'eye'}
          color={Colors.purple}
          onPress={handlePasswordVisibility}
        />
      )}
    </View>
  );
};

export default CustomTextInput;
