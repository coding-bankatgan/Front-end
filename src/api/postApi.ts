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

/** Kakao 맵 api */
export const getAddress = async (latitude: number | null, longitude: number | null) => {
  const apiKey = 'f21248c02fc4d05f9ce83b60e063d55d';
  const url = `https://dapi.kakao.com/v2/local/geo/coord2address.json?x=${longitude}&y=${latitude}`;

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `KakaoAK ${apiKey}`,
      },
    });
    const data = await response.json();

    if (data.documents && data.documents.length > 0) {
      const address = data.documents[0].address.address_name;
      return address;
    } else {
      throw new Error('Geocoding failed');
    }
  } catch (error) {
    console.error('Error fetching address:', error);
  }
};
