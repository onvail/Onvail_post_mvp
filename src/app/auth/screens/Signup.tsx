import React, {FunctionComponent, useEffect, useState} from 'react';
import {View} from 'react-native';
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

type Props = NativeStackScreenProps<AuthStackParamList, 'Signup'>;

const Signup: FunctionComponent<Props> = ({navigation}) => {
  const BackgroundGradientSvg = generalIcon.BackgroundGradient;
  const [isPasswordHidden, setIsPasswordHidden] = useState<boolean>(true);
  const [apnToken, setApnToken] = useState<string>('');
  const [signUpError, setSignUpError] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const defaultValues: SignInProps = {
    name: '',
    email: '',
    password: '',
    stageName: '',
    userType: '' as UserType,
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
      navigation.replace('BottomTabNavigator', {
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
    <View style={tw`relative pt-13`}>
      <BackgroundGradientSvg style={tw`absolute h-full w-full -z-10`} />
      <View style={tw`m-8 z-10 mt-12`}>
        <View>
          <CustomText style={tw`text-4xl`}>Signup</CustomText>
          <CustomText style={tw`text-sm mt-3`}>
            Sign up as an artist to start a listening party or as a guest to
            join a listening party
          </CustomText>
        </View>
        <View style={tw`mt-12`}>
          <View>
            <ErrorText>{errors?.name?.message}</ErrorText>
            <Controller
              control={control}
              rules={{
                required: 'name is required',
                maxLength: 30,
              }}
              render={({field: {onChange, onBlur, value}}) => (
                <CustomTextInput
                  placeholder="name"
                  onChangeText={onChange}
                  value={value}
                  onBlur={onBlur}
                />
              )}
              name="name"
            />
          </View>
          <View>
            <ErrorText>{errors?.stageName?.message}</ErrorText>
            <Controller
              control={control}
              rules={{
                required: 'stage name is required',
                maxLength: 30,
              }}
              render={({field: {onChange, onBlur, value}}) => (
                <CustomTextInput
                  placeholder="stage name"
                  onChangeText={onChange}
                  value={value}
                  onBlur={onBlur}
                />
              )}
              name="stageName"
            />
          </View>
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
          <View>
            <ErrorText>{errors?.password?.message}</ErrorText>
            <Controller
              control={control}
              rules={{
                required: 'password is required',
                minLength: 5,
              }}
              render={({field: {onChange, onBlur, value}}) => (
                <CustomTextInput
                  placeholder="password"
                  onChangeText={onChange}
                  value={value}
                  onBlur={onBlur}
                  secureTextEntry={isPasswordHidden}
                  inputType="Password"
                  passwordVisibility={isPasswordHidden}
                  handlePasswordVisibility={() =>
                    setIsPasswordHidden(prev => !prev)
                  }
                />
              )}
              name="password"
            />
          </View>
          <View>
            <ErrorText>{errors?.userType?.message}</ErrorText>
            <Controller
              control={control}
              rules={{
                required: 'select a user type',
              }}
              render={({field: {onChange, onBlur, value}}) => (
                <CustomDropDown
                  data={roles}
                  onChange={item => onChange(item.value)}
                  labelField={'key'}
                  valueField={'value'}
                  maxHeight={250}
                  value={value}
                  onBlur={onBlur}
                  placeholder="Select user type"
                />
              )}
              name="userType"
            />
          </View>
          <View style={tw`items-center justify-center mt-3`}>
            {signUpError && <ErrorText>{signUpError}</ErrorText>}
          </View>
        </View>
        <View style={tw`mt-16`}>
          <ProceedBtn
            title="Submit"
            isLoading={isLoading}
            onPress={handleSubmit(onSubmit)}
          />
          <CustomText style={tw`mt-16 text-center`}>
            Already have an account?{' '}
            <CustomText
              style={tw`text-purple`}
              onPress={() => navigation.navigate('Login')}>
              Login
            </CustomText>
          </CustomText>
        </View>
      </View>
    </View>
  );
};

export default Signup;
