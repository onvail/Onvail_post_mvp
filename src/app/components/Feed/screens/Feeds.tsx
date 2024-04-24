import React, {FunctionComponent} from 'react';
import {View} from 'react-native';
import UserHeader from '../../Posts/UserHeader';
import {FlashList, ListRenderItem} from '@shopify/flash-list';
import {FeedResponse} from 'src/types/partyTypes';
import tw from 'src/lib/tailwind';
import useUser from 'src/app/hooks/useUserInfo';
import {fileType} from 'src/utils/utilities';
import CustomText from '../../Text/CustomText';

interface FeedItemProps {
  item: FeedResponse;
  userId: string;
}

const FeedItem: FunctionComponent<FeedItemProps> = ({item, userId}) => {
  console.log(item);
  const canFollowUser = item?.user !== userId;
  return (
    <View>
      <UserHeader
        name={'Test user'}
        uri={undefined}
        handleFollowBtnPress={() => {}}
        canFollow={canFollowUser}
        isFollowing={false}
      />
      {item?.mediaFiles?.map((mediaFile, _) => {
        console.log(fileType(mediaFile));
        return <CustomText key={mediaFile}>{mediaFile}</CustomText>;
      })}
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
