import {UserType} from './authType';

export type Songs = {
  name: string;
  file_url: string;
};

export type PollType = {
  option: string;
};

export type Party = {
  partyName: string;
  partyDesc: string;
  albumPicture: string;
  songs: Songs[];
  date: string;
  visibility: 'public' | 'private';
  guests?: string[];
  pollQuestion?: string;
  pollOptions: PollType[];
  partyApplicationClosingDate?: string;
};

export type PartyError = {
  response?: {
    data?: {
      message?: string;
      statusCode?: number;
    };
  };
  code?: string;
};

export type Song = {
  name: string;
  file_url: string;
  _id: string;
};

export type PartiesResponse = {
  __v: number;
  _id: string;
  albumPicture: string;
  artist: {
    FCMToken: string;
    __v: number;
    _id: string;
    email: string;
    followers: string[];
    following: string[];
    name: string;
    image: string;
    userType: string;
    profile?: any;
    stageName: string;
  };
  comments: any[]; // Define further if the structure of comments is known
  date: string;
  endParty: boolean;
  guests: string[];
  likes: any[]; // Define further if the structure of likes is known
  partyDesc: string;
  partyName: string;
  pollOptions: PollType[];
  songs: Song[]; // Define further if the structure of songs is known
  visibility: string;
};

interface UserProfile {
  country: string;
  dateOfBirth: string; // Use 'Date' if you prefer to work with Date objects
  desc: string;
  image: string;
  location: string;
  isVerified: boolean;
  _id: string;
  name: string;
  email: string;
  userType: string;
  __v: number;
}

export type FeedResponse = {
  __v: number;
  _id: string;
  comments: any[];
  createdAt: string;
  likes: any[];
  mediaFiles: string[];
  text: string;
  updatedAt: string;
  user: {
    profile: UserProfile;
    _id: string;
    name: string;
    email: string;
    userType: UserType;
  };
};
