import axios from 'axios';

export const fetchPostsApi = async () => {
  try {
    const response = await axios.get('/posts');
    console.log('Response data:', response.data);
    return response.data;
  } catch (err) {
    console.error('Error fetching posts: ', err);
  }
};

export const fetchPostsDetailApi = async () => {
  try {
    const response = await axios.get('/posts/detail');
    console.log('Response datasssss:', response.data);
    return response.data;
  } catch (err) {
    console.error('Error fetching postsDetail: ', err);
  }
};
