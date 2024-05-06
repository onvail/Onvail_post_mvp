import api from 'src/api/api';

export const fetchParties = async () => {
  try {
    const res = await api.get({
      url: 'parties',
      authorization: true,
    });
    return res.data.parties;
  } catch (error) {
    return error;
  }
};

export const fetchPosts = async () => {
  try {
    const res = await api.get({
      url: 'users/post',
      authorization: true,
    });
    return res?.data?.posts;
  } catch (error) {
    return error;
  }
};
