import React, {FunctionComponent} from 'react';
import {View, TouchableOpacity} from 'react-native';
import tw from 'src/lib/tailwind';
import CustomImage from 'src/app/components/Image/CustomImage';
import RowContainer from 'src/app/components/View/RowContainer';
import CustomText from 'src/app/components/Text/CustomText';
import {generalIcon} from 'src/app/components/Icons/generalIcons';

export interface PartyProps {
  banner: string;
  username: string;
  partytitle: string;
  datetime: string;
  showStartButton: boolean;
  onClickStart: any;
}

const PartyCard: FunctionComponent<PartyProps> = ({
  banner,
  username,
  partytitle,
  datetime,
  showStartButton,
  onClickStart,
}) => {
  const ShareIcon = generalIcon.ShareIcon;
  return (
    <RowContainer style={tw`pb-7 mb-8 border-b border-[#4C4C4C]`}>
      <View style={tw`w-[40%]`}>
        <CustomImage
          uri={banner}
          style={tw`h-42 w-[100%] rounded-4`}
          resizeMode="cover"
        />
      </View>
      <View style={tw`ml-3 w-[60%]`}>
        <RowContainer>
          <CustomImage
            uri={
              'https://resizing.flixster.com/xkP-QzPdNnU1Q8KQuBB6Q0YCeTU=/218x280/v2/https://resizing.flixster.com/-XZAfHZM39UwaGJIFWKAE8fS0ak=/v3/t/assets/371287_v9_bc.jpg'
            }
            style={tw`h-11 w-11 rounded-full `}
            resizeMode="cover"
          />
          <RowContainer style={tw`ml-1`}>
            <CustomText style={tw`text-[13px] text-[#808080]`}>
              Planned by{' '}
            </CustomText>
            <CustomText style={tw`text-[13px] font-bold text-white`}>
              {username}
            </CustomText>
          </RowContainer>
        </RowContainer>
        <CustomText style={tw`text-[13px] font-medium text-white mt-1`}>
          {partytitle}
        </CustomText>
        <CustomText style={tw`text-[13px] font-medium text-[#808080]`}>
          {datetime}
        </CustomText>
        <RowContainer style={tw`mt-4`}>
          {showStartButton && (
            <TouchableOpacity
              onPress={onClickStart}
              activeOpacity={0.9}
              style={tw`px-5 py-1.5 bg-[#7C1AFC] rounded-13 mr-2`}>
              <CustomText style={tw`text-[13px] font-medium text-white`}>
                Start
              </CustomText>
            </TouchableOpacity>
          )}
          <ShareIcon />
        </RowContainer>
      </View>
    </RowContainer>
  );
};

export default PartyCard;
