import React, {FunctionComponent, useEffect, useState} from 'react';
import {
  ImageBackground,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';
import {useForm} from 'react-hook-form';
import CustomText from 'app/components/Text/CustomText';
import tw from 'lib/tailwind';
import {AuthStackParamList} from 'src/app/navigator/types/AuthStackParamList';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {generalIcon} from 'src/app/components/Icons/generalIcons';
import RowContainer from 'src/app/components/View/RowContainer';
import Icon from 'src/app/components/Icons/Icon';

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
          style={tw`w-1/4 rounded-12 bg-[#7C1AFC] self-center mt-18 py-4.5`}>
          <CustomText style={tw`text-white text-center font-bold text-lg`}>
            Start
          </CustomText>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

export default AuthLanding;
