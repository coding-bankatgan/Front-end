import axios from 'axios';

/** 전체 게시글 조회 API */
export const fetchPostsApi = async () => {
  try {
    const response = await axios.get('api/posts');
    return response.data;
  } catch (err) {
    console.error('Error fetching posts: ', err);
  }
};

/** 특정 게시글 상세 조회 API */
export const fetchPostsDetailApi = async (postId: number) => {
  try {
    const response = await axios.get(`api/posts/${postId}`);
    return response.data;
  } catch (err) {
    console.error('Error fetching postsDetail: ', err);
  }
};

/** 특정 게시글 댓글 작성 API */
export const fetchCommentWriteApi = async (postId: number, content: string) => {
  try {
    const response = await axios.post(
      'api/comments',
      {
        postId: postId,
        content: content,
        anonymous: false,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    return response.data;
  } catch (err) {
    console.error('Error fetching commentWrite: ', err);
  }
};

/** 특정 게시글 댓글 조회 API */
export const fetchCommentsApi = async (postId: number, page: number, size: number) => {
  try {
    const response = await axios.get(`/api/${postId}/comments?number=${page}&size=${size}`);
    console.log('API response:', response.data);
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
