// extensions/instagram/assets/instagram-feed.js

// (function() {
//   const BASE_URL = 'http://localhost:5050/scripttag';

//   // Create script element
//   const scriptElement = document.createElement('script');
//   scriptElement.type = 'text/javascript';
//   scriptElement.async = true;
//   scriptElement.defer = true;
//   scriptElement.src = `${BASE_URL}/instagram.min.js?v=${new Date().getTime()}`;
//   console.log('Instagram Feed loading from:', scriptElement.src);

//   // Insert script vào DOM
//   const firstScript = document.getElementsByTagName('script')[0];
//   firstScript.parentNode.insertBefore(scriptElement, firstScript);
// })();

document.addEventListener('DOMContentLoaded', function() {
  const videoItems = document.querySelectorAll('.instagram-feed__item');

  videoItems.forEach(item => {
    const video = item.querySelector('video');
    if (!video) return;

    const posterUrl = video.getAttribute('poster');

    item.addEventListener('mouseenter', () => {
      video.style.opacity = '1';
      video.play();
    });

    item.addEventListener('mouseleave', () => {
      video.pause();
      video.currentTime = 0;
      video.style.opacity = '0';
      setTimeout(() => {
        if (!item.matches(':hover')) {
          video.load();
        }
      }, 200);
    });
  });

  const modal = document.getElementById('instagram-modal');
  const modalImage = document.getElementById('modal-image');
  const modalVideo = document.getElementById('modal-video');
  const modalCaption = document.getElementById('modal-caption');
  const modalLikes = document.getElementById('modal-likes').querySelector('span');
  const modalComments = document.getElementById('modal-comments').querySelector('span');
  const closeButton = modal.querySelector('.instagram-modal__close');

  // Xử lý click vào item
  document.querySelectorAll('.instagram-feed__item').forEach(item => {
    item.addEventListener('click', function() {
      const data = JSON.parse(this.getAttribute('data-item'));

      // Reset modal content
      modalImage.style.display = 'none';
      modalVideo.style.display = 'none';

      if (data.type === 'video') {
        modalVideo.src = data.videoUrl;
        modalVideo.style.display = 'block';
        modalVideo.play();
      } else {
        modalImage.src = data.mediaUrl;
        modalImage.style.display = 'block';
      }

      modalCaption.textContent = data.caption;
      modalLikes.textContent = data.likeCount.toLocaleString();
      modalComments.textContent = data.commentCount.toLocaleString();
      modal.style.display = 'block';
      document.body.style.overflow = 'hidden';
    });
  });

  // Đóng modal
  closeButton.addEventListener('click', () => {
    modal.style.display = 'none';
    modalVideo.pause();
    modalVideo.currentTime = 0; // Reset video khi đóng
    document.body.style.overflow = '';
  });

  // Đóng modal khi click bên ngoài
  modal.addEventListener('click', e => {
    if (e.target === modal) {
      modal.style.display = 'none';
      modalVideo.pause();
      modalVideo.currentTime = 0; // Reset video khi đóng
      document.body.style.overflow = '';
    }
  });
});