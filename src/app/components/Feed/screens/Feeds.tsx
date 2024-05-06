import React, {FunctionComponent} from 'react';
import {View} from 'react-native';
import UserHeader from '../../Posts/UserHeader';
import {FlashList, ListRenderItem} from '@shopify/flash-list';
import {FeedResponse} from 'src/types/partyTypes';
import tw from 'src/lib/tailwind';
import useUser from 'src/app/hooks/useUserInfo';
import {classifyUrl, truncateText} from 'src/utils/utilities';
import CustomImage from 'app/components/Image/CustomImage';
import MiniMusicPlayer from '../../Posts/MiniMusicPlayer';
import uuid from 'react-native-uuid';
import CustomText from '../../Text/CustomText';
import RowContainer from '../../View/RowContainer';
import {generalIcon} from '../../Icons/generalIcons';
import Icon from '../../Icons/Icon';

interface FeedItemProps {
  item: FeedResponse;
  userId: string;
}

const FeedItem: FunctionComponent<FeedItemProps> = ({item, userId}) => {
  const {user} = item;
  const canFollowUser = item?.user?.profile?._id !== userId;
  const isLiked = item?.likes?.some(likes => likes?._id === userId);

  const CommentSvg = generalIcon.Comment;

  return (
    <View style={tw`mb-4 flex-1`}>
      <UserHeader
        name={user?.name}
        uri={user?.profile?.image}
        handleFollowBtnPress={() => {}}
        canFollow={canFollowUser}
        isFollowing={false}
      />
      <CustomText style={tw`mt-2 text-xs mx-3`}>
        {truncateText(item?.text, 120)}
      </CustomText>
      <View style={tw` mt-3`}>
        {item?.mediaFiles?.map((mediaFile, _) => {
          const urlType = classifyUrl(mediaFile);
          if (urlType.type === 'Image') {
            return (
              <CustomImage
                uri={urlType.url}
                key={mediaFile}
                resizeMode="stretch"
                style={tw`h-100 w-100`}
              />
            );
          } else if (urlType.type === 'Music') {
            return (
              <RowContainer
                style={tw`mb-1 mx-3 justify-between`}
                key={mediaFile}>
                <RowContainer>
                  <RowContainer style={tw`mr-5`}>
                    <Icon
                      icon={isLiked ? 'heart' : 'heart-outline'}
                      color={isLiked ? 'red' : 'white'}
                      onPress={() => {}}
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
                <MiniMusicPlayer
                  uri={urlType.url}
                  artiste={user?.name}
                  musicTitle={'Dandizzy'}
                  id={uuid.v4().toString()}
                />
              </RowContainer>
            );
          } else {
            return null;
          }
        })}
      </View>
    </View>
  );
};

interface FeedsProps {
  data: FeedResponse[];
}

const Feeds: FunctionComponent<FeedsProps> = ({data}) => {
  const {user} = useUser();
  const renderItem: ListRenderItem<FeedResponse> = ({item}) => (
    <FeedItem item={item} userId={user?._id ?? ''} />
  );

  const renderFooterComponent = () => <View style={tw`h-12`} />;
  const reversedItems = [...data].reverse();

  return (
    <FlashList
      data={reversedItems}
      renderItem={renderItem}
      estimatedItemSize={15}
      showsHorizontalScrollIndicator={false}
      ListFooterComponent={renderFooterComponent}
    />
  );
};

export default Feeds;
