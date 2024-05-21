import React, {FunctionComponent, useEffect, useState} from 'react';
import {ImageBackground, TouchableOpacity, View} from 'react-native';
import {useForm, Controller} from 'react-hook-form';
import CustomText from 'app/components/Text/CustomText';
import tw from 'lib/tailwind';
import CustomTextInput from 'app/components/TextInput/CustomTextInput';
import ProceedBtn from 'src/app/components/Buttons/ProceedBtn';
import CustomDropDown from 'src/app/components/Dropdown/CustomDropDown';
import {roles} from 'src/utils/roles';
import {AuthStackParamList} from 'src/app/navigator/types/AuthStackParamList';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {generalIcon} from 'src/app/components/Icons/generalIcons';
import {AuthError, SignInProps, UserType} from 'src/types/authType';
import ErrorText from 'src/app/components/Text/ErrorText';
import api from 'src/api/api';
import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import localStorageKeys from 'src/api/config/local-storage-keys';
import ScreenContainer from 'src/app/components/Screens/ScreenContainer';
import RowContainer from 'src/app/components/View/RowContainer';
import Icon from 'src/app/components/Icons/Icon';

type Props = NativeStackScreenProps<AuthStackParamList, 'Signup'>;

const ResetPassword: FunctionComponent<Props> = ({navigation}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
  const [isPasswordVisible2, setIsPasswordVisible2] = useState<boolean>(false);
  const defaultValues = {
    password: '',
    password_confirmation: '',
  };

  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm({
    defaultValues: defaultValues,
    mode: 'all',
  });

  const onSubmit = async () => {
    navigation.navigate('OtpInput');
  };

  return (
    <ImageBackground
      source={require('../../../assets/passwordbg.png')}
      resizeMode="cover"
      style={tw`w-full h-full`}>
      <View style={tw`mt-30 px-3`}>
        <View style={tw`mb-3`}>
          <CustomText style={tw`w-full text-white font-bold text-4xl`}>
            New
          </CustomText>
          <CustomText
            style={tw`w-full text-white font-bold text-4xl relative -top-0.5`}>
            Password
          </CustomText>
        </View>
        <CustomText style={tw`w-full text-white font-medium text-xs mb-3`}>
          Enter your new password, we suggest that you add special characters to
          tighten security.
        </CustomText>
        <View>
          <ErrorText>{errors?.password?.message}</ErrorText>
          <Controller
            control={control}
            rules={{
              required: 'password is required',
              minLength: 4,
            }}
            render={({field: {onChange, onBlur, value}}) => (
              <CustomTextInput
                placeholder="New Password"
                onChangeText={onChange}
                value={value}
                onBlur={onBlur}
                secureTextEntry={!isPasswordVisible}
                inputType="Password"
                passwordVisibility={isPasswordVisible}
                handlePasswordVisibility={() =>
                  setIsPasswordVisible(prev => !prev)
                }
              />
            )}
            name="password"
          />
        </View>
        <View>
          <ErrorText>{errors?.password?.message}</ErrorText>
          <Controller
            control={control}
            rules={{
              required: 'password is required',
              minLength: 4,
            }}
            render={({field: {onChange, onBlur, value}}) => (
              <CustomTextInput
                placeholder="Confirm Password"
                onChangeText={onChange}
                value={value}
                onBlur={onBlur}
                secureTextEntry={!isPasswordVisible2}
                inputType="Password"
                passwordVisibility={isPasswordVisible2}
                handlePasswordVisibility={() =>
                  setIsPasswordVisible2(prev => !prev)
                }
              />
            )}
            name="password_confirmation"
          />
        </View>
      </View>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={handleSubmit(onSubmit)}
        style={tw`w-11/12 self-center rounded-12 border border-[#ffffff] self-center mt-6 py-4.5`}>
        <CustomText style={tw`text-white text-center font-bold text-lg`}>
          Save
        </CustomText>
      </TouchableOpacity>
    </ImageBackground>
  );
};

export default ResetPassword;
