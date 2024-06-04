import React, {FunctionComponent} from 'react';
import {TouchableOpacity, View} from 'react-native';
import {useForm, Controller} from 'react-hook-form';
import CustomText from 'app/components/Text/CustomText';
import tw from 'lib/tailwind';
import CustomTextInput from 'app/components/TextInput/CustomTextInput';
import {AuthStackParamList} from 'src/app/navigator/types/AuthStackParamList';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import ErrorText from 'src/app/components/Text/ErrorText';
import RowContainer from 'src/app/components/View/RowContainer';
import Icon from 'src/app/components/Icons/Icon';
import AuthScreenContainer from 'src/app/components/Screens/AuthScreenContainer';
import {SignUpStoreState, useSignUpStore} from 'src/app/zustand/store';

type Props = NativeStackScreenProps<AuthStackParamList, 'Signup'>;

const UsernameInput: FunctionComponent<Props> = ({navigation}) => {
  const defaultValues: {
    stageName: string;
  } = {
    stageName: '',
  };

  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm({
    defaultValues: defaultValues,
    mode: 'all',
  });

  const updateUserSignUpStore = useSignUpStore(
    (state: SignUpStoreState) => state.updateUserSignUpStore,
  );
  const storeUser = useSignUpStore((state: SignUpStoreState) => state.user);

  const onSubmit = async ({stageName}: {stageName: string}) => {
    updateUserSignUpStore({
      ...storeUser,
      stageName,
    });
    navigation.navigate('TermsOfUse');
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
        <CustomText style={tw`text-white font-bold text-lg `}>
          Create your username
        </CustomText>
        <View>
          <ErrorText>{errors?.stageName?.message}</ErrorText>
          <Controller
            control={control}
            rules={{
              required: 'Username is required',
            }}
            render={({field: {onChange, onBlur, value}}) => (
              <CustomTextInput
                placeholder="Username"
                onChangeText={onChange}
                value={value}
                onBlur={onBlur}
              />
            )}
            name="stageName"
          />
        </View>
        <CustomText style={tw`text-white text-xs relative font-medium -mt-2`}>
          This appears on your Onvail profile.
        </CustomText>
      </View>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={handleSubmit(onSubmit)}
        style={tw`w-1/4 rounded-12 bg-[#7C1AFC] self-center mt-12 py-4.5`}>
        <CustomText style={tw`text-white text-center font-bold text-lg`}>
          Next
        </CustomText>
      </TouchableOpacity>
    </AuthScreenContainer>
  );
};

export default UsernameInput;
