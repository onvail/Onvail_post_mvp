import React, {FunctionComponent} from 'react';
import {View} from 'react-native';
import ScreenContainer from 'app/components/Screens/ScreenContainer';
import CustomText from 'app/components/Text/CustomText';
import tw from 'lib/tailwind';
import CustomTextInput from 'app/components/TextInput/CustomTextInput';
import ProceedBtn from 'src/app/components/Buttons/ProceedBtn';

const Signup: FunctionComponent = () => {
  return (
    <ScreenContainer>
      <View style={tw`m-8 mt-12`}>
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
          <CustomTextInput placeholder="Password" />
        </View>
        <View style={tw`mt-20`}>
          <ProceedBtn title="Submit" onPress={() => {}} />
          <CustomText style={tw`mt-20 text-center`}>
            Already have an account?{' '}
            <CustomText
              style={tw`text-purple`}
              onPress={() => console.log('hello')}>
              Login
            </CustomText>
          </CustomText>
        </View>
      </View>
    </ScreenContainer>
  );
};

export default Signup;
