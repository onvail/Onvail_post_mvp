import React, {FunctionComponent, useState} from 'react';
import {
  ActivityIndicator,
  ImageBackground,
  TouchableOpacity,
  View,
} from 'react-native';
import {useForm, Controller} from 'react-hook-form';
import CustomText from 'app/components/Text/CustomText';
import tw from 'lib/tailwind';
import CustomTextInput from 'app/components/TextInput/CustomTextInput';
import {AuthStackParamList} from 'src/app/navigator/types/AuthStackParamList';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AuthError, LoginProps} from 'src/types/authType';
import ErrorText from 'src/app/components/Text/ErrorText';
import api from 'src/api/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import localStorageKeys from 'src/api/config/local-storage-keys';
import RowContainer from 'src/app/components/View/RowContainer';

type Props = NativeStackScreenProps<AuthStackParamList, 'Signup'>;

const Login: FunctionComponent<Props> = ({navigation}) => {
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
      navigation.replace('BottomTabNavigator', {
        screen: 'Home',
      });
    } catch (err: unknown) {
      const error = err as AuthError;
      setLoginError(error?.response?.data?.message);
    }
    setIsLoading(false);
  };

  return (
    <ImageBackground
      source={require('../../../assets/passwordbg.png')}
      resizeMode="cover"
      style={tw`w-full h-full`}>
      <View style={tw`mt-30 px-3`}>
        <CustomText
          style={tw`text-white font-bold text-4xl relative top-4 mb-5`}>
          Sign in
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
        <RowContainer style={tw`items-center justify-between px-3`}>
          <TouchableOpacity
            onPress={() => navigation.navigate('ForgotPassword')}
            activeOpacity={0.7}>
            <CustomText style={tw`text-white font-bold text-sm`}>
              Forgot Password?
            </CustomText>
          </TouchableOpacity>
          <CustomText style={tw`text-white font-bold text-sm`}>
            Remember me
          </CustomText>
        </RowContainer>
      </View>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={handleSubmit(onSubmit)}
        style={tw`w-11/12 self-center rounded-12 border border-[#ffffff] mt-12 py-4.5`}>
        {isLoading ? (
          <ActivityIndicator />
        ) : (
          <CustomText style={tw`text-white text-center font-bold text-lg`}>
            Sign in
          </CustomText>
        )}
      </TouchableOpacity>
    </ImageBackground>
  );
};

export default Login;
