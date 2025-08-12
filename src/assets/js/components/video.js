/* 
	================================================
	  
	Вставка видео
	
	================================================
*/

export function video() {
	class LazyVideo {
		constructor(videoUrl, options = {}) {
			let defaultOptions = {
				isFile: false,
			};

			this.options = Object.assign(defaultOptions, options);
			this.isFile = options.isFile;
			this.container = options.container;
			this.videoUrl = this.normalizeUrl(videoUrl);

			if (!this.container) return;

			this.video = this.container.querySelector('video');
			this.playButton = this.container.querySelector('.video__play');

			if (!this.video) return;

			if (!this.playButton) {
				this.playButton = document.createElement('button');
				this.playButton.className = 'video__play';
				this.playButton.setAttribute('type', 'button');
				this.container.appendChild(this.playButton);
			}

			this.init();
		}

		init() {
			this.playButton?.addEventListener('click', () => this.loadVideo(), { once: true });
		}

		loadVideo() {
			this.video.setAttribute('controls', '');
			this.video.play();
			this.playButton.remove();
			this.container.classList.add('active');
		}

		normalizeUrl(url) {
			const vkShortRegex = /^https:\/\/vkvideo\.ru\/video(\d+)_(\d+)$/;
			const vkMatch = url?.match(vkShortRegex);
			if (vkMatch) {
				const oid = vkMatch[1];
				const id = vkMatch[2];
				return `https://vkvideo.ru/video_ext.php?oid=${oid}&id=${id}&hd=2`;
			}

			const rutubeRegex = /^https:\/\/rutube\.ru\/video\/([a-z0-9]+)\/?$/i;
			const rutubeMatch = url?.match(rutubeRegex);
			if (rutubeMatch) {
				const id = rutubeMatch[1];
				return `https://rutube.ru/play/embed/${id}`;
			}

			return url;
		}
	}

	const videos = document.querySelectorAll('.video');

	if (videos.length) {
		videos.forEach(video => {
			const videoTag = video.querySelector('video');
			const videoUrl = video.dataset.url || videoTag?.querySelector('source')?.src || '';

			const isFile = (() => {
				try {
					const url = new URL(videoUrl, window.location.origin);
					return url.origin === window.location.origin;
				} catch {
					return true;
				}
			})();

			new LazyVideo(videoUrl, {
				container: video,
				isFile: isFile
			});
		});
	}
}

