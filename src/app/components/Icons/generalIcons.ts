import {SvgProps} from 'react-native-svg';
import LogoSvg from 'src/assets/svg/logo.svg';
import HomeSvg from 'src/assets/svg/home.svg';
import ProfileSvg from 'src/assets/svg/profile.svg';
import NotificationBell from 'src/assets/svg/bell.svg';
import Heart from 'src/assets/svg/heart.svg';
import Comment from 'src/assets/svg/comment.svg';
import BackgroundGradient from 'src/assets/svg/background.svg';
import Deezer from 'src/assets/svg/Deezer.svg';
import Google from 'src/assets/svg/Google.svg';
import Spotify from 'src/assets/svg/Spotify.svg';
import X from 'src/assets/svg/X.svg';
import Stripe from 'src/assets/svg/Stripe.svg';
import AddSquare from 'src/assets/svg/add-square.svg';

type GeneralType =
  | 'Home'
  | 'Profile'
  | 'Logo'
  | 'NotificationBell'
  | 'Heart'
  | 'BackgroundGradient'
  | 'Deezer'
  | 'Google'
  | 'Spotify'
  | 'X'
  | 'Stripe'
  | 'AddSquare'
  | 'Comment';

export const generalIcon: Record<GeneralType, React.FC<SvgProps>> = {
  ['Home']: HomeSvg,
  ['Profile']: ProfileSvg,
  ['Logo']: LogoSvg,
  ['NotificationBell']: NotificationBell,
  ['Heart']: Heart,
  ['Comment']: Comment,
  ['BackgroundGradient']: BackgroundGradient,
  ['Deezer']: Deezer,
  ['Google']: Google,
  ['Spotify']: Spotify,
  ['X']: X,
  ['Stripe']: Stripe,
  ['AddSquare']: AddSquare,
};
