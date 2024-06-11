import React, {
  FunctionComponent,
  useEffect,
  useState,
  useCallback,
} from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {Avatar} from 'react-native-paper';
import Icon from '../Icons/Icon';
import CustomText from '../Text/CustomText';
import RowContainer from '../View/RowContainer';
import {Colors} from 'src/app/styles/colors';
import {
  Comments,
  FireStoreComments,
  createFireStoreComments,
  likeComment,
  unlikeComment,
} from 'src/actions/parties';
import useUser from 'src/app/hooks/useUserInfo';
import {collection, onSnapshot, doc, getDocs} from 'firebase/firestore';
import {db} from '../../../../firebaseConfig';
import {FlashList, ListRenderItem} from '@shopify/flash-list';
import tw from 'src/lib/tailwind';
import {generalIcon} from '../Icons/generalIcons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';

const CommentCards: FunctionComponent<{
  item: FireStoreComments;
  partyId: string;
}> = ({item, partyId}) => {
  const SendIcon = generalIcon.SendIcon;
  const [commentData, setCommentData] = useState<FireStoreComments>(item);
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [commentReply, setCommentReply] = useState<string>('');
  const [isReplyFieldOpen, setIsReplyFieldOpen] = useState<boolean>(false);
  const [isUploadingComment, setIsUploadingComment] = useState<boolean>(false);
  const {user} = useUser();

  useEffect(() => {
    if (commentData?.likes?.includes?.(user?._id)) {
      setIsLiked(true);
    } else {
      setIsLiked(false);
    }
  }, [commentData?.likes, user?._id]);

  useEffect(() => {
    const commentDocRef = doc(db, `party/${partyId}/comments`, item.commentId);
    const unsubscribe = onSnapshot(commentDocRef, async docSnapshot => {
      const updatedCommentData = docSnapshot.data() as FireStoreComments;
      const repliesCollection = collection(
        db,
        `party/${partyId}/comments/${docSnapshot.id}/replies`,
      );
      const repliesSnapshot = await getDocs(repliesCollection);
      const replies = repliesSnapshot.docs.map(replyDoc => ({
        ...replyDoc.data(),
        commentId: replyDoc.id,
      }));
      const responses = replies as Comments[];
      setCommentData({
        ...updatedCommentData,
        replies: responses,
        commentId: docSnapshot.id,
      });
    });

    return () => unsubscribe();
  }, [partyId, item.commentId, isUploadingComment]);

  const handleLike = async () => {
    if (commentData?.likes?.includes?.(user?._id)) {
      await unlikeComment(partyId, commentData?.commentId, user?._id);
      setIsLiked(false);
    } else {
      await likeComment(partyId, commentData?.commentId, user?._id);
      setIsLiked(true);
    }
  };

  const replyComment = useCallback(async () => {
    setIsUploadingComment(true);
    try {
      await createFireStoreComments(
        partyId,
        user?._id,
        commentReply,
        user?.image,
        user?.stageName,
        user?.name,
        commentData?.commentId,
      );
      setCommentReply('');
    } catch (error) {
      console.log(error);
    }
    setIsUploadingComment(false);
  }, [
    partyId,
    user?._id,
    user?.image,
    user?.stageName,
    user?.name,
    commentReply,
    commentData?.commentId,
  ]);

  const commentsRenderItem: ListRenderItem<Comments> = useCallback(({item}) => {
    return (
      <RowContainer style={tw`flex-1 min-h-9 max-h-14 w-[80%]`}>
        <Avatar.Text
          label={item?.name?.substring(0, 1) ?? ''}
          size={20}
          style={tw`bg-yellow1 `}
          labelStyle={tw`font-poppinsBold text-xs text-darkGreen`}
          color={Colors.white}
        />
        <View style={tw`w-[80%]`}>
          <CustomText style={tw`text-[8px] ml-3`}>{item.text}</CustomText>
        </View>
      </RowContainer>
    );
  }, []);

  const height = useSharedValue(20);

  const calculateDynamicHeight = useCallback(
    (numReplies: number) => {
      const repliesCount = numReplies > 0 ? numReplies : 0.1;
      const itemHeight = 30; // Assuming each item has a height of 50
      const maxHeight = 120; // Maximum height for the FlashList
      const calculatedHeight = repliesCount * itemHeight;
      height.value = withSpring(Math.min(calculatedHeight, maxHeight));
      return Math.min(calculatedHeight, maxHeight);
    },
    [height],
  );

  const animatedStyle = useAnimatedStyle(() => {
    return {
      height: height.value,
    };
  });

  const toggleReplyFieldVisibility = () => {
    if (isReplyFieldOpen) {
      height.value = withSpring(20);
      setTimeout(() => setIsReplyFieldOpen(false), 200);
    } else {
      setIsReplyFieldOpen(true);
      calculateDynamicHeight(commentData?.replies?.length ?? 0);
    }
  };

  return (
    <View style={tw`flex-1 py-3 px-4`}>
      <RowContainer style={tw`flex-1 flex-row justify-between`}>
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
              @{commentData?.userStageName}
            </CustomText>
            <CustomText style={tw`text-[10px] w-full ml-5`}>
              {commentData?.text}
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
      <View style={tw`ml-12 flex-1 min-h-6`}>
        <RowContainer style={tw`flex-1 mt-1`}>
          <RowContainer>
            <TouchableOpacity onPress={() => handleLike()}>
              <Icon icon={'heart'} color={Colors.grey} size={13} />
            </TouchableOpacity>
            <CustomText style={tw`ml-1 text-[10px]`}>
              {commentData?.likes?.length > 0
                ? commentData?.likes?.length
                : null}
            </CustomText>
          </RowContainer>
          <TouchableOpacity
            onPress={toggleReplyFieldVisibility}
            style={tw` ml-5`}>
            <RowContainer>
              <Icon icon={'reply'} color={Colors.grey} size={13} />
              <CustomText style={tw`ml-1 text-[10px]`}>Reply</CustomText>
            </RowContainer>
          </TouchableOpacity>
          <RowContainer>
            <TouchableOpacity
              onPress={toggleReplyFieldVisibility}
              style={tw` ml-5`}>
              <Icon icon={'comment-outline'} color={Colors.grey} size={13} />
            </TouchableOpacity>
            <CustomText style={tw`ml-1 text-[10px]`}>
              {commentData?.replies?.length}
            </CustomText>
          </RowContainer>
        </RowContainer>
        {isReplyFieldOpen && (
          <>
            <Animated.View style={[tw`w-full`, animatedStyle]}>
              <FlashList
                data={commentData?.replies ?? []}
                renderItem={commentsRenderItem}
                estimatedItemSize={50}
                keyExtractor={reply => reply.commentId}
              />
            </Animated.View>
            <RowContainer
              style={tw`border border-grey justify-between mt-4 px-2 h-8 rounded-lg `}>
              <TextInput
                value={commentReply}
                onChangeText={text => setCommentReply(text)}
                style={tw`h-8 text-2xs w-[85%] rounded-lg text-white`}
                placeholderTextColor={'white'}
                placeholder="your response"
              />
              <View>
                {isUploadingComment ? (
                  <ActivityIndicator />
                ) : (
                  <TouchableOpacity onPress={replyComment}>
                    <SendIcon height={15} width={15} />
                  </TouchableOpacity>
                )}
              </View>
            </RowContainer>
          </>
        )}
      </View>
    </View>
  );
};

export default CommentCards;
