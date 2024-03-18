type PostType = 'Music' | 'Image';

export interface Post {
  key: string;
  profileImage?: string;
  userName?: string;
  postImage?: string;
  postText?: string;
  commentCount?: number;
  likeCount?: number;
  postType?: PostType;
  musicUrl?: string;
  musicTitle?: string;
  artist?: string;
}

export const posts: Post[] = [
  {
    key: '1',
    profileImage:
      'https://www.cityheadshots.com/uploads/5/1/2/1/5121840/editor/girlfriend.jpg?1643119015',
    userName: 'Sabrina Carpenter',
    postText:
      'Sleeping with the fishes made the meats run dry in her episconic sagacious vibe. Listen and be blessed',
    postImage:
      'https://indiater.com/wp-content/uploads/2021/06/Free-Music-Album-Cover-Art-Banner-Photoshop-Template-990x990.jpg',
  },
  {
    key: '2',
    profileImage:
      'https://www.cityheadshots.com/uploads/5/1/2/1/5121840/editor/girlfriend.jpg?1643119015',
    userName: 'Sabrina Carpenter',
    postText:
      'Sleeping with the fishes made the meats run dry in her episconic sagacious vibe. Listen and be blessed',
    postImage:
      'https://miro.medium.com/v2/resize:fit:720/format:webp/1*EBOL4lka5QjcYoxj6AHp-g.png',
  },
  {
    key: '3',
    profileImage:
      'https://www.cityheadshots.com/uploads/5/1/2/1/5121840/editor/girlfriend.jpg?1643119015',
    userName: 'Sabrina Carpenter',
    postText:
      'Sleeping with the fishes made the meats run dry in her episconic sagacious vibe. Listen and be blessed',
    postImage:
      'https://img.buzzfeed.com/buzzfeed-static/complex/images/bebllwzjpsujz9ffwp6s/tyler-the-creator-scum-fuck-flower-boy-cover.png?downsize=920:*&output-format=auto&output-quality=auto',
  },
  {
    key: '4',
    postType: 'Music',
    musicUrl: 'https://www2.cs.uic.edu/~i101/SoundFiles/BabyElephantWalk60.wav',
    musicTitle: 'Blunt & Business',
    artist: 'Stovia',
  },
];
