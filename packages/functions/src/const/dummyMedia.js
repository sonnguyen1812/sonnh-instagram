const dummyMedia = [
  // Ảnh
  {
    id: 1,
    type: 'image',
    mediaUrl:
      'https://images.unsplash.com/photo-1433086966358-54859d0ed716?auto=format&fit=crop&w=600&q=80',
    commentCount: 89,
    likeCount: 1234,
    caption: 'Beautiful forest view 🌲 #nature #photography',
    postDate: '2024-03-20T15:30:00Z'
  },
  {
    id: 2,
    type: 'video',
    videoUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    posterUrl:
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg',
    commentCount: 156,
    likeCount: 2567,
    caption: 'Big Buck Bunny 🐰 #animation #fun',
    postDate: '2024-03-19T10:15:00Z'
  },
  {
    id: 3,
    type: 'image',
    mediaUrl:
      'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&w=600&q=80',
    commentCount: 45,
    likeCount: 876,
    caption: 'Mountain peaks ⛰️ #adventure #travel',
    postDate: '2024-03-18T08:20:00Z'
  },
  {
    id: 4,
    type: 'video',
    videoUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    posterUrl:
      'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/ElephantsDream.jpg',
    commentCount: 234,
    likeCount: 3456,
    caption: 'Elephants Dream 🎬 #video #creative',
    postDate: '2024-03-17T14:45:00Z'
  },
  {
    id: 5,
    type: 'image',
    mediaUrl:
      'https://images.unsplash.com/photo-1475924156734-496f6cac6ec1?auto=format&fit=crop&w=600&q=80',
    commentCount: 67,
    likeCount: 1543,
    caption: 'Sunset colors 🌅 #sunset #nature',
    postDate: '2024-03-16T18:30:00Z'
  }
];

const mediaHelpers = {
  search: (media, query) => {
    return media.filter(item => item.caption.toLowerCase().includes(query.toLowerCase()));
  },

  sort: (media, by = 'likes') => {
    return [...media].sort((a, b) =>
      by === 'likes' ? b.likeCount - a.likeCount : b.commentCount - a.commentCount
    );
  },

  filterByDate: (media, startDate, endDate) => {
    return media.filter(item => {
      const postDate = new Date(item.postDate);
      return postDate >= startDate && postDate <= endDate;
    });
  }
};

export {dummyMedia, mediaHelpers};
