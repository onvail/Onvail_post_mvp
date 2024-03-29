import React, {FunctionComponent, useState} from 'react';
import {View} from 'react-native';
import CustomText from 'app/components/Text/CustomText';
import tw from 'lib/tailwind';
import CustomTextInput from 'app/components/TextInput/CustomTextInput';
import ProceedBtn from 'src/app/components/Buttons/ProceedBtn';
import CustomDropDown from 'src/app/components/Dropdown/CustomDropDown';
import {roles} from 'src/utils/roles';
import {AuthStackParamList} from 'src/app/navigator/types/AuthStackParamList';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {generalIcon} from 'src/app/components/Icons/generalIcons';

type Props = NativeStackScreenProps<AuthStackParamList, 'Signup'>;

const Signup: FunctionComponent<Props> = ({navigation}) => {
  const BackgroundGradientSvg = generalIcon.BackgroundGradient;
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
  return (
    <View style={tw`relative pt-13`}>
      <BackgroundGradientSvg style={tw`absolute h-full w-full -z-10`} />
      <View style={tw`m-8 z-10 mt-12`}>
        <View>
          <CustomText style={tw`text-4xl`}>Signup</CustomText>
          <CustomText style={tw`text-sm mt-3`}>
            Sign up as an artist to start a listening party or as a guest to
            join a listening party
          </CustomText>
        </View>
        <View style={tw`mt-12`}>
          <CustomTextInput placeholder="stage name" />
          <CustomTextInput placeholder="Email" />
          <CustomTextInput
            placeholder="Password"
            secureTextEntry={isPasswordVisible}
            inputType="Password"
            passwordVisibility={isPasswordVisible}
            handlePasswordVisibility={() => setIsPasswordVisible(prev => !prev)}
          />
          <CustomDropDown
            data={roles}
            onChange={item => console.log(item.key)}
            labelField={'key'}
            valueField={'value'}
            maxHeight={250}
          />
        </View>
        <View style={tw`mt-20`}>
          <ProceedBtn title="Submit" onPress={() => {}} />
          <CustomText style={tw`mt-20 text-center`}>
            Already have an account?{' '}
            <CustomText
              style={tw`text-purple`}
              onPress={() => navigation.navigate('Login')}>
              Login
            </CustomText>
          </CustomText>
        </View>
      </View>
    </View>
  );
};

export default Signup;
