import React, {FunctionComponent} from 'react';
import {TouchableOpacity} from 'react-native';
import CustomImage from 'components/Image/CustomImage';
import tw from 'src/lib/tailwind';
import CustomText from 'components/Text/CustomText';
import RowContainer from '../View/RowContainer';
import useUser from 'src/app/hooks/useUserInfo';

interface User {
  name?: string;
  uri?: string;
  handleFollowBtnPress: () => void;
  isFollowing: boolean;
  canFollow: boolean;
}

const UserHeader: FunctionComponent<User> = ({
  name,
  uri,
  handleFollowBtnPress,
  isFollowing,
  canFollow,
}) => {
  const {user} = useUser();
  return (
    <RowContainer style={tw`px-4 justify-between`}>
      <RowContainer>
        {uri && (
          <CustomImage
            uri={uri}
            style={tw`h-9 w-9 rounded-full`}
            resizeMode="cover"
          />
        )}
        {name && <CustomText style={tw`ml-3 text-[13px]`}>{name}</CustomText>}
      </RowContainer>
      {canFollow && (
        <TouchableOpacity
          onPress={() => handleFollowBtnPress()}
          style={tw`border bg-${
            isFollowing ? 'white' : 'transparent'
          } rounded-full border-white px-5 py-1`}>
          {
            <CustomText
              style={tw`text-${isFollowing ? 'black' : 'white'} text-[13px]`}>
              {isFollowing ? 'Unfollow' : 'Follow'}
            </CustomText>
          }
        </TouchableOpacity>
      )}
    </RowContainer>
  );
};

export default UserHeader;
