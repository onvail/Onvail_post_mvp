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

const AccountCreated: FunctionComponent<Props> = ({navigation}) => {
  return (
    <ImageBackground
      source={require('../../../assets/toubg.png')}
      resizeMode="cover"
      style={tw`w-full h-full`}>
      <View>
        <ScrollView showsVerticalScrollIndicator={false}>
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
            <View style={tw`mt-32`}>
              <CustomText
                style={tw`text-2xl font-bold text-white text-center mx-auto mb-2`}>
                All done!
              </CustomText>
              <CustomText
                style={tw`text-lg font-bold text-white text-center mx-auto`}>
                Thank you for verifying your email address.
              </CustomText>
            </View>
          </View>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() =>
              navigation.navigate('BottomTabNavigator', {
                screen: 'Home',
              })
            }
            style={tw`w-3/5 rounded-12 bg-[#7C1AFC] self-center mt-12 py-4.5`}>
            <CustomText style={tw`text-white text-center font-bold text-lg`}>
              Open Onvail
            </CustomText>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </ImageBackground>
  );
};

export default AccountCreated;
