import React, {FunctionComponent, useState} from 'react';
import {TouchableOpacity, View} from 'react-native';
import ScreenContainer from 'components/Screens/ScreenContainer';
import tw from 'src/lib/tailwind';
import CustomText from 'src/app/components/Text/CustomText';
import {generalIcon} from 'src/app/components/Icons/generalIcons';
import CustomImage from 'src/app/components/Image/CustomImage';
import RowContainer from 'src/app/components/View/RowContainer';
import LinearGradient from 'react-native-linear-gradient';

const SongReviewSuccess: FunctionComponent = ({navigation}) => {
  const TickIconSvg = generalIcon.Tick;

  return (
    <ScreenContainer>
      <View style={tw`px-4 flex-1`}>
        <View
          style={tw`h-34 w-34 self-center rounded-full mb-24 mt-28 bg-[#7C1AFC] items-center justify-center`}>
          <TickIconSvg />
        </View>
        <View style={tw`mb-5`}>
          <CustomText style={tw`font-bold text-center text-xl`}>
            All songs have been reviewed{' '}
          </CustomText>
          <CustomText style={tw`font-semibold text-center text-xs mt-1`}>
            You will be notified when its party time.
          </CustomText>
        </View>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() =>
            navigation.navigate('BottomTabNavigator', {
              screen: 'Home',
            })
          }
          style={tw`w-[100%] py-4.5 absolute bottom-14 left-[4%] bg-[#7C1AFC] rounded-10`}>
          <CustomText style={tw`font-bold text-white text-center text-lg`}>
            Return to home screen
          </CustomText>
        </TouchableOpacity>
      </View>
    </ScreenContainer>
  );
};

export default SongReviewSuccess;
