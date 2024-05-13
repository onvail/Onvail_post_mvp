import React, {FunctionComponent} from 'react';
import {Pressable, View} from 'react-native';
import {Avatar, Divider} from 'react-native-paper';
import Icon from 'src/app/components/Icons/Icon';
import ScreenContainer from 'src/app/components/Screens/ScreenContainer';
import useUser from 'src/app/hooks/useUserInfo';
import tw from 'src/lib/tailwind';
import Links from '../components/Links';
import RoundedBtn from 'src/app/components/Buttons/RoundedBtn';

const Settings: FunctionComponent = () => {
  const {user} = useUser();
  return (
    <ScreenContainer goBack screenHeader="Settings">
      <View style={tw`flex-1 mx-3 `}>
        <View style={tw`mt-12 justify-center items-center `}>
          <View style={tw`relative`}>
            <Avatar.Text
              style={tw`bg-purple items-center justify-center  rounded-full`}
              size={120}
              label={user?.name.substring(0, 1)!}
              labelStyle={tw`text-primary  font-poppinsRegular`}
            />
            <Pressable style={tw`absolute right-4 bottom-0`}>
              <Icon icon={'plus-circle'} color="white" size={27} />
            </Pressable>
          </View>
          <Divider style={tw`w-full mt-8`} />
        </View>
        <View style={tw`mt-4`}>
          <Links title="Reset Password" onPress={() => {}} />
          <Links title="Delete Account" onPress={() => {}} />
          <Links title="Contact Support" onPress={() => {}} />
          <Links title="About" onPress={() => {}} />
          <Links title="Feedback" onPress={() => {}} />
        </View>
        <View style={tw`flex-1 items-center justify-end mb-12`}>
          <RoundedBtn
            title="Log out"
            containerStyle={tw`bg-white w-1/4 items-center p-2 rounded-3xl`}
            textStyle={tw`text-primary font-poppinsMedium`}
            onPress={() => {}}
          />
        </View>
      </View>
    </ScreenContainer>
  );
};

export default Settings;
