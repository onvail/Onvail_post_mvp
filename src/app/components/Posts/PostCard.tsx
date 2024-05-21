import React, {FunctionComponent, useEffect, useMemo, useState} from 'react';
import {ActivityIndicator, TouchableOpacity, View} from 'react-native';
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
import {getColors} from 'react-native-image-colors';
import {ColorScheme} from 'src/app/navigator/types/MainStackParamList';
import socket from 'src/utils/socket';
interface JoinPartyProps {
  handleJoinPartyBtnPress: (
    party: PartiesResponse,
    albumBackgroundColor: ColorScheme,
  ) => void;
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
  const {user} = useUser();
  const isHost = party?.artist?._id === user?._id;
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [albumBackgroundColor, setAlbumBackgroundColor] = useState<ColorScheme>(
    {} as ColorScheme,
  );

  const fetchAlbumBackgroundColor = useMemo(async () => {
    try {
      const colors = await getColors(party.albumPicture, {
        fallback: '#228B22',
        cache: true,
        key: party.albumPicture,
      });
      return colors;
    } catch (error) {
      console.log(error);
    }
  }, [party?.albumPicture]);

  useEffect(() => {
    const fetchBackgroundColor = async () => {
      const colors = await fetchAlbumBackgroundColor;
      const itemBackgroundColor = colors as ColorScheme;
      setAlbumBackgroundColor(itemBackgroundColor);
    };

    fetchBackgroundColor();
  }, [fetchAlbumBackgroundColor]);

  const partyActionText = () => {
    if (isHost) {
      return 'Start Party';
    } else {
      return 'Join the party';
    }
  };

  const startParty = async () => {
    setIsLoading(true);
    try {
      await api.patch({
        url: `parties/start-party/${party?._id}`,
        requiresToken: true,
        authorization: true,
      });
      handleJoinPartyBtnPress(party, albumBackgroundColor);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const joinParty = async () => {
    setIsLoading(true);
    try {
      socket.emit('join_party', {
        party: party._id,
        user,
      });
      await api.post({
        url: `parties/join-party/${party?._id}`,
        requiresToken: true,
        authorization: true,
      });
      handleJoinPartyBtnPress(party, albumBackgroundColor);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={tw`bg-white w-28 py-1.7 px-3 rounded-full`}>
      {isLoading ? (
        <ActivityIndicator color={'black'} />
      ) : (
        <TouchableOpacity
          style={tw`items-center justify-center`}
          onPress={() => (isHost ? startParty() : joinParty())}>
          <CustomText style={tw`text-primary text-xs font-poppinsMedium`}>
            {partyActionText()}
          </CustomText>
        </TouchableOpacity>
      )}
    </View>
  );
};

/**
 * Post Item component
 * @returns Functional component rendered as individual posts
 */

const PostItem: FunctionComponent<{
  item: PartiesResponse;
  userId: string;
  handleJoinPartyBtnPress: (
    item: PartiesResponse,
    albumBackgroundColor: ColorScheme,
  ) => void;
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
        uri={item?.artist?.image}
        handleFollowBtnPress={() => handleFollowMutation.mutate()}
        canFollow={canFollowUser}
        isFollowing={isFollowing}
      />
      <View style={tw`self-center relative rounded-lg mx-8 mt-2 w-[95%]`}>
        <RowContainer
          style={tw`flex-row justify-between items-center w-full absolute  px-3 top-2 left-0 z-20`}>
          <View
            style={tw`bg-[#D92A2A] rounded-20 h-12 w-22 items-center justify-center`}>
            <CustomText style={tw`text-xs`}>Live</CustomText>
          </View>
          <RowContainer
            style={tw`bg-primary opacity-70 rounded-20 h-12 w-22 justify-center`}>
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
          style={tw`bg-[#00000080] rounded-b-4 flex-row justify-between items-center absolute w-full h-19 px-3 bottom-0 left-0 z-20`}>
          <View>
            <CustomText style={tw`text-sm text-white font-medium`}>
              LIVE . 15:00-17:00
            </CustomText>
            <CustomText style={tw`text-lg text-white font-medium`}>
              {item?.partyDesc}
            </CustomText>
          </View>
          <JoinPartyButton
            party={item}
            handleJoinPartyBtnPress={(party, albumBackgroundColor) =>
              handleJoinPartyBtnPress(party, albumBackgroundColor)
            }
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
        <JoinPartyButton
          party={item}
          handleJoinPartyBtnPress={(item, albumBackgroundColor) =>
            handleJoinPartyBtnPress(item, albumBackgroundColor)
          }
        />
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
  handleJoinPartyBtnPress: (
    item: PartiesResponse,
    albumBackgroundColor: ColorScheme,
  ) => void;
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
      handleJoinPartyBtnPress={(partyItem, albumBackgroundColor) =>
        handleJoinPartyBtnPress(partyItem, albumBackgroundColor)
      }
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
