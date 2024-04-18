import React, {FunctionComponent} from 'react';
import {TouchableOpacity} from 'react-native';
import CustomImage from 'components/Image/CustomImage';
import tw from 'src/lib/tailwind';
import CustomText from 'components/Text/CustomText';
import RowContainer from '../View/RowContainer';

interface User {
  name?: string;
  uri?: string;
  handleFollowBtnPress: () => void;
}

const UserHeader: FunctionComponent<User> = ({
  name,
  uri,
  handleFollowBtnPress,
}) => {
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
      <TouchableOpacity
        onPress={() => handleFollowBtnPress()}
        style={tw`border rounded-full border-white px-5 py-1`}>
        <CustomText style={tw`text-[13px]`}>Follow</CustomText>
      </TouchableOpacity>
    </RowContainer>
  );
};

export default UserHeader;
