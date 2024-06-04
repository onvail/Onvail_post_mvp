import React, {FunctionComponent} from 'react';
import {View} from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import tw from 'src/lib/tailwind';

const HomeSkeletonPlaceHolder: FunctionComponent = () => {
  return (
    <SkeletonPlaceholder borderRadius={4}>
      <SkeletonPlaceholder.Item marginVertical={15} paddingHorizontal={20}>
        <SkeletonPlaceholder.Item
          flexDirection="row"
          alignItems="center"
          marginBottom={8}
          justifyContent="space-between">
          <SkeletonPlaceholder.Item width={40} height={40} borderRadius={50} />
          <SkeletonPlaceholder.Item width={140} height={10} />
          <SkeletonPlaceholder.Item width={40} height={10} />
        </SkeletonPlaceholder.Item>
        <View style={tw`h-40 w-auto`} />
      </SkeletonPlaceholder.Item>
    </SkeletonPlaceholder>
  );
};

export default HomeSkeletonPlaceHolder;
