import React, {FunctionComponent} from 'react';
import {ImageBackground, TouchableOpacity, View} from 'react-native';
import CustomText from 'app/components/Text/CustomText';
import tw from 'lib/tailwind';
import {AuthStackParamList} from 'src/app/navigator/types/AuthStackParamList';
import {NativeStackScreenProps} from '@react-navigation/native-stack';

type Props = NativeStackScreenProps<AuthStackParamList, 'Signup'>;

const AuthLanding: FunctionComponent<Props> = ({navigation}) => {
  return (
    <ImageBackground
      source={require('../../../assets/passwordbg.png')}
      resizeMode="cover"
      style={tw`w-full h-full`}>
      <View style={tw`flex-1 justify-center`}>
        <View style={tw`px-[5%]`}>
          <View>
            <CustomText
              style={tw`text-2xl font-bold text-white text-left mb-10`}>
              Welcome to Onvail!
            </CustomText>
            <CustomText
              style={tw`text-2xl w-[80%] font-bold text-white text-left`}>
              A quick sign-up and you’re on your way to the party!
            </CustomText>
          </View>
        </View>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => navigation.navigate('EmailInput')}
          style={tw`w-11/12 rounded-12 bg-[#7C1AFC] self-center mt-18 mb-9 py-4.5`}>
          <CustomText style={tw`text-white text-center font-bold text-lg`}>
            Sign Up
          </CustomText>
        </TouchableOpacity>
        <View style={tw`w-11/12 self-center`}>
          <CustomText
            style={tw`text-white text-left font-bold text-sm ml-4 mb-2`}>
            Already have an account?
          </CustomText>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => navigation.navigate('Login')}
            style={tw`w-full rounded-12 border border-[#ffffff] self-center py-4.5`}>
            <CustomText style={tw`text-white text-center font-bold text-lg`}>
              Sign in
            </CustomText>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};

export default AuthLanding;
