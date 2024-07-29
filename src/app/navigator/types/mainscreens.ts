import Notification from "src/app/notifications/screens/Notification";
import { MainStackParamList } from "./MainStackParamList";
import CreateNewPosts from "src/app/posts/screens/CreateNewPosts";
import PlanYourParty from "src/app/party/screens/PlanYourParty";
import PartyScreen from "src/app/party/screens/PartyScreen";
import BottomNavigator from "../BottomNavigator";
import PartyOptionScreen from "src/app/party/screens/PartyOptionScreen";
import Settings from "src/app/settings/screens/Settings";
import AuthNavigator from "../AuthNavigator";
import PartySuccessScreen from "src/app/party/screens/PartySuccessScreen";
import StartPartyListing from "src/app/party/screens/StartPartyListing";
import SongReview from "src/app/songreview/screens/SongReview";
import SongReviewSuccess from "src/app/songreview/screens/SongReviewSuccess";
import PartyWait from "src/app/party/screens/PartyWait";
import { CardStyleInterpolators } from "@react-navigation/stack";

interface ScreenDef {
     name: keyof MainStackParamList;
     screen: React.ComponentType<any>;
     options?: object;
}

export const mainNavigatorScreens: ScreenDef[] = [
     {
          name: "Notifications",
          screen: Notification,
          options: { cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS },
     },
     {
          name: "SongReviewSuccess",
          screen: SongReviewSuccess,
          options: { cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS },
     },
     {
          name: "SongReview",
          screen: SongReview,
          options: { cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS },
     },
     {
          name: "CreateNewPost",
          screen: CreateNewPosts,
          options: { cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS },
     },
     {
          name: "PlanYourParty",
          screen: PlanYourParty,
          options: { cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS },
     },
     {
          name: "PartyScreen",
          screen: PartyScreen,
          options: { cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS },
     },
     {
          name: "PartyOptions",
          screen: PartyOptionScreen,
          options: { cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS },
     },
     {
          name: "PartySuccessScreen",
          screen: PartySuccessScreen,
          options: { cardStyleInterpolator: CardStyleInterpolators.forFadeFromBottomAndroid },
     },
     {
          name: "StartPartyListing",
          screen: StartPartyListing,
          options: { cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS },
     },
     {
          name: "PartyWait",
          screen: PartyWait,
          options: { cardStyleInterpolator: CardStyleInterpolators.forFadeFromBottomAndroid },
     },
     {
          name: "BottomNavigator",
          screen: BottomNavigator,
          options: { cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS },
     },
     {
          name: "Settings",
          screen: Settings,
          options: { cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS },
     },
     {
          name: "AuthNavigator",
          screen: AuthNavigator,
          options: { cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS },
     },
];
