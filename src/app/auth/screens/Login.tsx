import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {FunctionComponent, useState} from 'react';
import {View} from 'react-native';
import ProceedBtn from 'src/app/components/Buttons/ProceedBtn';
import {generalIcon} from 'src/app/components/Icons/generalIcons';
import CustomText from 'src/app/components/Text/CustomText';
import CustomTextInput from 'src/app/components/TextInput/CustomTextInput';
import {AuthStackParamList} from 'src/app/navigator/types/AuthStackParamList';
import tw from 'src/lib/tailwind';
import {useForm, Controller} from 'react-hook-form';
import {AuthError, LoginProps} from 'src/types/authType';
import ErrorText from 'src/app/components/Text/ErrorText';
import api from 'src/api/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import localStorageKeys from 'src/api/config/local-storage-keys';
import {BASE_URL} from '@env';

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

const Login: FunctionComponent<Props> = ({navigation}) => {
  const BackgroundGradientSvg = generalIcon.BackgroundGradient;
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
  const [loginError, setLoginError] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const defaultValues: LoginProps = {
    email: '',
    password: '',
  };

  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm({
    defaultValues: defaultValues,
    mode: 'all',
  });
  const onSubmit = async (data: LoginProps) => {
    setLoginError(undefined);
    setIsLoading(true);
    try {
      const response = await api.post({
        url: 'users/login',
        data,
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
      setLoginError(error?.response?.data?.message);
    }
    setIsLoading(false);
  };

  return (
    <View style={tw`relative pt-13`}>
      <BackgroundGradientSvg style={tw`absolute h-full w-full -z-10`} />
      <View style={tw`m-8 z-10 mt-12`}>
        <View>
          <CustomText style={tw`text-4xl`}>Login</CustomText>
          <CustomText style={tw`mt-2 `}>
            Don't have an account?{'  '}
            <CustomText
              style={tw`text-purple`}
              onPress={() => navigation.navigate('Signup')}>
              Signup
            </CustomText>
          </CustomText>
        </View>
        <View style={tw`mt-12`}>
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
                  secureTextEntry={isPasswordVisible}
                  inputType="Password"
                  passwordVisibility={isPasswordVisible}
                  handlePasswordVisibility={() =>
                    setIsPasswordVisible(prev => !prev)
                  }
                />
              )}
              name="password"
            />
            <View style={tw`items-center justify-center`}>
              {loginError && <ErrorText>{loginError}</ErrorText>}
            </View>
          </View>
          <CustomText style={tw`mt-10 text-center`}>
            Forgot Password?{'  '}
            <CustomText
              style={tw`text-purple`}
              onPress={() => navigation.navigate('Login')}>
              Reset
            </CustomText>
          </CustomText>
        </View>
        <ProceedBtn
          title="Submit"
          containerStyle={tw`mt-12`}
          onPress={handleSubmit(onSubmit)}
          isLoading={isLoading}
        />
      </View>
    </View>
  );
};

export default Login;
