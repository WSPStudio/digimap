import { body, bodyOpenModalClass } from "../scripts/variables";
import { hideScrollbar, showScrollbar } from "../scripts/other/scroll";
import { fadeIn, fadeOut } from "../scripts/other/animation";
import { getHash } from "../scripts/other/url"
import { clearInputs } from "../scripts/forms/validation";

/* 
	================================================
	  
	Попапы
	
	================================================
*/

export function popup() {
	document.querySelectorAll('[data-modal]').forEach(button => {
		button.addEventListener('click', function () {
			let [dataModal, dataTab] = button.getAttribute('data-modal').split('#');

			let popup = document.querySelector(`#${dataModal}`)
			if (!popup) return

			// Удалить хеш текущего попапа
			if (getHash()) {
				history.pushState("", document.title, (window.location.pathname + window.location.search).replace(getHash(), ''));
			}

			hideScrollbar();

			body.classList.add(bodyOpenModalClass)

			// Добавить хеш нового попапа
			if (!window.location.hash.includes(dataModal)) {
				window.location.hash = dataModal;
			}

			fadeIn(popup, true);

			// открыть таб в попапе
			if (dataTab) {
				document.querySelector(`[data-href="#${dataTab}"]`).click();
			}
		});
	});

	// Открытие модалки по хешу
	window.addEventListener('load', () => {
		const hash = window.location.hash.replace('#', '');
		if (hash) {
			const popup = document.querySelector(`.popup[id="${hash}"]`);
			if (popup) {
				setTimeout(() => {
					hideScrollbar();
					fadeIn(popup, true);
				}, 500);
			}
		}
	});


	// 
	// 
	// Закрытие модалок

	function closeModal(removeHashFlag = true) {
		fadeOut('.popup');
		document.querySelectorAll('[data-modal]').forEach(button => button.disabled = true);
		body.classList.remove(bodyOpenModalClass);

		setTimeout(() => {
			let modalInfo = document.querySelector('.popup-info');
			if (modalInfo) {
				modalInfo.value = '';
			}

			showScrollbar();
			document.querySelectorAll('[data-modal]').forEach(button => button.disabled = false);
		}, 400);

		if (removeHashFlag) {
			history.pushState('', document.title, window.location.pathname + window.location.search)
		}

		clearInputs();

		setTimeout(() => {
			document.querySelectorAll('.scrollbar-auto').forEach(item => {
				// item.classList.remove('scrollbar-auto')
			});
		}, 500);
	}

	// Закрытие модалки при клике на крестик
	document.querySelectorAll('[data-popup-close]').forEach(element => {
		element.addEventListener('click', closeModal);
	});

	// Закрытие модалки при клике вне области контента
	let popupDialog = document.querySelectorAll('.popup__dialog');

	window.addEventListener('click', function (e) {
		popupDialog.forEach(popup => {
			if (e.target === popup) {
				closeModal();
			}
		});
	});

	// Закрытие модалки при клике ESC
	window.onkeydown = function (event) {
		if (event.key === 'Escape' && document.querySelectorAll('.lg-show').length === 0) {
			closeModal();
		}
	};

	// Навигация назад/вперёд
	let isAnimating = false;

	window.addEventListener('popstate', async () => {
		if (isAnimating) {
			await new Promise(resolve => {
				const checkAnimation = () => {
					if (!document.body.classList.contains('_fade')) {
						resolve();
					} else {
						setTimeout(checkAnimation, 50);
					}
				};
				checkAnimation();
			});
		}

		const hash = window.location.hash.replace('#', '');
		if (hash) {
			const popup = document.querySelector(`.popup[id="${hash}"]`);
			if (popup) {
				hideScrollbar();
				isAnimating = true;
				await fadeIn(popup, true);
				isAnimating = false;
			}
		} else {
			isAnimating = true;
			await closeModal(false);
			isAnimating = false;
		}
	});
}
