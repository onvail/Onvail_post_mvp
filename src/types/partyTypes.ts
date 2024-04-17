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
