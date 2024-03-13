import {SvgProps} from 'react-native-svg';
import LogoSvg from 'src/assets/svg/logo.svg';
import HomeSvg from 'src/assets/svg/home.svg';
import ProfileSvg from 'src/assets/svg/profile.svg';
import NotificationBell from 'src/assets/svg/bell.svg';

type GeneralType = 'Home' | 'Profile' | 'Logo' | 'NotificationBell';

export const generalIcon: Record<GeneralType, React.FC<SvgProps>> = {
  ['Home']: HomeSvg,
  ['Profile']: ProfileSvg,
  ['Logo']: LogoSvg,
  ['NotificationBell']: NotificationBell,
};
