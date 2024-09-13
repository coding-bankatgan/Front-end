import axios from 'axios';

export const fetchPostsApi = async () => {
  try {
    const response = await axios.get('api/posts');
    return response.data;
  } catch (err) {
    console.error('Error fetching posts: ', err);
  }
};

export const fetchPostsDetailApi = async (postId: number) => {
  try {
    const response = await axios.get(`api/posts/${postId}`);
    // console.log('aaoaooaoaoaoao', response.data);
    return response.data;
  } catch (err) {
    console.error('Error fetching postsDetail: ', err);
  }
};

export const fetchCommentsApi = async (postId: number, page: number, size: number) => {
  try {
    const response = await axios.get(`/api/${postId}/comments?number=${page}&size=${size}`);
    // console.log('rrrrrrrrrrrr', response.data);
    return response.data;
  } catch (err) {
    console.error('Error fetching comments: ', err);
  }
};
