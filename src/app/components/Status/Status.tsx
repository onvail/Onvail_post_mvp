import {FlashList, ListRenderItem} from '@shopify/flash-list';
import React, {FunctionComponent, memo, useMemo} from 'react';
import {Image, View, ImageSourcePropType, Text} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import tw from 'src/lib/tailwind';
import {sampleStatus} from 'src/utils/data';

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
          style={tw`h-20 w-20 border-white rounded-full mr-2 items-center justify-center`}>
          <Image
            resizeMode={'cover'}
            source={imageSource}
            style={tw`h-18.5 w-18.5 m-4 rounded-full p-2 border-2`}
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
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
};

export default Status;
