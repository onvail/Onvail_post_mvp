import React, {FunctionComponent} from 'react';
import {TouchableOpacity, View} from 'react-native';
import UserHeader from './UserHeader';
import CustomImage from 'components/Image/CustomImage';
import tw from 'src/lib/tailwind';
import CustomText from 'components/Text/CustomText';
import {FlashList, ListRenderItem} from '@shopify/flash-list';
import {generalIcon} from 'components/Icons/generalIcons';
import RowContainer from 'components/View/RowContainer';
import MiniMusicPlayer from './MiniMusicPlayer';
import {PartiesResponse} from 'src/types/partyTypes';
import Icon from '../Icons/Icon';
import api from 'src/api/api';
import useUser from 'src/app/hooks/useUserInfo';
import {useMutation, useQueryClient} from '@tanstack/react-query';

interface JoinPartyProps {
  handleJoinPartyBtnPress: (party: PartiesResponse) => void;
  party: PartiesResponse;
}

/**
 * JoinParty Button component
 * @param handleJoinPartyBtnPress
 * @returns Functional component in the form of a button
 */
const JoinPartyButton: FunctionComponent<JoinPartyProps> = ({
  handleJoinPartyBtnPress,
  party,
}) => {
  return (
    <TouchableOpacity
      onPress={() => handleJoinPartyBtnPress(party)}
      style={tw`bg-white py-3.2 px-6 rounded-full`}>
      <CustomText style={tw`text-primary text-xs font-poppinsMedium`}>
        Join
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
  userId: string;
  handleJoinPartyBtnPress: (item: PartiesResponse) => void;
}> = ({item, handleJoinPartyBtnPress, userId}) => {
  const CommentSvg = generalIcon.Comment;
  const PartyJoinersIcon = generalIcon.PartyJoinersIcon;
  const queryClient = useQueryClient();

  const handleFollowMutation = useMutation({
    mutationFn: () => {
      if (isFollowing) {
        return api.post({
          url: 'users/unFollowUser',
          authorization: true,
          data: {
            userIdToUnfollow: item?.artist?._id,
          },
        });
      } else {
        return api.post({
          url: 'users/followUser',
          authorization: true,
          data: {
            userIdToFollow: item?.artist?._id,
          },
        });
      }
    },
    onSuccess: () => {
      queryClient.refetchQueries({queryKey: ['parties']});
    },
  });

  const handleLikeMutation = useMutation({
    mutationFn: () => {
      return api.post({
        url: `/parties/like-party/${item?._id}`,
        authorization: true,
      });
    },
    onSuccess: () => {
      queryClient.refetchQueries({queryKey: ['parties']});
    },
  });

  const canFollowUser = item?.artist?._id !== userId;
  const isFollowing = item?.artist?.followers?.includes(userId);
  const isLiked = item?.likes?.some(likes => likes?._id === userId);

  return (
    <View style={tw`mb-4 border-b-[0.2px] border-grey2 pb-7`}>
      <UserHeader
        name={item?.artist?.name}
        uri={item?.artist?.profile?.image}
        handleFollowBtnPress={() => handleFollowMutation.mutate()}
        canFollow={canFollowUser}
        isFollowing={isFollowing}
      />
      <View style={tw`self-center relative rounded-4 mt-2 bg-white w-100`}>
        <RowContainer
          style={tw`flex-row justify-between items-center absolute w-100 px-3 top-2 left-0 z-20`}>
          <View
            style={tw`bg-[#D92A2A] rounded-20 h-12 w-22 items-center justify-center`}>
            <CustomText style={tw`text-xs`}>Live</CustomText>
          </View>
          <RowContainer
            style={tw`bg-[#000000A3] rounded-20 h-12 w-22 justify-center`}>
            <PartyJoinersIcon />
            <CustomText style={tw`text-xs text-white ml-1`}>21k</CustomText>
          </RowContainer>
        </RowContainer>
        <CustomImage
          uri={item?.albumPicture ?? ''}
          style={tw`h-100 w-[100%] rounded-4`}
          resizeMode="cover"
        />
        <RowContainer
          style={tw`bg-[#00000080] rounded-b-4 flex-row justify-between items-center absolute w-100 h-19 px-3 bottom-0 left-0 z-20`}>
          <View>
            <CustomText style={tw`text-sm text-white font-medium`}>
              LIVE . 15:00-17:00
            </CustomText>
            <CustomText style={tw`text-lg text-white font-medium`}>
              Stovia’s EP Release{' '}
            </CustomText>
          </View>
          <JoinPartyButton
            party={item}
            handleJoinPartyBtnPress={() => handleJoinPartyBtnPress(item)}
          />
          {/* <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => handleJoinParty(item?._id)}
            style={tw`bg-white rounded-20 h-12 w-22 items-center justify-center`}>
            <CustomText style={tw`text-sm text-black font-semibold`}>
              Join
            </CustomText>
          </TouchableOpacity> */}
        </RowContainer>
      </View>

      <CustomText style={tw`mt-2 w-[90%] mx-auto text-xs`}>
        {item?.partyDesc}
      </CustomText>

      <RowContainer style={tw`mx-5 mt-4 justify-between`}>
        <RowContainer>
          <RowContainer style={tw`mr-5`}>
            <Icon
              icon={isLiked ? 'heart' : 'heart-outline'}
              color={isLiked ? 'red' : 'white'}
              onPress={() => handleLikeMutation.mutate()}
              size={20}
            />
            <CustomText style={tw`ml-2 text-grey2`}>
              {item?.likes?.length ?? 0}
            </CustomText>
          </RowContainer>
          <RowContainer>
            <CommentSvg />
            <CustomText style={tw`ml-2 text-grey2`}>
              {item?.comments?.length ?? 0}
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
        {/* <JoinPartyButton
          party={item}
          handleJoinPartyBtnPress={() => handleJoinPartyBtnPress(item)}
        /> */}
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
  handleJoinPartyBtnPress: (item: PartiesResponse) => void;
  data: PartiesResponse[];
}
const PostCard: FunctionComponent<PostCardProps> = ({
  handleJoinPartyBtnPress,
  data,
}) => {
  const {user} = useUser();

  const renderItem: ListRenderItem<PartiesResponse> = ({item}) => (
    <PostItem
      item={item}
      handleJoinPartyBtnPress={handleJoinPartyBtnPress}
      userId={user?._id ?? ''}
    />
  );

  // NOTE:
  // The custom navbar gets a background color placed behind the Onvail button when a margin-bottom is used to push the last-item to a visible position.
  // Adding a Footer component adds an extra item that makes the last component appear within users view, which in-turn helps for interaction.
  const renderFooterComponent = () => <View style={tw`h-12`} />;

  return (
    <FlashList
      data={data}
      renderItem={renderItem}
      estimatedItemSize={15}
      showsHorizontalScrollIndicator={false}
      ListFooterComponent={renderFooterComponent}
    />
  );
};

export default PostCard;
