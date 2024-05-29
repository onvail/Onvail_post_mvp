import React, {FunctionComponent, useState} from 'react';
import CustomText from '../Text/CustomText';
import tw from 'src/lib/tailwind';
import RowContainer from '../View/RowContainer';
import Icon from '../Icons/Icon';
import {Colors} from 'src/app/styles/colors';
import {Pressable, TouchableOpacity, View} from 'react-native';
import {Comment} from 'src/types/partyTypes';
import CustomImage from '../Image/CustomImage';

const CommentCards: FunctionComponent<{item: Comment}> = ({item}) => {
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isLiked, setIsLiked] = useState<boolean>(false);
  return (
    <View style={tw`flex-1 border-grey4 border-b-[0.2px] py-3 px-4`}>
      <RowContainer style={tw`flex-1 flex-row justify-between   `}>
        <RowContainer>
          {item?.user?.image ? (
            <CustomImage
              uri={item?.user?.image}
              style={tw`h-5 w-5 rounded-full`}
            />
          ) : (
            <Icon icon={'account'} color="white" size={20} />
          )}
          <CustomText style={tw`text-[10px] ml-5 w-[75%]`}>
            {item?.text}
          </CustomText>
        </RowContainer>
        <Pressable onPress={() => setIsMuted(!isMuted)}>
          <Icon
            icon={isMuted ? 'microphone' : 'microphone-off'}
            color={Colors.white}
            size={25}
          />
        </Pressable>
      </RowContainer>
      <RowContainer style={tw`mt-4`}>
        <TouchableOpacity
          onPress={() => setIsLiked(!isLiked)}
          style={tw` ml-12`}>
          <Icon
            icon={isLiked ? 'heart' : 'heart-outline'}
            color={Colors.red}
            size={20}
          />
        </TouchableOpacity>
        <CustomText style={tw`ml-2 text-xs`}>{item?.likes?.length}</CustomText>
      </RowContainer>
    </View>
  );
};

export default CommentCards;
