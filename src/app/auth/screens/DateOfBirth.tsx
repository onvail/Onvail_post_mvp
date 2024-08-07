import React, {FunctionComponent, useState} from 'react';
import {TouchableOpacity, View} from 'react-native';
import {useForm, Controller} from 'react-hook-form';
import CustomText from 'app/components/Text/CustomText';
import tw from 'lib/tailwind';
import {AuthStackParamList} from 'src/app/navigator/types/AuthStackParamList';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import ErrorText from 'src/app/components/Text/ErrorText';
import RowContainer from 'src/app/components/View/RowContainer';
import Icon from 'src/app/components/Icons/Icon';
import FormSelector from 'src/app/party/components/FormSelector';
import {SignUpStoreState, useSignUpStore} from 'src/app/zustand/store';
import AuthScreenContainer from 'src/app/components/Screens/AuthScreenContainer';
import DatePicker from 'react-native-date-picker';
import moment from 'moment-timezone';

type Props = NativeStackScreenProps<AuthStackParamList, 'Signup'>;

const DateOfBirth: FunctionComponent<Props> = ({navigation}) => {
  const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState(false);

  const defaultValues: {dateOfBirth: string} = {
    dateOfBirth: '',
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

  const onSubmit = async ({dateOfBirth}: {dateOfBirth: string}) => {
    updateUserSignUpStore({
      ...storeUser,
      dateOfBirth,
    });
    navigation.navigate('GenderInput');
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
          What’s your date of birth?
        </CustomText>
        <View style={tw``}>
          <ErrorText>{errors?.dateOfBirth?.message}</ErrorText>
          <Controller
            control={control}
            rules={{
              required: 'Date of birth required',
            }}
            render={({field: {onChange}}) => (
              <DatePicker
                modal
                theme="dark"
                mode="date"
                open={open}
                title={null}
                date={date}
                onConfirm={calendarDate => {
                  setOpen(false);
                  setDate(calendarDate);
                  onChange(calendarDate);
                }}
                onCancel={() => {
                  setOpen(false);
                }}
              />
            )}
            name="dateOfBirth"
          />
          <Controller
            control={control}
            rules={{
              required: 'Date of birth required',
            }}
            render={({field: {value}}) => (
              <FormSelector
                description={
                  value
                    ? moment(value).format('DD, MMMM YYYY')
                    : 'Date of birth'
                }
                instruction="Today"
                icon="calendar-month"
                onPress={() => {
                  setOpen(true);
                }}
                value={value}
              />
            )}
            name="dateOfBirth"
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

export default DateOfBirth;
