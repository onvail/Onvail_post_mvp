import Notification from 'src/app/notifications/screens/Notification';
import {MainStackParamList} from './MainStackParamList';
import CreateNewPosts from 'src/app/posts/screens/CreateNewPosts';
import PlanYourParty from 'src/app/party/screens/PlanYourParty';
import PartyScreen from 'src/app/party/screens/PartyScreen';
import BottomNavigator from '../BottomNavigator';
import PartyOptionScreen from 'src/app/party/screens/PartyOptionScreen';
import Settings from 'src/app/settings/screens/Settings';
import AuthNavigator from '../AuthNavigator';
import PartySuccessScreen from 'src/app/party/screens/PartySuccessScreen';
import StartPartyListing from 'src/app/party/screens/StartPartyListing';
import SongReview from 'src/app/songreview/screens/SongReview';
import SongReviewSuccess from 'src/app/songreview/screens/SongReviewSuccess';
import PartyWait from 'src/app/party/screens/PartyWait';

interface ScreenDef {
  name: keyof MainStackParamList;
  screen: React.ComponentType<any>;
}

export const mainNavigatorScreens: ScreenDef[] = [
  {
    name: 'Notifications',
    screen: Notification,
  },
  {
    name: 'SongReviewSuccess',
    screen: SongReviewSuccess,
  },
  {
    name: 'SongReview',
    screen: SongReview,
  },
  {
    name: 'CreateNewPost',
    screen: CreateNewPosts,
  },
  {
    name: 'PlanYourParty',
    screen: PlanYourParty,
  },
  {
    name: 'PartyScreen',
    screen: PartyScreen,
  },
  {
    name: 'PartyOptions',
    screen: PartyOptionScreen,
  },
  {
    name: 'PartySuccessScreen',
    screen: PartySuccessScreen,
  },
  {
    name: 'StartPartyListing',
    screen: StartPartyListing,
  },
  {
    name: 'PartyWait',
    screen: PartyWait,
  },
  {
    name: 'BottomNavigator',
    screen: BottomNavigator,
  },
  {
    name: 'Settings',
    screen: Settings,
  },
  {
    name: 'AuthNavigator',
    screen: AuthNavigator,
  },
];
