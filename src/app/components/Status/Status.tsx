import {FlashList, ListRenderItem} from '@shopify/flash-list';
import React, {FunctionComponent, memo, useMemo} from 'react';
import {View, ImageSourcePropType, Text} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import tw from 'src/lib/tailwind';
import {sampleStatus} from 'src/utils/data';
import CustomImage from 'components/Image/CustomImage';

type StatusItem = {
  name: string;
  imageUrl: string;
};

const gradients = [
  ['#7215FD', '#FFFFFF'],
  ['#FFFFFF', '#6600FF'],
  ['#4D1D96', '#D71AE7'],
  ['#4D1D96', '#1A76E7'],
];

const StatusItemComponent: FunctionComponent<{item: StatusItem}> = memo(
  ({item}) => {
    const imageSource: ImageSourcePropType = {uri: item.imageUrl};
    const randomGradientIndex = useMemo(
      () => Math.floor(Math.random() * gradients.length),
      [],
    );
    return (
      <View style={tw`items-center`}>
        <LinearGradient
          colors={gradients[randomGradientIndex]}
          style={tw`h-23 w-20 border-white rounded-md mr-4 items-center justify-center`}>
          <CustomImage
            resizeMode="cover"
            uri={imageSource.uri!}
            style={tw`rounded-md h-21.5 w-18.5 p-2 border-2`}
          />
        </LinearGradient>
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
    <View>
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
