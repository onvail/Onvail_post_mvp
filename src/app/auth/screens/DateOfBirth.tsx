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
import CustomCalendar from 'src/app/components/Calendar/CustomCalendar';
import RowContainer from 'src/app/components/View/RowContainer';
import Icon from 'src/app/components/Icons/Icon';
import Modal from 'react-native-modal/dist/modal';
import CustomTimePicker from 'src/app/components/Calendar/CustomTimePicker';
import FormSelector from 'src/app/party/components/FormSelector';

type Props = NativeStackScreenProps<AuthStackParamList, 'Signup'>;

const DateOfBirth: FunctionComponent<Props> = ({navigation}) => {
  const [
    isApplicationaClosingDatePickerVisible,
    setIsApplicationClosingDatePickerVisible,
  ] = useState<boolean>(false);

  const defaultValues = {
    dateofbirth: '',
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
          What’s your date of birth?
        </CustomText>
        <View style={tw``}>
          <ErrorText>{errors?.dateofbirth?.message}</ErrorText>
          <Controller
            control={control}
            rules={{
              required: 'Date of birth required',
            }}
            render={({field: {onChange}}) => (
              <CustomCalendar
                isCalendarVisible={isApplicationaClosingDatePickerVisible}
                onBackDropPress={() =>
                  setIsApplicationClosingDatePickerVisible(false)
                }
                onDateSelected={date => {
                  onChange(date);
                  setIsApplicationClosingDatePickerVisible(false);
                }}
              />
            )}
            name="dateofbirth"
          />
          <Controller
            control={control}
            rules={{
              required: 'Date of birth required',
            }}
            render={({field: {value}}) => (
              <FormSelector
                description="Date of birth"
                instruction="Today"
                icon="calendar-month"
                onPress={() => {
                  setIsApplicationClosingDatePickerVisible(true);
                }}
                value={value}
              />
            )}
            name="dateofbirth"
          />
        </View>
      </View>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => navigation.navigate('GenderInput')}
        style={tw`w-1/4 rounded-12 bg-[#7C1AFC] self-center mt-5 py-4.5`}>
        <CustomText style={tw`text-white text-center font-bold text-lg`}>
          Next
        </CustomText>
      </TouchableOpacity>
    </ImageBackground>
  );
};

export default DateOfBirth;
