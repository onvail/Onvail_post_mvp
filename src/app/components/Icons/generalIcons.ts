import {SvgProps} from 'react-native-svg';
import HomeSvg from 'src/assets/svg/home.svg';
import ProfileSvg from 'src/assets/svg/profile.svg';

type GeneralType = 'Home' | 'Profile';

export const generalIcon: Record<GeneralType, React.FC<SvgProps>> = {
  ['Home']: HomeSvg,
  ['Profile']: ProfileSvg,
};
