import React, {FunctionComponent, memo} from 'react';
import {TouchableOpacity, View} from 'react-native';
import {Post, posts} from 'src/utils/posts';
import UserHeader from './UserHeader';
import CustomImage from 'components/Image/CustomImage';
import tw from 'src/lib/tailwind';
import CustomText from 'components/Text/CustomText';
import {FlashList, ListRenderItem} from '@shopify/flash-list';
import {generalIcon} from 'components/Icons/generalIcons';
import RowContainer from 'components/View/RowContainer';

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
      <CustomText style={tw`text-primary font-poppinsMedium`}>
        Join the party
      </CustomText>
    </TouchableOpacity>
  );
};

/**
 * Post Item component
 * @returns Functional component rendered as individual posts
 */

const PostItem: FunctionComponent<{item: Post}> = memo(({item}) => {
  const HeartSvg = generalIcon.Heart;
  const CommentSvg = generalIcon.Comment;
  return (
    <View key={item.key} style={tw`mb-4 border-b-[0.2px] border-grey2 pb-7`}>
      <UserHeader
        name={item.userName}
        uri={item.profileImage}
        handleFollowBtnPress={() => {}}
      />
      <CustomImage
        uri={item.postImage}
        style={tw`h-100 w-100 mt-4`}
        resizeMode="cover"
      />
      <CustomText style={tw`mt-2 mx-2`}>{item.postText}</CustomText>
      <RowContainer style={tw`mx-5 mt-4 justify-between`}>
        <RowContainer>
          <RowContainer style={tw`mr-5`}>
            <HeartSvg />
            <CustomText style={tw`ml-2 text-grey2`}>
              {item.likeCount ?? 0}
            </CustomText>
          </RowContainer>
          <RowContainer>
            <CommentSvg />
            <CustomText style={tw`ml-2 text-grey2`}>
              {item.likeCount ?? 0}
            </CustomText>
          </RowContainer>
        </RowContainer>
        <JoinPartyButton handleJoinPartyBtnPress={() => {}} />
      </RowContainer>
    </View>
  );
});

/**
 * Post Card
 * @param handleJoinPartyBtnPress
 * @returns FlashList component that renders posts vertically.
 */
const PostCard: FunctionComponent = () => {
  const renderItem: ListRenderItem<Post> = ({item}) => <PostItem item={item} />;
  return (
    <FlashList
      data={posts}
      renderItem={renderItem}
      estimatedItemSize={10}
      showsHorizontalScrollIndicator={false}
    />
  );
};

export default PostCard;
