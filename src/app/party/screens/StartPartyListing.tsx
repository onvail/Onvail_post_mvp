import React, {FunctionComponent} from 'react';
import {TouchableOpacity, View} from 'react-native';
import ScreenContainer from 'components/Screens/ScreenContainer';
import tw from 'src/lib/tailwind';
import NotificationCard, {
  NotificationProps,
} from '../components/NotificationCard';
import {FlashList, ListRenderItem} from '@shopify/flash-list';
import {notification} from 'src/utils/notifications';
import RowContainer from 'src/app/components/View/RowContainer';
import CustomImage from 'src/app/components/Image/CustomImage';
import CustomText from 'src/app/components/Text/CustomText';
import {generalIcon} from 'src/app/components/Icons/generalIcons';
import PartyCard from '../components/PartyCard';
import {nextparties} from 'src/utils/nextparties';
const StartPartyListing: FunctionComponent = ({navigation}) => {
  //   const ShareIcon = generalIcon.ShareIcon;

  const renderItem: ListRenderItem<NotificationProps> = ({item}) => (
    <PartyCard
      banner={item.banner}
      username={item.username}
      partytitle={item.partytitle}
      datetime={item.datetime}
      showStartButton={item.showStartButton}
      onClickStart={() =>
        navigation.navigate('MainAppNavigator', {
          screen: 'PartyWait',
        })
      }
    />
  );

  return (
    <ScreenContainer goBack screenHeader="Start your party ">
      <View style={tw`flex-1 mt-4 px-3`}>
        <PartyCard
          banner="https://resizing.flixster.com/xkP-QzPdNnU1Q8KQuBB6Q0YCeTU=/218x280/v2/https://resizing.flixster.com/-XZAfHZM39UwaGJIFWKAE8fS0ak=/v3/t/assets/371287_v9_bc.jpg"
          username={'hanitaharry'}
          partytitle={'Battle of the mic for all'}
          datetime={'Wednesday 24th • 4:00pm'}
          showStartButton={true}
          onClickStart={() =>
            navigation.navigate('MainAppNavigator', {
              screen: 'PartyWait',
            })
          }
        />
        <View style={tw`px-3`}>
          <CustomText style={tw`text-2xl font-bold text-white mb-6`}>
            Next Parties
          </CustomText>
        </View>
        <FlashList
          data={nextparties}
          renderItem={renderItem}
          estimatedItemSize={20}
        />
      </View>
    </ScreenContainer>
  );
};

export default StartPartyListing;
