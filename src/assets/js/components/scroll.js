import { scrollToSmoothly, offset } from "../scripts/core/helpers";
import { body, menu, menuActive, menuLink, headerTop } from "../scripts/variables";
import { removeHash } from "../scripts/other/url";

/* 
	================================================
	  
	Плавная прокрутка
	
	================================================
*/

export function scroll() {
	let headerScroll = 0;
	const scrollLinks = document.querySelectorAll('.scroll, .menu a');

	if (scrollLinks.length) {
		scrollLinks.forEach(link => {
			link.addEventListener('click', e => {
				const target = link.hash;

				if (target && target !== '#') {
					const scrollBlock = document.querySelector(target);
					e.preventDefault();

					if (scrollBlock) {
						headerScroll = (window.getComputedStyle(scrollBlock).paddingTop === '0px') ? -40 : 0;

						scrollToSmoothly(
							offset(scrollBlock).top - parseInt(headerTop.querySelector('.header-fixed').clientHeight - headerScroll),
							400
						);

						removeHash();
						menu.classList.remove(menuActive);
						menuLink.classList.remove('active');
						body.classList.remove('no-scroll');
					} else {
						let [baseUrl, hash] = link.href.split('#');
						if (window.location.href !== baseUrl && hash) {
							link.setAttribute('href', `${baseUrl}?link=${hash}`);
							window.location = link.getAttribute('href');
						}
					}
				}
			});
		});
	}

	document.addEventListener('DOMContentLoaded', () => {
		const urlParams = new URLSearchParams(window.location.search);
		const link = urlParams.get('link');

		if (link) {
			const scrollBlock = document.getElementById(link);
			if (scrollBlock) {
				headerScroll = (window.getComputedStyle(scrollBlock).paddingTop === '0px') ? -40 : 0;

				scrollToSmoothly(
					offset(scrollBlock).top - parseInt(headerTop.clientHeight - headerScroll),
					400
				);

				urlParams.delete('link');
				window.history.replaceState({}, '', `${window.location.pathname}?${urlParams}`);
			}
		}
	});
}
