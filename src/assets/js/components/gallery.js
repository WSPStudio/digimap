import { body, bodyOpenModalClass, } from "../scripts/variables";
import { hideScrollbar, showScrollbar } from "../scripts/other/scroll";

/* 
	================================================
	  
	Галереи
	
	================================================
*/

export function gallery() {
	let popupState = false
	let galleries = document.querySelectorAll('[data-gallery]');

	if (galleries.length) {
		galleries.forEach(gallery => {
			if (!gallery.classList.contains('gallery_init')) {
				let selector = false;

				if (gallery.querySelectorAll('[data-gallery-item]').length) {
					selector = '[data-gallery-item]'
				} else if (gallery.classList.contains('swiper-wrapper')) {
					selector = '.swiper-slide>a'
				} else if (gallery.tagName == 'A') {
					selector = false
				} else {
					selector = 'a'
				}

				lightGallery(gallery, {
					plugins: [lgZoom, lgThumbnail],
					licenseKey: '7EC452A9-0CFD441C-BD984C7C-17C8456E',
					speed: 300,
					selector: selector,
					mousewheel: true,
					zoomFromOrigin: false,
					mobileSettings: {
						controls: false,
						showCloseIcon: true,
						download: true,
					},
					subHtmlSelectorRelative: true,
				});

				gallery.classList.add('gallery_init')

				gallery.addEventListener('lgBeforeOpen', () => {
					if (body.classList.contains(bodyOpenModalClass)) {
						popupState = true;
					}
					hideScrollbar()
				});

				gallery.addEventListener('lgBeforeClose', () => {
					showScrollbar()
				});
			}
		});
	}
}
