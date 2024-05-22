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

type InitialValue = {
  country: string;
  city: string;
};

const LocationInput: FunctionComponent<Props> = ({navigation}) => {
  const defaultValues: InitialValue = {
    country: '',
    city: '',
  };

  const updateUserSignUpStore = useSignUpStore(
    (state: SignUpStoreState) => state.updateUserSignUpStore,
  );
  const storeUser = useSignUpStore((state: SignUpStoreState) => state.user);

  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm({
    defaultValues: defaultValues,
    mode: 'all',
  });

  const onSubmit = async ({country, city}: InitialValue) => {
    updateUserSignUpStore({
      ...storeUser,
      country,
      state: city,
    });
    navigation.navigate('RoleInput');
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
        <CustomText style={tw`text-white font-bold text-lg`}>
          What’s your location?
        </CustomText>
        <View>
          <ErrorText>{errors?.country?.message}</ErrorText>
          <Controller
            control={control}
            rules={{
              required: 'Country is required',
            }}
            render={({field: {onChange, onBlur, value}}) => (
              <CustomTextInput
                placeholder="Country"
                onChangeText={onChange}
                value={value}
                onBlur={onBlur}
              />
            )}
            name="country"
          />
        </View>
        <View>
          <ErrorText>{errors?.city?.message}</ErrorText>
          <Controller
            control={control}
            rules={{
              required: 'City is required',
            }}
            render={({field: {onChange, onBlur, value}}) => (
              <CustomTextInput
                placeholder="City"
                onChangeText={onChange}
                value={value}
                onBlur={onBlur}
              />
            )}
            name="city"
          />
        </View>
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

export default LocationInput;
