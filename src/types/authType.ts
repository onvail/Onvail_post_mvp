export enum UserType {
  Fan = 'fan',
  Artist = 'artist',
  Producer = 'producer',
  AR = 'a&r',
  Manager = 'manager',
  Label_Representative = 'label_representative',
  Music_Content_Creator = 'music_content_creator',
  Other = 'other',
}

export type SignInProps = {
  name: string;
  email: string;
  password: string;
  stageName: string;
  userType: UserType;
};

export type LoginProps = {
  email: string;
  password: string;
};

export type AuthError = {
  response?: {
    data?: {
      message?: string;
      statusCode?: number;
    };
  };
  code?: string;
};
