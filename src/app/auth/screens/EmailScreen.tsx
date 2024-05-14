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

const EmailInput: FunctionComponent<Props> = ({navigation}) => {
  const EmailBackgroundGradientSvg = generalIcon.EmailBackgroundGradient;
  const [isPasswordHidden, setIsPasswordHidden] = useState<boolean>(true);
  const [apnToken, setApnToken] = useState<string>('');
  const [signUpError, setSignUpError] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const defaultValues: SignInProps = {
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
  const onSubmit = async (data: SignInProps) => {
    setIsLoading(true);
    setSignUpError(undefined);
    const formData = {
      ...data,
      FCMToken: apnToken,
    };
    try {
      const response = await api.post({
        url: 'users/register',
        data: formData,
      });
      AsyncStorage.multiSet([
        [localStorageKeys.accessToken, response?.data?.accessToken],
        [localStorageKeys.userInfo, JSON.stringify(response?.data)],
      ]);
      navigation.navigate('BottomTabNavigator', {
        screen: 'Home',
      });
    } catch (err: unknown) {
      const error = err as AuthError;
      console.log(error.response?.data);
      setSignUpError(error?.response?.data?.message);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    requestUserPermission();
  }, []);

  const requestUserPermission = async () => {
    try {
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;
      if (enabled) {
        const push_notification_token = await messaging().getToken();
        setApnToken(push_notification_token);
      }
    } catch (error) {
      console.log('error', error);
    }
  };

  return (
    <ImageBackground
      source={require('../../../assets/emailbg.png')}
      resizeMode="cover"
      style={tw`w-full h-full`}>
      <View style={tw`mt-12 px-3`}>
        <RowContainer style={tw`mb-12 mt-3 items-center`}>
          <Icon
            onPress={() => navigation.goBack()}
            icon={'chevron-left'}
            color="white"
            size={30}
          />
          <CustomText style={tw`text-lg ml-24`}>Create account</CustomText>
        </RowContainer>
        <CustomText style={tw`text-white font-bold text-lg relative top-4`}>
          What’s your email?
        </CustomText>
        <View>
          <ErrorText>{errors?.email?.message}</ErrorText>
          <Controller
            control={control}
            rules={{
              required: 'email is required',
              pattern: {
                value: /^[+a-zA-Z0-9._+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/,
                message: 'Invalid email address',
              },
            }}
            render={({field: {onChange, onBlur, value}}) => (
              <CustomTextInput
                placeholder="email"
                onChangeText={onChange}
                value={value}
                onBlur={onBlur}
              />
            )}
            name="email"
          />
        </View>
        <CustomText style={tw`text-white text-sm relative font-medium -top-2`}>
          You’ll beed to confirm this email later
        </CustomText>
      </View>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => navigation.navigate('PasswordInput')}
        style={tw`w-1/4 rounded-12 bg-[#7C1AFC] self-center mt-5 py-4.5`}>
        <CustomText style={tw`text-white text-center font-bold text-lg`}>
          Next
        </CustomText>
      </TouchableOpacity>
    </ImageBackground>
  );
};

export default EmailInput;
