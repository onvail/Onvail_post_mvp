import React, {FunctionComponent, useState} from 'react';
import {ImageBackground, TouchableOpacity, View} from 'react-native';
import {useForm, Controller} from 'react-hook-form';
import CustomText from 'app/components/Text/CustomText';
import tw from 'lib/tailwind';
import CustomTextInput from 'app/components/TextInput/CustomTextInput';
import {AuthStackParamList} from 'src/app/navigator/types/AuthStackParamList';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import ErrorText from 'src/app/components/Text/ErrorText';
import RowContainer from 'src/app/components/View/RowContainer';
import Icon from 'src/app/components/Icons/Icon';
import {SignUpStoreState, useSignUpStore} from 'src/app/zustand/store';

type Props = NativeStackScreenProps<AuthStackParamList, 'Signup'>;

const PasswordInput: FunctionComponent<Props> = ({navigation}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
  const updateUserSignUpStore = useSignUpStore(
    (state: SignUpStoreState) => state.updateUserSignUpStore,
  );
  const storeUser = useSignUpStore((state: SignUpStoreState) => state.user);

  const defaultValues: {password: string} = {
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

  const onSubmit = async ({password}: {password: string}) => {
    updateUserSignUpStore({
      ...storeUser,
      password,
    });
    navigation.navigate('DateOfBirth');
  };

  return (
    <ImageBackground
      source={require('../../../assets/passwordbg.png')}
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
        <CustomText style={tw`text-white font-bold text-lg relative `}>
          Create a password
        </CustomText>
        <View>
          <ErrorText>{errors?.password?.message}</ErrorText>
          <Controller
            control={control}
            rules={{
              required: 'password is required',
              minLength: {
                message: 'password must be at least 5 characters',
                value: 5,
              },
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
      </View>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={handleSubmit(onSubmit)}
        style={tw`w-1/4 rounded-12 bg-purple self-center mt-5 py-4.5`}>
        <CustomText style={tw`text-white text-center font-bold text-lg`}>
          Next
        </CustomText>
      </TouchableOpacity>
    </ImageBackground>
  );
};

export default PasswordInput;
