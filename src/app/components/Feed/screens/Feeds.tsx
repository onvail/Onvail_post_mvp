import React, {FunctionComponent} from 'react';
import {View} from 'react-native';
import UserHeader from '../../Posts/UserHeader';
import {FlashList, ListRenderItem} from '@shopify/flash-list';
import {FeedResponse} from 'src/types/partyTypes';
import tw from 'src/lib/tailwind';
import useUser from 'src/app/hooks/useUserInfo';
import {classifyUrl} from 'src/utils/utilities';
import CustomImage from 'app/components/Image/CustomImage';
import MiniMusicPlayer from '../../Posts/MiniMusicPlayer';
import uuid from 'react-native-uuid';
import CustomText from '../../Text/CustomText';

interface FeedItemProps {
  item: FeedResponse;
  userId: string;
}

const FeedItem: FunctionComponent<FeedItemProps> = ({item, userId}) => {
  const {user} = item;
  const canFollowUser = item?.user?.profile?._id !== userId;
  console.log(item);

  return (
    <View style={tw`mb-4 flex-1`}>
      <UserHeader
        name={user?.name}
        uri={user?.profile?.image}
        handleFollowBtnPress={() => {}}
        canFollow={canFollowUser}
        isFollowing={false}
      />
      <CustomText style={tw`mt-2 text-xs mx-3`}>{item?.text}</CustomText>
      <View style={tw`mt-2 h-100`}>
        {item?.mediaFiles?.map((mediaFile, _) => {
          const urlType = classifyUrl(mediaFile);
          if (urlType.type === 'Image') {
            return (
              <CustomImage
                uri={urlType.url}
                key={mediaFile}
                style={tw`h-100 w-100`}
              />
            );
          } else if (urlType.type === 'Music') {
            return (
              <View style={tw`mb-1 mx-3`} key={mediaFile}>
                <MiniMusicPlayer
                  uri={urlType.url}
                  artiste={user?.name}
                  musicTitle={'Dandizzy'}
                  id={uuid.v4().toString()}
                />
              </View>
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

export default Feeds;
