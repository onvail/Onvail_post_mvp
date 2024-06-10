import React, {FunctionComponent, useEffect, useState} from 'react';
import CustomText from '../Text/CustomText';
import tw from 'src/lib/tailwind';
import RowContainer from '../View/RowContainer';
import Icon from '../Icons/Icon';
import {Colors} from 'src/app/styles/colors';
import {TouchableOpacity, View} from 'react-native';
import {
  FireStoreComments,
  likeComment,
  unlikeComment,
} from 'src/actions/parties';
import useUser from 'src/app/hooks/useUserInfo';
import {MediaStream, mediaDevices} from 'react-native-webrtc';
import {Avatar} from 'react-native-paper';

const CommentCards: FunctionComponent<{
  item: FireStoreComments;
  partyId: string;
}> = ({item, partyId}) => {
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const localStream = new MediaStream();
  const {user} = useUser();

  useEffect(() => {
    if (item?.likes?.includes?.(user?._id)) {
      setIsLiked(true);
    } else {
      setIsLiked(false);
    }
  }, [item?.likes, user?._id]);

  const handleLike = async () => {
    if (item?.likes?.includes?.(user?._id)) {
      await unlikeComment(partyId, item?.commentId, user?._id);
      setIsLiked(false);
    } else {
      await likeComment(partyId, item?.commentId, user?._id);
      setIsLiked(true);
    }
  };

  const toggleMute = async () => {
    setIsMuted(!isMuted);
    const audioTrack = localStream.getAudioTracks()[0];

    // audioTrack.enabled = !audioTrack.enabled;
  };

  return (
    <View style={tw`flex-1  py-3 px-4`}>
      <RowContainer style={tw`flex-1 flex-row justify-between   `}>
        <RowContainer>
          <Avatar.Text
            label={user?.name?.substring(0, 1) ?? ''}
            size={27}
            style={tw`bg-yellow1 `}
            labelStyle={tw`font-poppinsBold text-base text-darkGreen`}
            color={Colors.white}
          />
          <View style={tw`w-[82%]`}>
            <CustomText style={tw`text-[10px] ml-5 w-full`}>
              @{item?.userStageName}
            </CustomText>
            <CustomText style={tw`text-[10px] w-full ml-5`}>
              {item?.text}
            </CustomText>
          </View>
        </RowContainer>
        <TouchableOpacity onPress={() => handleLike()} style={tw``}>
          <Icon
            icon={'heart'}
            color={isLiked ? Colors.red : 'gray'}
            size={20}
          />
        </TouchableOpacity>
      </RowContainer>
      <RowContainer style={tw`mt-1`}>
        <RowContainer>
          <TouchableOpacity onPress={() => handleLike()} style={tw` ml-12`}>
            <Icon icon={'heart'} color={Colors.grey} size={13} />
          </TouchableOpacity>
          <CustomText style={tw`ml-1 text-[10px]`}>
            {item?.likes?.length > 0 ? item?.likes?.length : null}
          </CustomText>
        </RowContainer>
        <RowContainer>
          <TouchableOpacity onPress={() => handleLike()} style={tw` ml-5`}>
            <Icon icon={'reply'} color={Colors.grey} size={13} />
          </TouchableOpacity>
          <CustomText style={tw`ml-1 text-[10px]`}>Reply</CustomText>
        </RowContainer>
        <RowContainer>
          <TouchableOpacity onPress={() => handleLike()} style={tw` ml-5`}>
            <Icon icon={'comment-outline'} color={Colors.grey} size={13} />
          </TouchableOpacity>
          <CustomText style={tw`ml-1 text-[10px]`}>10</CustomText>
        </RowContainer>
      </RowContainer>
    </View>
  );
};

export default CommentCards;
