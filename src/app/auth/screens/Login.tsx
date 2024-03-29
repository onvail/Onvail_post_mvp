import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {FunctionComponent, useState} from 'react';
import {View} from 'react-native';
import ProceedBtn from 'src/app/components/Buttons/ProceedBtn';
import {generalIcon} from 'src/app/components/Icons/generalIcons';
import CustomText from 'src/app/components/Text/CustomText';
import CustomTextInput from 'src/app/components/TextInput/CustomTextInput';
import {AuthStackParamList} from 'src/app/navigator/types/AuthStackParamList';
import tw from 'src/lib/tailwind';

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

const Login: FunctionComponent<Props> = ({navigation}) => {
  const BackgroundGradientSvg = generalIcon.BackgroundGradient;
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
  return (
    <View style={tw`relative pt-13`}>
      <BackgroundGradientSvg style={tw`absolute h-full w-full -z-10`} />
      <View style={tw`m-8 z-10 mt-12`}>
        <View>
          <CustomText style={tw`text-4xl`}>Login</CustomText>
          <CustomText style={tw`mt-2 `}>
            Don't have an account?{'  '}
            <CustomText
              style={tw`text-purple`}
              onPress={() => navigation.navigate('Signup')}>
              Signup
            </CustomText>
          </CustomText>
        </View>
        <View style={tw`mt-12`}>
          <CustomTextInput placeholder="Email" />
          <CustomTextInput
            placeholder="Password"
            secureTextEntry={isPasswordVisible}
            passwordVisibility={isPasswordVisible}
            inputType="Password"
            handlePasswordVisibility={() => setIsPasswordVisible(prev => !prev)}
          />
          <CustomText style={tw`mt-10 text-center`}>
            Forgot Password?{'  '}
            <CustomText
              style={tw`text-purple`}
              onPress={() => navigation.navigate('Login')}>
              Reset
            </CustomText>
          </CustomText>
        </View>
        <ProceedBtn
          title="Submit"
          containerStyle={tw`mt-15`}
          onPress={() =>
            navigation.navigate('BottomTabNavigator', {
              screen: 'Home',
            })
          }
        />
      </View>
    </View>
  );
};

export default Login;
