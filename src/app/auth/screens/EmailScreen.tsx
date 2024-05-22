import React, {FunctionComponent, useEffect, useState} from 'react';
import {TouchableOpacity, View} from 'react-native';
import {useForm, Controller} from 'react-hook-form';
import CustomText from 'app/components/Text/CustomText';
import tw from 'lib/tailwind';
import CustomTextInput from 'app/components/TextInput/CustomTextInput';
import {AuthStackParamList} from 'src/app/navigator/types/AuthStackParamList';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import ErrorText from 'src/app/components/Text/ErrorText';
import messaging from '@react-native-firebase/messaging';
import RowContainer from 'src/app/components/View/RowContainer';
import Icon from 'src/app/components/Icons/Icon';
import {SignUpStoreState, useSignUpStore} from 'src/app/zustand/store';
import AuthScreenContainer from 'src/app/components/Screens/AuthScreenContainer';

type Props = NativeStackScreenProps<AuthStackParamList, 'Signup'>;

const EmailInput: FunctionComponent<Props> = ({navigation}) => {
  const [apnToken, setApnToken] = useState<string>('');
  const updateUserSignUpStore = useSignUpStore(
    (state: SignUpStoreState) => state.updateUserSignUpStore,
  );
  const storeUser = useSignUpStore((state: SignUpStoreState) => state.user);

  const defaultValues: {email: string} = {
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
  const onSubmit = async ({email}: {email: string}) => {
    updateUserSignUpStore({
      ...storeUser,
      email,
    });
    navigation.navigate('PasswordInput');
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
    <AuthScreenContainer>
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
        <CustomText style={tw`text-white font-bold text-lg relative`}>
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
        <CustomText style={tw`text-white text-xs relative font-medium -top-2`}>
          You’ll need to confirm this email later
        </CustomText>
      </View>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={handleSubmit(onSubmit)}
        style={tw`w-1/4 rounded-12 bg-purple self-center mt-5 py-4.5`}>
        <CustomText style={tw`text-white text-center font-bold text-lg`}>
          Next
        </CustomText>
      </TouchableOpacity>
    </AuthScreenContainer>
  );
};

export default EmailInput;
