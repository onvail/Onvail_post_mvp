import {UserType} from 'src/types/authType';

type Roles = {
  key: string;
  value: UserType;
};

export const roles: Roles[] = [
  {
    key: 'Artiste',
    value: UserType.Artist,
  },
  {
    key: 'Producer',
    value: UserType.Producer,
  },
  {
    key: 'A&R',
    value: UserType.AR,
  },
  {
    key: 'Manager',
    value: UserType.Manager,
  },
  {
    key: 'Label Representative',
    value: UserType.Label_Representative,
  },
  {
    key: 'Music Content Creator',
    value: UserType.Music_Content_Creator,
  },
  {
    key: 'Fan',
    value: UserType.Fan,
  },
];
