import React, { FunctionComponent } from "react";
import { View } from "react-native";
import ScreenContainer from "components/Screens/ScreenContainer";
import tw from "src/lib/tailwind";
import NotificationCard, { NotificationProps } from "../components/NotificationCard";
import { FlashList, ListRenderItem } from "@shopify/flash-list";
import { notification } from "src/utils/notifications";

// const renderItem: ListRenderItem<NotificationProps> = ({item}) => (
//   <NotificationCard
//     onclick={() => console.log('1')}
//     imageUri={item.imageUri}
//     subject={item.subject}
//     timeStamp={item.timeStamp}
//     message={item.message}
//   />
// );

const Notification: FunctionComponent = ({ navigation }) => {
     const renderItem: ListRenderItem<NotificationProps> = ({ item }) => (
          <NotificationCard
               // onclick={() =>
               //   navigation.navigate('MainAppNavigator', {
               //     screen: 'Notifications',
               //   })
               // }
               onViewNotification={() =>
                    navigation.navigate("MainAppNavigator", {
                         screen: "SongReview",
                    })
               }
               isViewNotification={item?.isViewNotification}
               imageUri={item.imageUri}
               subject={item.subject}
               timeStamp={item.timeStamp}
               message={item.message}
               startParty={item.startParty}
               onStartParty={() =>
                    navigation.navigate("MainAppNavigator", {
                         screen: "StartPartyListing",
                    })
               }
          />
     );

     return (
          <ScreenContainer goBack screenHeader="Notifications">
               <View style={tw`border-t-[0.3px] border-grey2 flex-1 mt-10`}>
                    <FlashList data={notification} renderItem={renderItem} estimatedItemSize={20} />
               </View>
          </ScreenContainer>
     );
};

export default Notification;
