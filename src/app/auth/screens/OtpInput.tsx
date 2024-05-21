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
import OTPInput from 'src/app/components/TextInput/OTPInput';

type Props = NativeStackScreenProps<AuthStackParamList, 'Signup'>;

const OtpInput: FunctionComponent<Props> = ({navigation}) => {
  const defaultValues = {
    email: '',
  };

  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm({
    defaultValues: defaultValues,
    mode: 'all',
  });

  return (
    <ImageBackground
      source={require('../../../assets/passwordbg.png')}
      resizeMode="cover"
      style={tw`w-full h-full`}>
      <View style={tw`mt-30 px-3`}>
        <View style={tw`mb-3`}>
          <CustomText style={tw`w-full text-white font-bold text-4xl`}>
            Check your email
          </CustomText>
        </View>
        <CustomText style={tw`w-full text-white font-medium text-xs mb-3`}>
          Insert code sent to your email
        </CustomText>
        <View>
          <ErrorText>{errors?.email?.message}</ErrorText>
          <Controller
            control={control}
            rules={{
              required: 'code is required',
              pattern: {
                value: /^[+a-zA-Z0-9._+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/,
                message: 'Invalid code',
              },
            }}
            render={({field: {onChange, onBlur, value}}) => (
              <OTPInput onComplete={onChange} onChangeText={onChange} />
              //   <CustomTextInput
              //     placeholder="email"
              //     onChangeText={onChange}
              //     value={value}
              //     onBlur={onBlur}
              //   />
            )}
            name="email"
          />
        </View>
      </View>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => navigation.navigate('ResetPassword')}
        style={tw`w-9/12 self-center rounded-12 border border-[#ffffff] self-center mt-12 py-4.5`}>
        <CustomText style={tw`text-white text-center font-bold text-lg`}>
          Next
        </CustomText>
      </TouchableOpacity>
    </ImageBackground>
  );
};

export default OtpInput;
