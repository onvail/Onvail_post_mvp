import React, {FunctionComponent} from 'react';
import {TouchableOpacity, View} from 'react-native';
import {useForm, Controller} from 'react-hook-form';
import CustomText from 'app/components/Text/CustomText';
import tw from 'lib/tailwind';
import CustomDropDown from 'src/app/components/Dropdown/CustomDropDown';
import {AuthStackParamList} from 'src/app/navigator/types/AuthStackParamList';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import ErrorText from 'src/app/components/Text/ErrorText';
import {SignUpStoreState, useSignUpStore} from 'src/app/zustand/store';

import RowContainer from 'src/app/components/View/RowContainer';
import Icon from 'src/app/components/Icons/Icon';
import {genderOptions} from 'src/utils/gender';
import AuthScreenContainer from 'src/app/components/Screens/AuthScreenContainer';

type Props = NativeStackScreenProps<AuthStackParamList, 'Signup'>;

const GenderInput: FunctionComponent<Props> = ({navigation}) => {
  const defaultValues: {
    gender: 'male' | 'female';
  } = {
    gender: 'male',
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

  const onSubmit = async ({gender}: {gender: 'male' | 'female'}) => {
    updateUserSignUpStore({
      ...storeUser,
      gender,
    });
    navigation.navigate('AlmostThere');
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
        onPress={handleSubmit(onSubmit)}
        style={tw`w-1/4 rounded-12 bg-[#7C1AFC] self-center mt-5 py-4.5`}>
        <CustomText style={tw`text-white text-center font-bold text-lg`}>
          Next
        </CustomText>
      </TouchableOpacity>
    </AuthScreenContainer>
  );
};

export default GenderInput;
