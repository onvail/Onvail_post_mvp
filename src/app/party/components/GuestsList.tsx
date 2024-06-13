import React, {FunctionComponent, useState} from 'react';
import {Pressable, View} from 'react-native';
import useUser, {User} from 'src/app/hooks/useUserInfo';
import CustomImage from 'src/app/components/Image/CustomImage';
import Icon from 'src/app/components/Icons/Icon';
import tw from 'src/lib/tailwind';
import CustomText from 'src/app/components/Text/CustomText';
import RowContainer from 'src/app/components/View/RowContainer';

const GuestsList: FunctionComponent<{
  item: User;
}> = ({item}) => {
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const {user} = useUser();
  const isHost = user?._id !== item?._id;
  return (
    <View style={tw`flex-1 h-full  m-1`}>
      <View style={tw`items-center flex-1 justify-center w-20 mr-4`}>
        {item?.image?.length > 0 ? (
          <CustomImage uri={item?.image} style={tw`h-14 w-14 rounded-lg`} />
        ) : (
          <View
            style={tw`h-14 w-14 items-center bg-white rounded-lg justify-center`}>
            <Icon icon={'account'} size={40} color="grey" />
          </View>
        )}
        <Pressable onPress={() => setIsMuted(prev => !prev)}>
          <RowContainer style={tw`mt-2`}>
            <Icon
              icon={isMuted ? 'microphone-off' : 'microphone-outline'}
              size={15}
              color="white"
            />
            <CustomText
              style={tw`text-white font-poppinsMedium  opacity-90 text-2xs text-center`}>
              {item.stageName}
            </CustomText>
          </RowContainer>
          <CustomText style={tw`text-[9px] opacity-60 text-center`}>
            {isHost ? 'host' : 'guest'}
          </CustomText>
        </Pressable>
      </View>
    </View>
  );
};

export default GuestsList;
