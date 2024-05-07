import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {FunctionComponent, FC} from 'react';
import {TouchableOpacity, View} from 'react-native';
import {SvgProps} from 'react-native-svg';
import {generalIcon} from 'src/app/components/Icons/generalIcons';
import ScreenContainer from 'src/app/components/Screens/ScreenContainer';
import CustomText from 'src/app/components/Text/CustomText';
import RowContainer from 'src/app/components/View/RowContainer';
import {MainStackParamList} from 'src/app/navigator/types/MainStackParamList';
import tw from 'src/lib/tailwind';
import Icon from 'src/app/components/Icons/Icon';

interface ClickableProps {
  icon: FC<SvgProps>;
  title: string;
  details: string;
  onPress: () => void;
}

interface ClickableItem {
  icon: FC<SvgProps>;
  title: string;
  details: string;
  route: 'jam-session' | 'artist-showdown';
}

const PartyClickablePlaceHolderIcon = generalIcon.PartyClickablePlaceHolder;

type ScreenProps = NativeStackScreenProps<MainStackParamList, 'PartyOptions'>;

const clickableIcons: ClickableItem[] = [
  {
    title: 'Plan a Cozy Jam Session',
    details: 'Ideal for private events and intimate listener groups.',
    route: 'jam-session',
    icon: PartyClickablePlaceHolderIcon,
  },
  {
    title: 'Set Up an Artist Showdown',
    details: 'Set Up an Artist Showdown',
    route: 'artist-showdown',
    icon: PartyClickablePlaceHolderIcon,
  },
];

const Clickable: FunctionComponent<ClickableProps> = ({
  icon,
  title,
  details,
  onPress,
}) => {
  const ClickableIcon = icon;
  return (
    <TouchableOpacity
      style={tw`border my-4 border-purple rounded-lg`}
      onPress={onPress}>
      <RowContainer style={tw` justify-between  h-38`}>
        <View style={tw`p-4 `}>
          <View
            style={tw`bg-purple5 w-8 h-8 justify-center items-center p-1 rounded-full`}>
            <ClickableIcon />
          </View>
          <CustomText style={tw`text-lg w-65 font-bold mt-2`}>
            {title}
          </CustomText>
          <CustomText style={tw`text-grey2 w-60 text-sm`}>{details}</CustomText>
        </View>
        <View
          style={tw`bg-purple h-full w-12 rounded-r-md  items-center justify-center`}>
          <Icon icon={'chevron-right'} color="white" size={30} />
        </View>
      </RowContainer>
    </TouchableOpacity>
  );
};

const PartyOptionScreen: FunctionComponent<ScreenProps> = ({navigation}) => {
  return (
    <ScreenContainer goBack screenHeader="Plan a party">
      <View style={tw`mx-5 mt-7`}>
        {clickableIcons.map((item, _) => (
          <Clickable
            key={item.title}
            icon={item.icon}
            title={item.title}
            details={item.details}
            onPress={() =>
              navigation.navigate('PlanYourParty', {
                partyType: item.route,
              })
            }
          />
        ))}
      </View>
    </ScreenContainer>
  );
};

export default PartyOptionScreen;
