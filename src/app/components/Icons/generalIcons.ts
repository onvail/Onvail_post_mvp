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
import AddIcon from 'src/assets/svg/add-icon.svg';
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
import MenuIcon from 'src/assets/svg/horizontalmenu.svg';
import PartyClickablePlaceHolder from 'src/assets/svg/partyPlaceholderIcon.svg';
import PartyJoinersIcon from 'src/assets/svg/partyjoinersicon.svg';
import Send2 from 'src/assets/svg/send2.svg';
import PlayIcon2 from 'src/assets/svg/playIcon2.svg';
import PauseIcon2 from 'src/assets/svg/pauseIcon2.svg';
import Tick from 'src/assets/svg/tick.svg';
import Ticksm from 'src/assets/svg/ticksm.svg';
import EmailBackgroundGradient from 'src/assets/svg/EmailBackgroundGradient.svg';
import ShareIcon from 'src/assets/svg/ShareIcon.svg';
import PartyWaitIcon from 'src/assets/svg/partywait.svg';
import EarpieceIcon from 'src/assets/svg/earpiece.svg';
import MicUnmuteIcon from 'src/assets/svg/mic-unmute.svg';
import MicMuteIcon from 'src/assets/svg/mic-mute.svg';
import HandRaisedIcon from 'src/assets/svg/hand-raised.svg';
import HandDownIcon from 'src/assets/svg/hand-down.svg';

type GeneralType =
  | 'Home'
  | 'AddIcon'
  | 'MenuIcon'
  | 'PartyJoinersIcon'
  | 'Profile'
  | 'Logo'
  | 'NotificationBell'
  | 'Heart'
  | 'BackgroundGradient'
  | 'EmailBackgroundGradient'
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
  | 'PlayIcon2'
  | 'ProfileImage'
  | 'VoiceSquare'
  | 'PartyClickablePlaceHolder'
  | 'UploadIcon'
  | 'Comment'
  | 'PauseIcon2'
  | 'Tick'
  | 'Send2'
  | 'Ticksm'
  | 'ShareIcon'
  | 'PartyWaitIcon'
  | 'MicMuteIcon'
  | 'MicUnmuteIcon'
  | 'HandRaisedIcon'
  | 'HandDownIcon'
  | 'EarpieceIcon';

export const generalIcon: Record<GeneralType, React.FC<SvgProps>> = {
  ['Home']: HomeSvg,
  ['AddIcon']: AddIcon,
  ['MenuIcon']: MenuIcon,
  ['Profile']: ProfileSvg,
  ['ShareIcon']: ShareIcon,
  ['Logo']: LogoSvg,
  ['NotificationBell']: NotificationBell,
  ['Heart']: Heart,
  ['Comment']: Comment,
  ['BackgroundGradient']: BackgroundGradient,
  ['EmailBackgroundGradient']: EmailBackgroundGradient,
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
  ['PlayIcon2']: PlayIcon2,
  ['PauseIcon']: PauseIcon,
  ['ProfileImage']: ProfileImage,
  ['VoiceSquare']: VoiceSquare,
  ['PartyClickablePlaceHolder']: PartyClickablePlaceHolder,
  ['UploadIcon']: UploadIcon,
  ['PartyJoinersIcon']: PartyJoinersIcon,
  ['Send2']: Send2,
  ['PauseIcon2']: PauseIcon2,
  ['Tick']: Tick,
  ['Ticksm']: Ticksm,
  ['PartyWaitIcon']: PartyWaitIcon,
  ['EarpieceIcon']: EarpieceIcon,
  ['MicMuteIcon']: MicMuteIcon,
  ['MicUnmuteIcon']: MicUnmuteIcon,
  ['HandRaisedIcon']: HandRaisedIcon,
  ['HandDownIcon']: HandDownIcon,
};
