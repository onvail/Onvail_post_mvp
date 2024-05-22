import React, {FunctionComponent} from 'react';
import {TouchableOpacity, View} from 'react-native';
import {useForm, Controller} from 'react-hook-form';
import CustomText from 'app/components/Text/CustomText';
import tw from 'lib/tailwind';
import {AuthStackParamList} from 'src/app/navigator/types/AuthStackParamList';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import ErrorText from 'src/app/components/Text/ErrorText';
import RowContainer from 'src/app/components/View/RowContainer';
import Icon from 'src/app/components/Icons/Icon';
import AuthScreenContainer from 'src/app/components/Screens/AuthScreenContainer';
import CustomDropDown from 'src/app/components/Dropdown/CustomDropDown';
import {roles} from 'src/utils/roles';
import {UserType} from 'src/types/authType';
import {SignUpStoreState, useSignUpStore} from 'src/app/zustand/store';

type Props = NativeStackScreenProps<AuthStackParamList, 'Signup'>;

const RoleInput: FunctionComponent<Props> = ({navigation}) => {
  const defaultValues: {
    userType: UserType;
  } = {
    userType: UserType.Other,
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

  const onSubmit = async ({userType}: {userType: UserType}) => {
    updateUserSignUpStore({
      ...storeUser,
      userType,
    });
    navigation.navigate('FullNameInput');
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
          What’s your role in the music industry?
        </CustomText>
        <View>
          <ErrorText>{errors?.userType?.message}</ErrorText>
          <Controller
            control={control}
            rules={{
              required: 'select your role',
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

export default RoleInput;
