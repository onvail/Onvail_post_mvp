interface Props {
  name: string;
  imageUrl: string;
}

export const sampleStatus: Props[] = [
  {
    name: 'Onvail Story',
    imageUrl:
      'https://i0.wp.com/digital-photography-school.com/wp-content/uploads/2023/10/headshot-photography-1016.jpg?w=1500&ssl=1',
  },
  {
    name: 'Jorja Smith',
    imageUrl:
      'https://www.cityheadshots.com/uploads/5/1/2/1/5121840/editor/mjb-2465.jpg?1643119031',
  },
  {
    name: 'Stormzy',
    imageUrl:
      'https://www.cityheadshots.com/uploads/5/1/2/1/5121840/editor/girlfriend.jpg?1643119015',
  },
  {
    name: 'Lacrae',
    imageUrl:
      'https://www.cityheadshots.com/uploads/5/1/2/1/5121840/published/mjb-8422.jpg?1663614985',
  },
  {
    name: 'Burna',
    imageUrl:
      'https://images.ctfassets.net/h6goo9gw1hh6/2sNZtFAWOdP1lmQ33VwRN3/24e953b920a9cd0ff2e1d587742a2472/1-intro-photo-final.jpg?w=1200&h=992&q=70&fm=webp',
  },
  {
    name: 'Davido',
    imageUrl:
      'https://images.squarespace-cdn.com/content/v1/5aee389b3c3a531e6245ae76/1630405902916-9J7O93CHXWB046497UNE/Headshots_Matter_London_LinkedIn_Portraits_Ivan_Weiss_01.jpg?format=300w',
  },
];

export interface SongsProps {
  title: string;
  artist: string;
  duration: number;
  index?: number;
  url: string;
}

export const sampleSongs: SongsProps[] = [
  {
    title: 'Heavy is the head',
    artist: 'Stormzy',
    duration: 170,
    url: 'https://www.learningcontainer.com/wp-content/uploads/2020/02/Kalimba.mp3',
  },
  {
    title: 'Who goes Der',
    artist: 'Dandizzy',
    duration: 140,
    url: 'https://www.learningcontainer.com/wp-content/uploads/2020/02/Kalimba.mp3',
  },
  {
    title: 'Let her go',
    artist: 'Passenger',
    duration: 200,
    url: 'https://www.learningcontainer.com/wp-content/uploads/2020/02/Kalimba.mp3',
  },
  {
    title: 'Everything',
    artist: 'Passenger',
    duration: 210,
    url: 'https://www.learningcontainer.com/wp-content/uploads/2020/02/Kalimba.mp3',
  },
  {
    title: 'Declan Rice',
    artist: 'OdumoduBlvck',
    duration: 190,
    url: 'https://www.learningcontainer.com/wp-content/uploads/2020/02/Kalimba.mp3',
  },
  {
    title: 'Last Last',
    artist: 'Burnaboy',
    duration: 150,
    url: 'https://www.learningcontainer.com/wp-content/uploads/2020/02/Kalimba.mp3',
  },
];
