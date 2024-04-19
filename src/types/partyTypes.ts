type Songs = {
  name: string;
  file_url: string;
};

export type PollType = {
  option: string;
};

export type Party = {
  partyName: string;
  partyDesc: string;
  albumPicture: string | undefined;
  songs: Songs[];
  date: string;
  visibility: 'public' | 'private';
  guests: [];
  pollQuestion: string;
  pollOptions: PollType[];
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
    userType: string;
    profile?: any;
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
