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
import {genderOptions} from 'src/utils/gender';

type Props = NativeStackScreenProps<AuthStackParamList, 'Signup'>;

const GenderInput: FunctionComponent<Props> = ({navigation}) => {
  const EmailBackgroundGradientSvg = generalIcon.EmailBackgroundGradient;
  const [isPasswordHidden, setIsPasswordHidden] = useState<boolean>(true);
  const [apnToken, setApnToken] = useState<string>('');
  const [signUpError, setSignUpError] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const defaultValues = {
    gender: '',
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
          What’s your gender?
        </CustomText>
        <View>
          <ErrorText>{errors?.gender?.message}</ErrorText>
          <Controller
            control={control}
            rules={{
              required: 'select a gender',
            }}
            render={({field: {onChange, onBlur, value}}) => (
              <CustomDropDown
                data={genderOptions}
                onChange={item => onChange(item.value)}
                labelField={'key'}
                valueField={'value'}
                maxHeight={250}
                value={value}
                onBlur={onBlur}
                placeholder="Select gender"
              />
            )}
            name="gender"
          />
        </View>
      </View>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => navigation.navigate('AlmostThere')}
        style={tw`w-1/4 rounded-12 bg-[#7C1AFC] self-center mt-5 py-4.5`}>
        <CustomText style={tw`text-white text-center font-bold text-lg`}>
          Next
        </CustomText>
      </TouchableOpacity>
    </ImageBackground>
  );
};

export default GenderInput;
