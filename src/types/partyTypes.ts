type Songs = {
  name: string;
  file_url: string;
};

export type Party = {
  partyName: string;
  partyDesc: string;
  albumPicture: string | undefined;
  songs: Songs[];
  date: string;
  visibility: 'public' | 'private';
  guests: [];
};
