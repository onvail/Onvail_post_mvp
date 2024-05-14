import React, {FunctionComponent} from 'react';
import {TextInput, TextInputProps, View, ViewStyle} from 'react-native';
import tw from 'lib/tailwind';
import {Colors} from 'app/styles/colors';
import Icon from 'app/components/Icons/Icon';

/**
 * @Props extends TextInputProps ensuring components gets access to every TextInput prop.
 * @inputType can either be undefined, Password or Text
 * @passwordVisibility defines if password characters are scrambled (using ***) or not.
 * @handlePasswordVisibility handles Icon press. In other words, toggles password visibility.
 */
interface Props extends TextInputProps {
  inputType?: 'Password' | 'Text';
  passwordVisibility?: boolean;
  handlePasswordVisibility?: () => void;
  backgroundColor?: string;
  borderColor?: string;
  borderWidth?: string;
  height?: number;
  containerStyle?: ViewStyle;
  placeHolderTextColor?: string;
  textColor?: string;
}

const CustomTextInput: FunctionComponent<Props> = ({
  inputType,
  passwordVisibility,
  handlePasswordVisibility,
  backgroundColor = 'white',
  borderColor = 'white',
  borderWidth = '0',
  height = 48,
  containerStyle,
  placeHolderTextColor = Colors.grey2,
  textColor = 'text-primary',
  ...props
}) => {
  return (
    <View
      style={[
        tw` rounded-md mb-3 justify-between flex-row items-center px-3`,
        {
          backgroundColor: backgroundColor,
          borderColor: borderColor,
          borderWidth: parseInt(borderWidth, 10),
          height: height,
        },
        containerStyle,
      ]}>
      <TextInput
        placeholderTextColor={placeHolderTextColor}
        style={tw`font-poppinsRegular text-sm w-10/11 ${textColor}`}
        {...props}
      />
      {/* if @inputType is Password display eye icon */}
      {inputType === 'Password' && (
        <Icon
          icon={passwordVisibility ? 'eye-off' : 'eye'}
          color={Colors.purple}
          onPress={handlePasswordVisibility}
        />
      )}
    </View>
  );
};

export default CustomTextInput;
