import React, {FunctionComponent} from 'react';
import {View} from 'react-native';
import ScreenContainer from 'components/Screens/ScreenContainer';
import tw from 'src/lib/tailwind';
import NotificationCard, {
  NotificationProps,
} from '../components/NotificationCard';
import {FlashList, ListRenderItem} from '@shopify/flash-list';
import {notification} from 'src/utils/notifications';

const renderItem: ListRenderItem<NotificationProps> = ({item}) => (
  <NotificationCard
    imageUri={item.imageUri}
    subject={item.subject}
    timeStamp={item.timeStamp}
    message={item.message}
  />
);

const Notification: FunctionComponent = () => {
  return (
    <ScreenContainer goBack screenHeader="Notifications">
      <View style={tw`border-t-[0.3px] border-grey2 pt-3 flex-1 mt-10`}>
        <FlashList
          data={notification}
          renderItem={renderItem}
          estimatedItemSize={20}
        />
      </View>
    </ScreenContainer>
  );
};

export default Notification;
