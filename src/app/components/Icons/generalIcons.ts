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
import Gallery from 'src/assets/svg/gallery.svg';
import MusicSquareIcon from 'src/assets/svg/music-square-add.svg';
import SendIcon from 'src/assets/svg/send.svg';
import VideoIcon from 'src/assets/svg/video-square.svg';
import FloatingIcon from 'src/assets/svg/action button.svg';
import EditIcon from 'src/assets/svg/editIcon.svg';
import BeatIcon from 'src/assets/svg/beats.svg';
import CameraSwitch from 'src/assets/svg/cameraSwitch.svg';
import GalleryThumbnail from 'src/assets/svg/image.svg';
import StormzyCover from 'src/assets/svg/stormzy.svg';
import HighLightLeft from 'src/assets/svg/highlightLeft.svg';
import HighLightRight from 'src/assets/svg/highlightRight.svg';
import PauseIcon from 'src/assets/svg/pauseIcon.svg';
import PlayIcon from 'src/assets/svg/playIcon.svg';
import ProfileImage from 'src/assets/svg/profileImage.svg';
import VoiceSquare from 'src/assets/svg/voice-square.svg';
import UploadIcon from 'src/assets/svg/upload.svg';
import PartyClickablePlaceHolder from 'src/assets/svg/partyPlaceholderIcon.svg';

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
  | 'Gallery'
  | 'MusicSquareIcon'
  | 'SendIcon'
  | 'VideoIcon'
  | 'FloatingIcon'
  | 'CameraSwitch'
  | 'BeatIcon'
  | 'EditIcon'
  | 'GalleryThumbnail'
  | 'StormzyCover'
  | 'HighLightLeft'
  | 'HighLightRight'
  | 'PauseIcon'
  | 'PlayIcon'
  | 'ProfileImage'
  | 'VoiceSquare'
  | 'PartyClickablePlaceHolder'
  | 'UploadIcon'
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
  ['Gallery']: Gallery,
  ['MusicSquareIcon']: MusicSquareIcon,
  ['SendIcon']: SendIcon,
  ['VideoIcon']: VideoIcon,
  ['FloatingIcon']: FloatingIcon,
  ['CameraSwitch']: CameraSwitch,
  ['BeatIcon']: BeatIcon,
  ['EditIcon']: EditIcon,
  ['GalleryThumbnail']: GalleryThumbnail,
  ['StormzyCover']: StormzyCover,
  ['HighLightRight']: HighLightRight,
  ['HighLightLeft']: HighLightLeft,
  ['PlayIcon']: PlayIcon,
  ['PauseIcon']: PauseIcon,
  ['ProfileImage']: ProfileImage,
  ['VoiceSquare']: VoiceSquare,
  ['PartyClickablePlaceHolder']: PartyClickablePlaceHolder,
  ['UploadIcon']: UploadIcon,
};
