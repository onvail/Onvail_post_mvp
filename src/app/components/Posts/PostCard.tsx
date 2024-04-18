import React, {FunctionComponent} from 'react';
import {TouchableOpacity, View} from 'react-native';
import {Post, posts} from 'src/utils/posts';
import UserHeader from './UserHeader';
import CustomImage from 'components/Image/CustomImage';
import tw from 'src/lib/tailwind';
import CustomText from 'components/Text/CustomText';
import {FlashList, ListRenderItem} from '@shopify/flash-list';
import {generalIcon} from 'components/Icons/generalIcons';
import RowContainer from 'components/View/RowContainer';
import MiniMusicPlayer from './MiniMusicPlayer';
import {PartiesResponse} from 'src/types/partyTypes';

interface JoinPartyProps {
  handleJoinPartyBtnPress: () => void;
}

/**
 * JoinParty Button component
 * @param handleJoinPartyBtnPress
 * @returns Functional component in the form of a button
 */
const JoinPartyButton: FunctionComponent<JoinPartyProps> = ({
  handleJoinPartyBtnPress,
}) => {
  return (
    <TouchableOpacity
      onPress={handleJoinPartyBtnPress}
      style={tw`bg-white py-1.7 px-3 rounded-full`}>
      <CustomText style={tw`text-primary text-xs font-poppinsMedium`}>
        Join the party
      </CustomText>
    </TouchableOpacity>
  );
};

/**
 * Post Item component
 * @returns Functional component rendered as individual posts
 */

const PostItem: FunctionComponent<{
  item: PartiesResponse;
  handleJoinPartyBtnPress: () => void;
}> = ({item, handleJoinPartyBtnPress}) => {
  const HeartSvg = generalIcon.Heart;
  const CommentSvg = generalIcon.Comment;

  return (
    <View style={tw`mb-4 border-b-[0.2px] border-grey2 pb-7`}>
      <UserHeader
        name={item?.artist?.name}
        uri={item?.artist?.profile?.image}
        handleFollowBtnPress={() => {}}
      />
      <CustomImage
        uri={item?.albumPicture ?? ''}
        style={tw`h-100 w-100 mt-4`}
        resizeMode="cover"
      />
      <CustomText style={tw`mt-2 mx-2 text-xs`}>{item?.partyDesc}</CustomText>

      <RowContainer style={tw`mx-5 mt-4 justify-between`}>
        <RowContainer>
          <RowContainer style={tw`mr-5`}>
            <HeartSvg />
            <CustomText style={tw`ml-2 text-grey2`}>
              {item?.likes?.length ?? 0}
            </CustomText>
          </RowContainer>
          <RowContainer>
            <CommentSvg />
            <CustomText style={tw`ml-2 text-grey2`}>
              {item?.likes?.length ?? 0}
            </CustomText>
          </RowContainer>
        </RowContainer>
        {/* {item.postType === 'Music' ? (
          <MiniMusicPlayer
            uri={item?.musicUrl ?? ''}
            artiste={item?.artist ?? ''}
            musicTitle={item?.musicTitle ?? ''}
          />
        ) : (
          <JoinPartyButton handleJoinPartyBtnPress={handleJoinPartyBtnPress} />
        )} */}
      </RowContainer>
    </View>
  );
};

/**
 * Post Card
 * @param handleJoinPartyBtnPress
 * @returns FlashList component that renders posts vertically.
 */

interface PostCardProps {
  handleJoinPartyBtnPress: () => void;
  data: PartiesResponse[];
}
const PostCard: FunctionComponent<PostCardProps> = ({
  handleJoinPartyBtnPress,
  data,
}) => {
  const renderItem: ListRenderItem<PartiesResponse> = ({item}) => (
    <PostItem item={item} handleJoinPartyBtnPress={handleJoinPartyBtnPress} />
  );

  return (
    <FlashList
      data={data}
      renderItem={renderItem}
      estimatedItemSize={15}
      showsHorizontalScrollIndicator={false}
    />
  );
};

export default PostCard;
