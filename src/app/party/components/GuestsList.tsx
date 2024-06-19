import React, {FunctionComponent, useState} from 'react';
import {Pressable, View} from 'react-native';
import {User} from 'src/app/hooks/useUserInfo';
import CustomImage from 'src/app/components/Image/CustomImage';
import Icon from 'src/app/components/Icons/Icon';
import tw from 'src/lib/tailwind';
import CustomText from 'src/app/components/Text/CustomText';
import RowContainer from 'src/app/components/View/RowContainer';
import {mediaDevices} from 'react-native-webrtc';
import {truncateText} from 'src/utils/utilities';

const GuestsList: FunctionComponent<{
  item: User;
  isHost: boolean;
}> = ({item, isHost}) => {
  const [isMuted, setIsMuted] = useState<boolean>(true);

  const handleMute = async () => {
    try {
      const mediaConstraints = {audio: true, video: false};
      const localStream = await mediaDevices.getUserMedia(mediaConstraints);
      const audioTrack = await localStream.getAudioTracks()[0];
      audioTrack.enabled = !audioTrack.enabled;
      setIsMuted(prev => !prev);
    } catch (err) {
      // Handle Error
    }
  };

  return (
    <View style={tw`flex-1 h-full  items-center justify-center m-1`}>
      <View style={tw`items-center flex-1 justify-center w-20 mr-4`}>
        {item?.image?.length > 0 ? (
          <CustomImage uri={item?.image} style={tw`h-14 w-14 rounded-lg`} />
        ) : (
          <View
            style={tw`h-14 w-14 items-center bg-white rounded-lg justify-center`}>
            <Icon icon={'account'} size={40} color="grey" />
          </View>
        )}
        <Pressable onPress={() => handleMute()}>
          <RowContainer style={tw`mt-2`}>
            <Icon
              icon={isMuted ? 'microphone-off' : 'microphone-outline'}
              size={15}
              color="white"
            />
            <CustomText
              style={tw`text-white font-poppinsMedium  opacity-90 text-2xs text-center`}>
              {truncateText(item?.stageName, 5)}
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
