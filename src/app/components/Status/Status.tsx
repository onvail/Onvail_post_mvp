import {FlashList, ListRenderItem} from '@shopify/flash-list';
import React, {FunctionComponent, memo} from 'react';
import {View, ImageSourcePropType, Text, TouchableOpacity} from 'react-native';
import tw from 'src/lib/tailwind';
import {sampleStatus} from 'src/utils/data';
import CustomImage from 'components/Image/CustomImage';

type StatusItem = {
  name: string;
  imageUrl: string;
};

const StatusItemComponent: FunctionComponent<{item: StatusItem}> = memo(
  ({item}) => {
    const imageSource: ImageSourcePropType = {uri: item.imageUrl};

    return (
      <View style={tw`items-center`}>
        <View style={tw`mr-3 rounded-[17px] border-4 border-grey5`}>
          <CustomImage
            resizeMode="cover"
            uri={imageSource.uri!}
            style={tw`rounded-[15px] h-19 w-19  border-2 `}
          />
        </View>
        <Text style={tw`text-white mt-2 font-poppinsMedium text-xs`}>
          {item.name}
        </Text>
      </View>
    );
  },
);

const Status: FunctionComponent = () => {
  const renderItem: ListRenderItem<StatusItem> = ({item}) => (
    <StatusItemComponent item={item} />
  );

  return (
    <View style={tw`flex-row`}>
      {/* <TouchableOpacity
        activeOpacity={0.9}
        onPress={handleAddStory}
        style={tw`items-center`}>
        <View
          style={tw`mr-3 items-center justify-center rounded-[17px] h-20 w-20 border-4 border-grey5`}>
          <View
            style={tw`items-center justify-center rounded-[17px] bg-[#7C1AFC] h-19 w-19 border-2`}>
            <AddIcon />
          </View>
        </View>
        <Text style={tw`text-white mt-2 font-poppinsMedium text-xs`}>
          Your Story
        </Text>
      </TouchableOpacity> */}
      <FlashList
        data={sampleStatus}
        renderItem={renderItem}
        estimatedItemSize={10}
        horizontal
        keyExtractor={item => item.name}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
};

export default Status;
