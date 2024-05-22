import React, {FunctionComponent} from 'react';
import {ScrollView, TouchableOpacity, View} from 'react-native';
import CustomText from 'app/components/Text/CustomText';
import tw from 'lib/tailwind';
import {AuthStackParamList} from 'src/app/navigator/types/AuthStackParamList';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import AuthScreenContainer from 'src/app/components/Screens/AuthScreenContainer';

type Props = NativeStackScreenProps<AuthStackParamList, 'Signup'>;

const AccountCreated: FunctionComponent<Props> = ({navigation}) => {
  return (
    <AuthScreenContainer>
      <View>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={tw`mt-12 px-3`}>
            <View style={tw`mt-32`}>
              <CustomText
                style={tw`text-2xl font-bold text-white text-center mx-auto mb-2`}>
                All done!
              </CustomText>
              <CustomText
                style={tw`text-lg font-poppinsRegular text-white text-center mx-auto`}>
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
    </AuthScreenContainer>
  );
};

export default AccountCreated;
