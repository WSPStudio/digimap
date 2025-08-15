(function () {
	'use strict';

	// 
	// 
	// 
	// 
	// Переменные
	const body = document.querySelector('body');
	const html = document.querySelector('html');
	const popup$1 = document.querySelectorAll('.popup');

	const headerTop = document.querySelector('.header-top') ? document.querySelector('.header-top') : document.querySelector('head');
	const headerTopFixed = 'header-top_fixed';
	let fixedElements = document.querySelectorAll('[data-fixed]');
	let stickyObservers = new Map();

	const menuClass = '.header__mobile';
	const menu = document.querySelector(menuClass) ? document.querySelector(menuClass) : document.querySelector('head');
	const menuLink = document.querySelector('.menu-link') ? document.querySelector('.menu-link') : document.querySelector('head');
	const menuActive = 'active';

	const burgerMedia = 1199;
	const bodyOpenModalClass = 'popup-show';

	let windowWidth = window.innerWidth;
	document.querySelector('.container')?.offsetWidth || 0;

	const checkWindowWidth = () => {
		windowWidth = window.innerWidth;
		document.querySelector('.container')?.offsetWidth || 0;
	};

	//
	//  
	//
	//
	// Проверки

	// Проверка на мобильное устройство
	function isMobile() {
		return /Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(navigator.userAgent)
	}

	// Проверка на десктоп разрешение 
	function isDesktop() {
		return windowWidth > burgerMedia
	}

	// Проверка поддержки webp 
	function checkWebp() {
		const webP = new Image();
		webP.onload = webP.onerror = function () {
			if (webP.height !== 2) {
				document.querySelectorAll('[style]').forEach(item => {
					const styleAttr = item.getAttribute('style');
					if (styleAttr.indexOf('background-image') === 0) {
						item.setAttribute('style', styleAttr.replace('.webp', '.jpg'));
					}
				});
			}
		};
		webP.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
	}

	// Проверка на браузер safari
	const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

	// Проверка есть ли скролл 
	function haveScroll() {
		return document.documentElement.scrollHeight !== document.documentElement.clientHeight
	}

	// Видимость элемента
	function isHidden(el) {
		return window.getComputedStyle(el).display === 'none'
	}

	// Закрытие бургера на десктопе
	function checkBurgerAndMenu() {
		if (isDesktop()) {
			menuLink.classList.remove('active');
			if (menu) {
				menu.classList.remove(menuActive);
				if (!body.classList.contains(bodyOpenModalClass)) {
					body.classList.remove('no-scroll');
				}
			}
		}

		if (html.classList.contains('lg-on')) {
			if (isMobile()) {
				body.style.paddingRight = '0';
			} else {
				body.style.paddingRight = getScrollBarWidth() + 'px';
			}
		}
	}

	// Получение объектов с медиа-запросами
	function dataMediaQueries(array, dataSetValue) {
		let media = Array.from(array).filter(function (item) {
			if (item.dataset[dataSetValue]) {
				return item.dataset[dataSetValue].split(",")[0]
			}
		});

		if (media.length) {
			let breakpointsArray = [];
			media.forEach(item => {
				let params = item.dataset[dataSetValue];
				let breakpoint = {};
				let paramsArray = params.split(",");
				breakpoint.value = paramsArray[0];
				breakpoint.type = paramsArray[1] ? paramsArray[1].trim() : "max";
				breakpoint.item = item;
				breakpointsArray.push(breakpoint);
			});

			let mdQueries = breakpointsArray.map(function (item) {
				return '(' + item.type + "-width: " + item.value + "px)," + item.value + ',' + item.type
			});

			mdQueries = uniqArray(mdQueries);

			if (mdQueries.length) {
				mdQueries.forEach(breakpoint => {
					let paramsArray = breakpoint.split(",");
					let mediaBreakpoint = paramsArray[1];
					let mediaType = paramsArray[2];
					window.matchMedia(paramsArray[0]);

					breakpointsArray.filter(function (item) {
						return item.value === mediaBreakpoint && item.type === mediaType
					});
				});



				return

			}
		}
	}

	// Задержка при вызове функции. Выполняется в конце
	function debounce(fn, delay) {
		let timer;
		return () => {
			clearTimeout(timer);
			timer = setTimeout(() => fn.apply(this, arguments), delay);
		};
	}

	// Задержка при вызове функции. Выполняется раз в delay мс
	function throttle(fn, delay) {
		let lastCall = 0;
		return function (...args) {
			const now = Date.now();
			if (now - lastCall >= delay) {
				lastCall = now;
				fn.apply(this, args);
			}
		};
	}

	// Закрытие элемента при клике вне него
	function closeOutClick(closedElement, clickedButton, clickedButtonActiveClass, callback) {
		document.addEventListener('click', (e) => {
			const button = document.querySelector(clickedButton);
			const element = document.querySelector(closedElement);
			const withinBoundaries = e.composedPath().includes(element);

			if (!withinBoundaries && button?.classList.contains(clickedButtonActiveClass) && e.target !== button && !e.target.closest('.popup')) {
				element.classList.remove('active');
				button.classList.remove(clickedButtonActiveClass);
			}
		});
	}

	window.addEventListener('resize', debounce(checkWindowWidth, 100));


	//
	//
	//
	//
	// Позиционирование

	// Отступ элемента от краев страницы
	function offset(el) {
		var rect = el.getBoundingClientRect(),
			scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
			scrollTop = window.pageYOffset || document.documentElement.scrollTop;

		return {
			top: rect.top + scrollTop,
			left: rect.left + scrollLeft,
			right: windowWidth - rect.width - (rect.left + scrollLeft),
		}
	}


	// Добавление элементу обертки
	let wrap = (query, tag, wrapContent = false) => {
		let elements;

		let tagName = tag.split('.')[0] || 'div';
		let tagClass = tag.split('.').slice(1);
		tagClass = tagClass.length > 0 ? tagClass : [];

		if (typeof query === 'object') {
			elements = query;
		} else {
			elements = document.querySelectorAll(query);
		}

		function createWrapElement(item) {
			let newElement = document.createElement(tagName);
			if (tagClass.length) {
				newElement.classList.add(...tagClass);
			}

			if (wrapContent) {
				while (item.firstChild) {
					newElement.appendChild(item.firstChild);
				}
				item.appendChild(newElement);
			} else {
				item.parentElement.insertBefore(newElement, item);
				newElement.appendChild(item);
			}
		}

		if (elements.length) {
			for (let i = 0; i < elements.length; i++) {
				createWrapElement(elements[i]);
			}
		} else {
			if (elements.parentElement) {
				createWrapElement(elements);
			}
		}
	};

	wrap('table', '.table');
	wrap('video', '.video');

	// Изменение ссылок в меню 
	if (!document.querySelector('body').classList.contains('home') && document.querySelector('body').classList.contains('wp')) {
		let menu = document.querySelectorAll('.menu li a');

		for (let i = 0; i < menu.length; i++) {
			if (menu[i].getAttribute('href').indexOf('#') > -1) {
				menu[i].setAttribute('href', '/' + menu[i].getAttribute('href'));
			}
		}
	}

	// Добавление класса loaded после полной загрузки страницы
	function loaded() {
		document.addEventListener('DOMContentLoaded', function () {
			html.classList.add('loaded');
			if (document.querySelector('header')) {
				document.querySelector('header').classList.add('loaded');
			}
			if (haveScroll()) {
				setTimeout(() => {
					html.classList.remove('scrollbar-auto');
				}, 500);
			}
		});
	}

	// Для локалки
	if (window.location.hostname == 'localhost' || window.location.hostname.includes('192.168')) {
		document.querySelectorAll('.logo, .crumbs>li:first-child>a').forEach(logo => {
			logo.setAttribute('href', '/');
		});

		document.querySelectorAll('.menu a').forEach(item => {
			let firstSlash = 0;
			let lastSlash = 0;

			if (item.href.split('/').length - 1 == 4) {
				for (let i = 0; i < item.href.length; i++) {
					if (item.href[i] == '/') {
						if (i > 6 && firstSlash == 0) {
							firstSlash = i;
							continue
						}

						if (i > 6 && lastSlash == 0) {
							lastSlash = i;
						}
					}
				}

				let newLink = '';
				let removeProjectName = '';

				for (let i = 0; i < item.href.length; i++) {
					if (i > firstSlash && i < lastSlash + 1) {
						removeProjectName += item.href[i];
					}
				}

				newLink = item.href.replace(removeProjectName, '');
				item.href = newLink;
			}
		});
	}

	// Расчет высоты шапки
	function setHeaderFixedHeight() {
		if (!headerTop) return;

		requestAnimationFrame(() => {
			const height = headerTop.offsetHeight;
			document.documentElement.style.setProperty('--headerFixedHeight', height + 'px');
		});
	}

	document.addEventListener('DOMContentLoaded', setHeaderFixedHeight);
	if (window.ResizeObserver) {
		const ro = new ResizeObserver(() => {
			setHeaderFixedHeight();
		});
		ro.observe(headerTop);
	}

	// Замена текста при выборе файла 
	function formFiles() {
		document.querySelectorAll('.input-file').forEach(wrapper => {
			const input = wrapper.querySelector('input');
			const textEl = wrapper.querySelector('.input-file-text');
			const defaultText = textEl.textContent;
			const form = wrapper.closest('form');
			let dragCounter = 0;

			const allowedExt = (input.getAttribute('accept') || '')
				.split(',')
				.map(e => e.trim().replace(/^\./, '').toLowerCase())
				.filter(e => e);

			const isAllowed = file =>
				allowedExt.includes(file.name.split('.').pop().toLowerCase());

			const filterFiles = files =>
				Array.from(files).filter(f => isAllowed(f));

			const updateFileText = () => {
				if (!input.files.length) {
					textEl.textContent = defaultText;
					return
				}
				const names = Array.from(input.files).map(f => f.name).join(', ');
				textEl.textContent = names;
			};

			input.addEventListener('change', () => {
				const filtered = filterFiles(input.files);
				if (filtered.length !== input.files.length) {
					form?.classList.add('form-dragover-error');
					const dataTransfer = new DataTransfer();
					filtered.forEach(f => dataTransfer.items.add(f));
					input.files = dataTransfer.files;
				}
				updateFileText();
			});

			form?.addEventListener('reset', () => {
				textEl.textContent = defaultText;
			});

			const hasDisallowedDragItems = dt => {
				if (!dt?.items?.length) return false

				const allowedExt = (input.getAttribute('accept') || '')
					.split(',')
					.map(e => e.trim().replace(/^\./, '').toLowerCase())
					.filter(Boolean);

				const mimeMap = {
					'plain': 'txt'
				};

				return Array.from(dt.items).some(item => {
					if (item.kind !== 'file') return false

					const file = item.getAsFile?.();
					if (file) {
						const ext = file.name.split('.').pop().toLowerCase();
						return !allowedExt.includes(ext)
					}

					if (item.type) {
						let mimeExt = item.type.split('/').pop().toLowerCase();
						if (mimeMap[mimeExt]) {
							mimeExt = mimeMap[mimeExt];
						}
						return !allowedExt.includes(mimeExt)
					}

					return false
				})
			};

			form?.addEventListener('dragenter', e => {
				e.preventDefault();
				dragCounter++;
				form.classList.add('form-dragover');
				if (hasDisallowedDragItems(e.dataTransfer)) {
					form.classList.add('form-dragover-error');
				} else {
					form.classList.remove('form-dragover-error');
				}
			});

			form?.addEventListener('dragleave', e => {
				e.preventDefault();
				dragCounter--;
				if (dragCounter === 0) {
					form.classList.remove('form-dragover', 'form-dragover-error');
				}
			});

			form?.addEventListener('dragover', e => {
				e.preventDefault();
				if (hasDisallowedDragItems(e.dataTransfer)) {
					form.classList.add('form-dragover-error');
				} else {
					form.classList.remove('form-dragover-error');
				}
			});

			form?.addEventListener('drop', e => {
				e.preventDefault();
				dragCounter = 0;
				form.classList.remove('form-dragover', 'form-dragover-error');

				if (e.dataTransfer.files.length) {
					const filtered = filterFiles(e.dataTransfer.files);
					const dataTransfer = new DataTransfer();
					filtered.forEach(f => dataTransfer.items.add(f));
					input.files = dataTransfer.files;
					updateFileText();
				}
			});
		});
	}

	// Проверка на браузер safari
	if (isSafari) document.documentElement.classList.add('safari');

	// Проверка поддержки webp 
	checkWebp();

	// Закрытие бургера на десктопе
	window.addEventListener('resize', debounce(checkBurgerAndMenu, 100));
	checkBurgerAndMenu();

	// Добавление класса loaded при загрузке страницы
	loaded();

	// Обработка input file 
	formFiles();

	// 
	// 
	// 
	// 
	// Функции для работы со скроллом и скроллбаром

	// Скрытие скроллбара
	function hideScrollbar() {
		// changeScrollbarGutter()

		popup$1.forEach(element => {
			element.style.display = 'none';
		});

		if (haveScroll()) {
			body.classList.add('no-scroll');
		}

		changeScrollbarPadding();
	}

	function showScrollbar() {
		if (!menu.classList.contains(menuActive)) {
			body.classList.remove('no-scroll');
		}

		changeScrollbarPadding(false);

		// if (haveScroll()) {
		// 	body.classList.add('scrollbar-auto')
		// 	html.classList.add('scrollbar-auto')
		// }
	}

	// Ширина скроллбара
	function getScrollBarWidth$1() {
		let div = document.createElement('div');
		div.style.overflowY = 'scroll';
		div.style.width = '50px';
		div.style.height = '50px';
		document.body.append(div);
		let scrollWidth = div.offsetWidth - div.clientWidth;
		div.remove();

		if (haveScroll()) {
			return scrollWidth
		} else {
			return 0
		}
	}

	// Добавление и удаление отступа у body и фиксированных элементов
	function changeScrollbarPadding(add = true) {
		const scrollbarPadding = getScrollBarWidth$1() + 'px';

		fixedElements.forEach(elem => {
			const position = window.getComputedStyle(elem).position;

			if (position === 'sticky') {
				if (add) {
					if (!stickyObservers.has(elem)) {
						const observer = new IntersectionObserver(([entry]) => {
							if (!entry.isIntersecting) {
								elem.style.paddingRight = scrollbarPadding;
							} else {
								elem.style.paddingRight = '0';
							}
						}, {
							threshold: [1]
						});
						observer.observe(elem);
						stickyObservers.set(elem, observer);
					}
				} else {
					elem.style.paddingRight = '0';
					const observer = stickyObservers.get(elem);
					if (observer) {
						observer.unobserve(elem);
						stickyObservers.delete(elem);
					}
				}
			} else {
				elem.style.paddingRight = add ? scrollbarPadding : '0';
			}
		});

		if (isSafari) {
			body.style.paddingRight = add ? scrollbarPadding : '0';
		}
	}

	/* 
		================================================
		  
		Галереи
		
		================================================
	*/

	function gallery() {
		let galleries = document.querySelectorAll('[data-gallery]');

		if (galleries.length) {
			galleries.forEach(gallery => {
				if (!gallery.classList.contains('gallery_init')) {
					let selector = false;

					if (gallery.querySelectorAll('[data-gallery-item]').length) {
						selector = '[data-gallery-item]';
					} else if (gallery.classList.contains('swiper-wrapper')) {
						selector = '.swiper-slide>a';
					} else if (gallery.tagName == 'A') {
						selector = false;
					} else {
						selector = 'a';
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

					gallery.classList.add('gallery_init');

					gallery.addEventListener('lgBeforeOpen', () => {
						if (body.classList.contains(bodyOpenModalClass)) ;
						hideScrollbar();
					});

					gallery.addEventListener('lgBeforeClose', () => {
						showScrollbar();
					});
				}
			});
		}
	}

	/* 
		================================================
		  
		Карты
		
		================================================
	*/


	function map() {
		let spinner = document.querySelectorAll('.loader');
		let check_if_load = false;

		function loadScript(url, callback) {
			let script = document.createElement("script");
			if (script.readyState) {
				script.onreadystatechange = function () {
					if (script.readyState == "loaded" || script.readyState == "complete") {
						script.onreadystatechange = null;
						callback();
					}
				};
			} else {
				script.onload = function () {
					callback();
				};
			}

			script.src = url;
			document.getElementsByTagName("head")[0].appendChild(script);
		}

		function initMap() {
			loadScript("https://api-maps.yandex.ru/2.1/?apikey=5b7736c7-611f-40ce-a5a8-b7fd86e6737c&lang=ru_RU&amp;loadByRequire=1", function () {
				ymaps.load(init);
			});
			check_if_load = true;
		}

		if (document.querySelectorAll('.map').length) {
			let observer = new IntersectionObserver(function (entries) {
				if (entries[0]['isIntersecting'] === true) {
					if (!check_if_load) {
						spinner.forEach(element => {
							element.classList.add('is-active');
						});
						if (entries[0]['intersectionRatio'] > 0.1) {
							initMap();
						}
					}
				}
			}, {
				threshold: [0, 0.1, 0.2, 0.5, 1],
				rootMargin: '200px 0px'
			});

			observer.observe(document.querySelector('.map'));
		}
	}

	function waitForTilesLoad(layer) {
		return new ymaps.vow.Promise(function (resolve, reject) {
			let tc = getTileContainer(layer), readyAll = true;
			tc.tiles.each(function (tile, number) {
				if (!tile.isReady()) {
					readyAll = false;
				}
			});
			if (readyAll) {
				resolve();
			} else {
				tc.events.once("ready", function () {
					resolve();
				});
			}
		});
	}

	function getTileContainer(layer) {
		for (let k in layer) {
			if (layer.hasOwnProperty(k)) {
				if (layer[k] instanceof ymaps.layer.tileContainer.CanvasContainer || layer[k] instanceof ymaps.layer.tileContainer.DomContainer) {
					return layer[k];
				}
			}
		}
		return null;
	}

	window.waitForTilesLoad = waitForTilesLoad;
	window.getTileContainer = getTileContainer;

	// 
	// 
	// 
	// 
	// Анимации 

	// Плавное появление
	const fadeIn = (el, isItem = false, display, timeout = 400) => {
		document.body.classList.add('_fade');

		let elements = isItem ? el : document.querySelectorAll(el);

		if (elements.length > 0) {
			elements.forEach(element => {
				element.style.opacity = 0;
				element.style.display = 'block';
				element.style.transition = `opacity ${timeout}ms`;
				setTimeout(() => {
					element.style.opacity = 1;
					setTimeout(() => {
						document.body.classList.remove('_fade');
					}, timeout);
				}, 10);
			});
		} else {
			el.style.opacity = 0;
			el.style.display = 'block';
			el.style.transition = `opacity ${timeout}ms`;
			setTimeout(() => {
				el.style.opacity = 1;
				setTimeout(() => {
					document.body.classList.remove('_fade');
				}, timeout);
			}, 10);
		}
	};

	// Плавное исчезание
	const fadeOut = (el, isItem = false, timeout = 400) => {
		document.body.classList.add('_fade');

		let elements = isItem ? el : document.querySelectorAll(el);

		if (elements.length > 0) {
			elements.forEach(element => {
				element.style.opacity = 1;
				element.style.transition = `opacity ${timeout}ms`;
				element.style.opacity = 0;
				setTimeout(() => {
					element.style.display = 'none';
					setTimeout(() => {
						document.body.classList.remove('_fade');
					}, timeout);
				}, timeout);
				setTimeout(() => {
					element.removeAttribute('style');
				}, timeout + 400);
			});
		} else {
			el.style.opacity = 1;
			el.style.transition = `opacity ${timeout}ms`;
			el.style.opacity = 0;
			setTimeout(() => {
				el.style.display = 'none';
				setTimeout(() => {
					document.body.classList.remove('_fade');
				}, timeout);
			}, timeout);
			setTimeout(() => {
				el.removeAttribute('style');
			}, timeout + 400);
		}
	};

	// Плавно скрыть с анимацией слайда 
	const _slideUp = (target, duration = 400, showmore = 0) => {
		if (target && !target.classList.contains('_slide')) {
			target.classList.add('_slide');
			target.style.transitionProperty = 'height, margin, padding';
			target.style.transitionDuration = duration + 'ms';
			target.style.height = `${target.offsetHeight}px`;
			target.offsetHeight;
			target.style.overflow = 'hidden';
			target.style.height = showmore ? `${showmore}px` : `0px`;
			target.style.paddingBlock = 0;
			target.style.marginBlock = 0;
			window.setTimeout(() => {
				target.style.display = !showmore ? 'none' : 'block';
				!showmore ? target.style.removeProperty('height') : null;
				target.style.removeProperty('padding-top');
				target.style.removeProperty('padding-bottom');
				target.style.removeProperty('margin-top');
				target.style.removeProperty('margin-bottom');
				!showmore ? target.style.removeProperty('overflow') : null;
				target.style.removeProperty('transition-duration');
				target.style.removeProperty('transition-property');
				target.classList.remove('_slide');
				document.dispatchEvent(new CustomEvent("slideUpDone", {
					detail: {
						target: target
					}
				}));
			}, duration);
		}
	};

	// Плавно показать с анимацией слайда 
	const _slideDown = (target, duration = 400) => {
		if (target && !target.classList.contains('_slide')) {
			target.style.removeProperty('display');
			let display = window.getComputedStyle(target).display;
			if (display === 'none') display = 'block';
			target.style.display = display;
			let height = target.offsetHeight;
			target.style.overflow = 'hidden';
			target.style.height = 0;
			target.style.paddingBLock = 0;
			target.style.marginBlock = 0;
			target.offsetHeight;
			target.style.transitionProperty = "height, margin, padding";
			target.style.transitionDuration = duration + 'ms';
			target.style.height = height + 'px';
			target.style.removeProperty('padding-top');
			target.style.removeProperty('padding-bottom');
			target.style.removeProperty('margin-top');
			target.style.removeProperty('margin-bottom');
			window.setTimeout(() => {
				target.style.removeProperty('height');
				target.style.removeProperty('overflow');
				target.style.removeProperty('transition-duration');
				target.style.removeProperty('transition-property');
			}, duration);
		}
	};

	// Плавно изменить состояние между _slideUp и _slideDown
	const _slideToggle = (target, duration = 400) => {
		if (target && isHidden(target)) {
			return _slideDown(target, duration);

		} else {
			return _slideUp(target, duration);
		}
	};

	//
	//
	//
	//
	// Работа с url

	// Получение хэша
	function getHash() {
		return location.hash ? location.hash.replace('#', '') : '';
	}

	// Очистка input и textarea при закрытии модалки и отправки формы / Удаление классов ошибки
	let inputs = document.querySelectorAll('input, textarea');

	function clearInputs() {
		inputs.forEach(element => {
			element.classList.remove('wpcf7-not-valid', 'error');
		});
	}

	inputs.forEach(input => {
		const parentElement = input.parentElement;
		const submitButton = input.closest('form')?.querySelector('.submit');

		const updateActiveState = () => {
			if (input.type === 'text' || input.type === 'date') {
				parentElement.classList.toggle('active', input.value.length > 0);
			}
		};

		const resetValidation = () => {
			input.setCustomValidity('');
			submitButton.disabled = false;
		};

		input.addEventListener('keyup', updateActiveState);
		input.addEventListener('change', () => {
			input.classList.remove('wpcf7-not-valid');
			updateActiveState();
		});

		input.addEventListener('input', () => {
			// Форматирование чисел
			if (input.getAttribute('data-number')) {
				input.value = input.value.replace(/\D/g, '').replace(/(\d)(?=(\d{3})+$)/g, '$1 ');
			}

			// Валидация email
			if (input.type === 'email') {
				input.value = input.value.replace(/[^0-9a-zA-Z@.-]+/g, '');
			}

			// Валидация имени
			const nameAttr = input.name?.toLowerCase() || '';
			const placeholder = input.placeholder?.toLowerCase() || '';
			const fioKeywords = ['имя', 'фамилия', 'отчество'];
			const isFIO = nameAttr.includes('name') || fioKeywords.some(word => placeholder.includes(word));

			if (isFIO) {
				input.value = input.value.replace(/[^а-яА-ЯёЁa-zA-Z ]/g, '');
				return;
			}
		});

		if (input.type === 'tel' || input.type === 'email') {
			input.addEventListener('input', resetValidation);
		}
	});

	// Проверка формы перед отправкой
	function initFormValidation(form) {
		// Функция для проверки обязательных полей на выбор
		const checkRequiredChoice = () => {
			let requiredChoice = form.querySelectorAll('[data-required-choice]');
			let hasValue = Array.from(requiredChoice).some(input => input.value.trim() !== '' && input.value !== '+7 ');

			requiredChoice.forEach(input => {
				if (!hasValue) {
					input.setAttribute('required', 'true');
				} else {
					input.removeAttribute('required');
				}
			});
		};

		// Проверка при загрузке страницы
		checkRequiredChoice();

		form.addEventListener('submit', (e) => {
			let isValid = true;

			form.querySelectorAll('input[type="tel"]').forEach(input => {
				const val = input.value.trim();

				const requiredLength = val.startsWith('+7') ? 17 : val.startsWith('8') ? 16 : Infinity;

				if (val.length < requiredLength && val.length > 3) {
					input.setCustomValidity('Телефон должен содержать 11 цифр');
					input.reportValidity();
					isValid = false;
				} else {
					input.setCustomValidity('');
				}
			});

			checkRequiredChoice();

			if (!isValid || !form.checkValidity()) e.preventDefault();
		});

		// Обновление `required` при вводе
		let requiredChoice = form.querySelectorAll('[data-required-choice]');

		requiredChoice.forEach(input => {
			input.addEventListener('input', checkRequiredChoice);
		});
	}

	document.querySelectorAll('form').forEach(initFormValidation);

	/* 
		================================================
		  
		Попапы
		
		================================================
	*/

	function popup() {
		document.querySelectorAll('[data-modal]').forEach(button => {
			button.addEventListener('click', function () {
				let [dataModal, dataTab] = button.getAttribute('data-modal').split('#');

				let popup = document.querySelector(`#${dataModal}`);
				if (!popup) return

				// Удалить хеш текущего попапа
				if (getHash()) {
					history.pushState("", document.title, (window.location.pathname + window.location.search).replace(getHash(), ''));
				}

				hideScrollbar();

				body.classList.add(bodyOpenModalClass);

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
				history.pushState('', document.title, window.location.pathname + window.location.search);
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

	/* 
		================================================
		  
		Спойлеры
		
		================================================
	*/

	function spoller() {
		const spollersArray = document.querySelectorAll('[data-spollers]');
		if (!spollersArray.length) return;

		document.addEventListener('click', setSpollerAction);

		// Спойлеры без медиаусловий
		const spollersRegular = [...spollersArray].filter(item => !item.dataset.spollers.split(',')[0]);
		if (spollersRegular.length) initSpollers(spollersRegular);

		// Спойлеры с медиаусловиями
		const mdQueriesArray = dataMediaQueries(spollersArray, 'spollers');
		mdQueriesArray?.forEach(mdItem => {
			mdItem.matchMedia.addEventListener('change', () => initSpollers(mdItem.itemsArray, mdItem.matchMedia));
			initSpollers(mdItem.itemsArray, mdItem.matchMedia);
		});

		// Инициализация спойлеров
		function initSpollers(array, matchMedia = false) {
			array.forEach(spollersBlock => {
				const block = matchMedia ? spollersBlock.item : spollersBlock;
				const isInit = matchMedia ? matchMedia.matches : true;

				block.classList.toggle('_spoller-init', isInit);
				initSpollerBody(block, isInit);
			});
		}

		// Подготовка тела спойлера
		function initSpollerBody(block, hideBody = true) {
			block.querySelectorAll('[data-spoller]').forEach(item => {
				const title = item.querySelector('[data-spoller-title]');
				const content = item.querySelector('[data-spoller-content]');
				if (!content) return;

				if (hideBody) {
					if (!item.hasAttribute('data-open')) {
						content.style.display = 'none';
						title.classList.remove('active');
					} else {
						title.classList.add('active');
					}
				} else {
					content.style.display = '';
					title.classList.remove('active');
				}
			});
		}

		// Клик по спойлеру
		function setSpollerAction(e) {
			const titleEl = e.target.closest('[data-spoller-title]');
			const blockEl = e.target.closest('[data-spollers]');

			// Клик по заголовку спойлера
			if (titleEl && blockEl) {
				if (blockEl.classList.contains('_disabled-click')) return;

				const itemEl = titleEl.closest('[data-spoller]');
				const contentEl = itemEl.querySelector('[data-spoller-content]');
				const speed = parseInt(blockEl.dataset.spollersSpeed) || 400;

				blockEl.classList.add('_disabled-click');
				setTimeout(() => blockEl.classList.remove('_disabled-click'), speed);

				if (blockEl.classList.contains('_spoller-init') && contentEl && !blockEl.querySelectorAll('._slide').length) {
					if (blockEl.hasAttribute('data-one-spoller') && !titleEl.classList.contains('active')) {
						hideSpollersBody(blockEl);
					}

					titleEl.classList.toggle('active');
					_slideToggle(contentEl, speed);

					// Прокрутка к спойлеру
					if (itemEl.hasAttribute('data-spoller-scroll') && titleEl.classList.contains('active')) {
						const scrollOffset = parseInt(itemEl.dataset.spollerScroll) || 0;
						const headerOffset = itemEl.hasAttribute('data-spoller-scroll-noheader')
							? document.querySelector('.header')?.offsetHeight || 0
							: 0;
						window.scrollTo({
							top: itemEl.offsetTop - (scrollOffset + headerOffset),
							behavior: 'smooth'
						});
					}
				}
			}

			// Клик вне спойлеров — закрытие по [data-spoller-close]
			if (!blockEl) {
				document.querySelectorAll('[data-spoller-close]').forEach(title => {
					const item = title.closest('[data-spoller]');
					const block = title.closest('[data-spollers]');
					const content = item.querySelector('[data-spoller-content]');
					const speed = parseInt(block.dataset.spollersSpeed) || 400;

					if (block.classList.contains('_spoller-init')) {
						title.classList.remove('active');
						_slideUp(content, speed);
					}
				});
			}
		}

		// Скрыть все активные спойлеры
		function hideSpollersBody(block) {
			const activeTitle = block.querySelector('[data-spoller] .active');
			if (!activeTitle || block.querySelectorAll('._slide').length) return;

			const content = activeTitle.closest('[data-spoller]')?.querySelector('[data-spoller-content]');
			const speed = parseInt(block.dataset.spollersSpeed) || 400;

			activeTitle.classList.remove('active');
			_slideUp(content, speed);
		}
	}

	/* 
		================================================
		  
		Многоуровневое меню
		
		================================================
	*/

	function subMenu() {
		subMenuInit();

		let mediaSwitcher = false;

		function subMenuResize() {


			if (isDesktop()) {

				subMenuInit(true);

				if (!mediaSwitcher) {

					document.querySelectorAll('.menu-item-has-children').forEach(item => {
						item.classList.remove('active', 'left', 'right', 'top', 'menu-item-has-children_not-relative');

						const submenu = item.querySelector('.sub-menu-wrapper');
						if (submenu) {
							submenu.removeAttribute('style');
							submenu.classList.remove('active');
						}

						const arrow = item.querySelector('.menu-item-arrow');
						if (arrow) {
							arrow.classList.remove('active');
						}

					});

					subMenuInit(true);

					mediaSwitcher = true;
				}

			} else {
				let menuItemHasChildren = document.querySelectorAll('.menu-item-has-children');

				menuItemHasChildren.forEach(item => {
					item.querySelector('.sub-menu-wrapper').style.display = 'block';
					toggleSubMenuVisible(item);
				});

				mediaSwitcher = false;
			}
		}

		window.addEventListener('resize', debounce(subMenuResize, 100));

		// инициализация подменю	
		function subMenuInit(isResize = false) {

			let menuItemHasChildren = document.querySelectorAll('.menu-item-has-children');

			menuItemHasChildren.forEach(item => {
				let timeoutId = null;

				item.onmouseover = null;
				item.onmouseout = null;
				item.onfocusin = null;
				item.onfocusout = null;

				item.addEventListener('mouseover', function (e) {
					if (!isDesktop()) return;
					clearTimeout(timeoutId);
					menuMouseOverInit(item, e, isResize);
				});

				item.addEventListener('focusin', function (e) {
					if (!isDesktop()) return;
					clearTimeout(timeoutId);
					menuMouseOverInit(item, e, isResize);
				});

				item.addEventListener('mouseout', function (e) {
					if (!isDesktop()) return;
					timeoutId = setTimeout(() => {
						if (!item.contains(e.relatedTarget)) ;
					}, 300);
				});

				item.addEventListener('focusout', function (e) {
					if (!isDesktop()) return;
					timeoutId = setTimeout(() => {
						if (!item.contains(document.activeElement)) {
							item.classList.remove('active');
						}
					}, 500);
				});

				toggleSubMenuVisible(item, !isDesktop());
			});
		}

		function menuMouseOverInit(item, e, isResize) {
			// закрыть все открытые меню, кроме текущего
			document.querySelectorAll('.menu>.menu-item-has-children').forEach(li => {
				if (li != item) {
					li.classList.remove('active');
				}
			});

			if (isDesktop()) {
				if (!isResize) {
					item.classList.add('active');
				}

				// если это самый верхний уровень, то определить сторону и добавить соответствующий класс 
				if (item.closest('.menu')) {
					if (getPageSideMenu(e) == 'left') {
						item.classList.add('left');
					} else {
						item.classList.add('right');
					}
				}

				if (item == getTargetElementTag(e)) {
					// если нет места, чтобы добавить подменю скраю, то добавить снизу
					if ((getPageSideMenu(e) == 'left' && offset(item).right < item.offsetWidth) || (getPageSideMenu(e) == 'right' && offset(item).left < item.offsetWidth)) {
						item.classList.add('top', 'menu-item-has-children_not-relative');
					}

				}
			}
		}

		let menuItemArrow = document.querySelectorAll('.menu-item-arrow');
		let isClicked = false;

		menuItemArrow.forEach(item => {
			item.addEventListener('click', function (e) {
				e.preventDefault();
				if (!isDesktop()) {
					if (!isClicked) {
						isClicked = true;
						if (!item.classList.contains('active')) {
							item.classList.add('active');
							item.parentElement.nextElementSibling.classList.add('active');
							_slideDown(item.parentElement.nextElementSibling, 200);
						} else {
							item.classList.remove('active');
							item.parentElement.nextElementSibling.classList.remove('remove');
							_slideUp(item.parentElement.nextElementSibling, 200);
						}

						setTimeout(() => {
							isClicked = false;
						}, 300);
					}
				}
			});
		});

		document.querySelectorAll('.menu-item-has-children > a').forEach(link => {
			link.addEventListener('click', function (e) {
				let textNode = link.childNodes[0];
				let textRange = document.createRange();
				textRange.selectNodeContents(textNode);
				let textRect = textRange.getBoundingClientRect();

				if (e.clientX >= textRect.left && e.clientX <= textRect.right && e.clientY >= textRect.top && e.clientY <= textRect.bottom) {
					return;
				}

				e.preventDefault();
				let arrow = link.querySelector('.menu-item-arrow');
				if (arrow) arrow.click();
			});
		});

		function toggleSubMenuVisible(item, state = true) {
			let subMenu = item.querySelectorAll('.sub-menu-wrapper');
			subMenu.forEach(element => {
				element.style.display = state ? 'none' : 'block';
			});
		}

		function getTargetElementTag(e) {
			return e.target.parentElement.tagName == "LI" ? e.target.parentElement : e.target
		}

		function getPageSideMenu(e) {
			return e.target.closest('.menu') ? offset(e.target.closest('.menu>.menu-item-has-children')).left > (windowWidth / 2) ? 'right' : 'left' : 'left'
		}
	}

	/* 
		================================================
		  
		Анимация чисел
		
		================================================
	*/

	function numbers() {
		function digitsCountersInit(digitsCountersItems) {
			let digitsCounters = digitsCountersItems ? digitsCountersItems : document.querySelectorAll('[data-digits-counter]');

			if (digitsCounters) {
				digitsCounters.forEach(digitsCounter => {
					// Если элемент уже был активирован, сбрасываем его
					if (digitsCounter.classList.contains('active')) {
						digitsCounter.innerHTML = '0';
					} else {
						digitsCounter.dataset.originalValue = digitsCounter.innerHTML.replace(' ', '').replace(',', '.');
					}

					digitsCounter.style.width = digitsCounter.offsetWidth + 'px';

					if (parseFloat(digitsCounter.innerHTML.replace(',', '.')) % 1 != 0) {
						digitsCounter.setAttribute('data-float', true);
					}

					digitsCountersAnimate(digitsCounter);
				});
			}
		}

		function digitsCountersAnimate(digitsCounter) {
			let startTimestamp = null;
			const duration = parseInt(digitsCounter.dataset.digitsCounter) || 1000;
			const startValue = parseFloat(digitsCounter.dataset.originalValue) || 0;
			const startPosition = 0;

			digitsCounter.classList.add('active');

			const step = (timestamp) => {
				if (!startTimestamp) startTimestamp = timestamp;
				const progress = Math.min((timestamp - startTimestamp) / duration, 1);

				if (digitsCounter.getAttribute('data-float')) {
					digitsCounter.innerHTML = (progress * (startPosition + startValue)).toFixed(1).replace('.', ',');
				} else {
					digitsCounter.innerHTML = Math.floor(progress * (startPosition + startValue));
					digitsCounter.innerHTML = digitsCounter.innerHTML.replace(/\D/g, '').replace(/(\d)(?=(\d{3})+$)/g, '$1 ');
				}

				if (progress < 1) {
					window.requestAnimationFrame(step);
				}
			};

			window.requestAnimationFrame(step);

			setTimeout(() => {
				digitsCounter.removeAttribute('style');
			}, duration + 500);
		}

		// digitsCountersInit() // Запуск при скролле 

		let options = {
			threshold: 0.6
		};

		let observer = new IntersectionObserver((entries, observer) => {
			entries.forEach(entry => {
				const targetElement = entry.target;
				const digitsCountersItems = targetElement.querySelectorAll('[data-digits-counter]');

				if (entry.isIntersecting) {
					if (digitsCountersItems.length) {
						digitsCountersInit(digitsCountersItems);
					}
				} else {
					digitsCountersItems.forEach(item => item.classList.remove('active'));
				}
			});
		}, options);

		let sections = document.querySelectorAll('[class*="section"]');

		if (sections.length) {
			sections.forEach(section => observer.observe(section));
		}
	}

	/* 
		================================================
		  
		Бургер
		
		================================================
	*/

	function burger() {
		if (menuLink) {
			let isAnimating = false;

			menuLink.addEventListener('click', function (e) {
				if (isAnimating) return
				isAnimating = true;

				menuLink.classList.toggle('active');
				menu.classList.toggle(menuActive);

				if (menu.classList.contains(menuActive)) {
					hideScrollbar();

					const scrollY = window.scrollY;
					const headerHeight = headerTop.offsetHeight;

					if (scrollY === 0) {
						menu.style.removeProperty('top');
					} else if (scrollY < headerHeight) {
						menu.style.top = scrollY + 'px';
					} else {
						const headerRect = headerTop.getBoundingClientRect();
						menu.style.top = headerRect.bottom + 'px';
					}
				} else {
					setTimeout(() => {
						showScrollbar();
					}, 400);
				}

				setTimeout(() => {
					isAnimating = false;
				}, 500);
			});



			function checkHeaderOffset() {
				if (isMobile()) {
					changeScrollbarPadding(false);
				} else {
					if (body.classList.contains(bodyOpenModalClass)) {
						changeScrollbarPadding();
					}
				}

				if (isDesktop()) {
					menu.removeAttribute('style');

					if (!body.classList.contains(bodyOpenModalClass)) {
						body.classList.remove('no-scroll');

						if (isSafari) {
							changeScrollbarPadding(false);
						}
					}
				}
			}

			window.addEventListener('resize', debounce(checkHeaderOffset, 50));
			window.addEventListener('resize', debounce(checkHeaderOffset, 150));

			if (document.querySelector('.header__mobile')) {
				closeOutClick('.header__mobile', '.menu-link', 'active');
			}
		}
	}

	/* 
		================================================
		  
		Показать еще
		
		================================================
	*/

	function showMore() {
		document.querySelectorAll('[data-more-wrapper]').forEach(wrapper => {
			const button = wrapper.querySelector('[data-more]');
			if (!button) return

			const [initialCount, stepCount, selector = '[data-more-item]'] = button.getAttribute('data-more').split(',');
			const items = Array.from(wrapper.querySelectorAll(selector));
			const moreOpenText = button.querySelector('[data-more-open]');
			const moreCloseText = button.querySelector('[data-more-close]');
			const [mediaBreakpointRaw, mediaBreakpointType = 'max'] = wrapper.dataset.media ? wrapper.dataset.media.split(',') : [];
			const mediaBreakpoint = mediaBreakpointRaw ? parseInt(mediaBreakpointRaw) : null;

			let visibleCount = parseInt(initialCount);
			let mediaQuery = null;

			const isLinesMode = stepCount === 'lines';
			let isToggleActive = false;
			let linesTarget = wrapper.querySelector('[data-lines]');
			let linesSpeed = 400;
			let hiddenElements = [];

			const applyTransition = element => {
				element.style.transition = 'max-height 0.3s ease';
				element.style.overflow = 'hidden';
			};

			function animateHeight(element, targetHeight, duration = linesSpeed) {
				const startHeight = element.offsetHeight; // текущая высота
				const heightDiff = targetHeight - startHeight;
				const startTime = performance.now();

				element.style.overflow = 'hidden';

				function step(currentTime) {
					const elapsed = currentTime - startTime;
					const progress = Math.min(elapsed / duration, 1); // от 0 до 1

					// Плавная анимация через ease-out
					const easeProgress = 1 - Math.pow(1 - progress, 3);

					element.style.height = startHeight + heightDiff * easeProgress + 'px';

					if (progress < 1) {
						requestAnimationFrame(step);
					} else {
						element.style.height = targetHeight + 'px'; // точно устанавливаем конечное значение
					}
				}

				requestAnimationFrame(step);
			}

			const toggleLinesMode = () => {
				if (!linesTarget) return;

				const isExpanded = linesTarget.classList.toggle('active');

				if (isExpanded) {
					hiddenElements.forEach(span => {
						span.classList.add('show');

						setTimeout(() => {
							span.classList.remove('hidd', 'show');

							const children = Array.from(span.childNodes);
							span.replaceWith(...children);
						}, linesSpeed);
					});

					hiddenElements = [];
				} else {
					animateHeight(linesTarget, linesTarget.getAttribute('data-default-height'), linesSpeed);
					setTimeout(() => {
						hiddenElements = limitLines(linesTarget, initialCount);
					}, linesSpeed);

					setTimeout(() => {
						linesTarget.removeAttribute('style');
					}, linesSpeed + 50);
				}

				if (moreOpenText) moreOpenText.style.display = isExpanded ? 'none' : '';
				if (moreCloseText) moreCloseText.style.display = isExpanded ? '' : 'none';

				if (isExpanded) {
					wrapper.classList.add('active');
					button.classList.add('active');
				} else {
					wrapper.classList.remove('active');
					button.classList.remove('active');
				}
			};

			const resetInitialState = () => {
				visibleCount = parseInt(initialCount);

				if (isLinesMode && linesTarget) {
					hiddenElements.forEach(span => {
						const children = Array.from(span.childNodes);
						span.replaceWith(...children);
					});

					hiddenElements = limitLines(linesTarget, initialCount);

					linesTarget.classList.remove('active');
					wrapper.classList.remove('active');
					button.classList.remove('active');
				} else {
					items.forEach((item, index) => {
						applyTransition(item);
						if (index >= visibleCount) item.style.maxHeight = '0px';
						else item.style.maxHeight = `${item.scrollHeight}px`;
					});

					button.style.display = visibleCount >= items.length ? 'none' : '';
				}

				if (moreOpenText) moreOpenText.style.display = '';
				if (moreCloseText) moreCloseText.style.display = 'none';
			};

			const showAllItems = () => {
				if (!isLinesMode) {
					items.forEach(item => item.style.maxHeight = `${item.scrollHeight}px`);
				}
				wrapper.classList.add('active');
				button.classList.add('active');
			};

			const buttonHandler = () => {
				if (isLinesMode) {
					toggleLinesMode();
					return
				}

				if (stepCount === 'all') {
					showAllItems();
					button.remove();
					return
				}

				if (stepCount === 'toggle') {
					if (!isToggleActive) {
						showAllItems();
						isToggleActive = true;
						if (moreOpenText) moreOpenText.style.display = 'none';
						if (moreCloseText) moreCloseText.style.display = '';
					} else {
						isToggleActive = false;

						items.forEach((item, index) => {
							if (index < visibleCount) {
								item.style.maxHeight = `${item.scrollHeight}px`;
							} else {
								item.style.maxHeight = '0px';
							}
						});

						if (moreOpenText) moreOpenText.style.display = '';
						if (moreCloseText) moreCloseText.style.display = 'none';
						wrapper.classList.remove('active');
						button.classList.remove('active');
					}
					return
				}

				const step = parseInt(stepCount);
				visibleCount += step;

				items.forEach((item, index) => {
					if (index < visibleCount) item.style.maxHeight = `${item.scrollHeight}px`;
				});

				if (visibleCount >= items.length) {
					button.style.display = 'none';
					wrapper.classList.add('active');
					button.classList.add('active');
				}
			};

			const handleMediaQuery = e => {
				if (!e.matches) {
					showAllItems();
				} else {
					resetInitialState();
					button.addEventListener('click', buttonHandler);
				}
			};

			const initialize = () => {
				resetInitialState();
				button.addEventListener('click', buttonHandler);

				if (isLinesMode && linesTarget) {
					hiddenElements.forEach(span => {
						const children = Array.from(span.childNodes);
						span.replaceWith(...children);
					});
					hiddenElements = [];

					const fullHeight = linesTarget.scrollHeight;

					hiddenElements = limitLines(linesTarget, initialCount);
					const limitedHeight = linesTarget.scrollHeight;

					if (fullHeight <= limitedHeight) {
						button.remove();
					}

					linesTarget.setAttribute('data-default-height', limitedHeight);
				}


			};

			if (mediaBreakpoint) {
				const queryType = mediaBreakpointType === 'min' ? 'min-width' : 'max-width';
				mediaQuery = window.matchMedia(`(${queryType}: ${mediaBreakpoint}px)`);
				mediaQuery.addEventListener('change', handleMediaQuery);
				handleMediaQuery(mediaQuery);
			} else {
				initialize();
			}

			window.addEventListener('resize', debounce(() => {
				document.querySelectorAll('[data-more].active').forEach(button => {
					button.click();
				});
			}, 100));
		});
	}

	function limitLines(element, maxLines) {
		let totalLines = 0;
		const hiddenSpans = [];

		function processTextNode(node, parent) {
			if (!node.textContent.trim()) return;

			const range = document.createRange();
			range.selectNodeContents(parent);
			const rects = range.getClientRects();

			if (rects.length === 0) return;

			if (totalLines >= maxLines) {
				const span = document.createElement('span');
				span.className = 'hidd';
				parent.insertBefore(span, node);
				span.appendChild(node);
				hiddenSpans.push(span);
				return;
			}

			if (totalLines + rects.length > maxLines) {
				const tempRange = document.createRange();
				tempRange.setStart(node, 0);

				let found = false;
				let charIndex = 0;
				let lastGoodIndex = 0;

				while (!found && charIndex < node.textContent.length) {
					tempRange.setEnd(node, charIndex + 1);
					const tempRects = tempRange.getClientRects();

					if (tempRects.length > 0) {
						if (tempRects[tempRects.length - 1].bottom > rects[maxLines - totalLines - 1].bottom) {
							found = true;
						} else {
							lastGoodIndex = charIndex + 1;
						}
					}

					charIndex++;
				}

				if (found) {
					const visibleText = node.textContent.substring(0, lastGoodIndex);
					const hiddenText = node.textContent.substring(lastGoodIndex);

					const hiddenNode = document.createTextNode(hiddenText);
					const span = document.createElement('span');
					span.className = 'hidd';
					span.appendChild(hiddenNode);

					node.textContent = visibleText;

					parent.insertBefore(span, node.nextSibling);
					hiddenSpans.push(span);

					totalLines = maxLines;
				} else {
					totalLines += rects.length;
				}
			} else {
				totalLines += rects.length;
			}
		}

		function walkNodes(node) {
			if (node.nodeType === Node.TEXT_NODE) {
				processTextNode(node, node.parentNode);
			}
			else if (node.nodeType === Node.ELEMENT_NODE && totalLines < maxLines) {
				Array.from(node.childNodes).forEach(walkNodes);
			}
			else if (node.nodeType === Node.ELEMENT_NODE) {
				const span = document.createElement('span');
				span.className = 'hidd';
				node.parentNode.insertBefore(span, node);
				span.appendChild(node);
				hiddenSpans.push(span);
			}
		}

		Array.from(element.childNodes).forEach(walkNodes);

		return hiddenSpans;
	}

	/* 
		================================================
		  
		Селекты
		
		================================================
	*/

	function select() {
		let allSelects = document.querySelectorAll('select');
		let slimSelectInstances = [];

		if (allSelects.length) {
			allSelects.forEach(select => {
				let instance = new SlimSelect({
					select: select,
					settings: {
						placeholderText: select.getAttribute('data-placeholder') || null,

						// openPosition: 'auto',
						// openPositionX: 'left',

						showSearch: select.hasAttribute('data-search'),
						searchText: 'Ничего не найдено',
						searchPlaceholder: 'Поиск',
						searchHighlight: true,
						allowDeselect: true,

						maxValuesShown: select.hasAttribute('data-count') ? 1 : false,
						maxValuesMessage: 'Выбрано ({number})',

						closeOnSelect: select.hasAttribute('data-not-close') ? false : true,
						// hideSelected: true,
					},
				});

				slimSelectInstances.push({ instance, select });

				const selectAttribures = Array.from(select.attributes)
					.filter(attr => !['class', 'tabindex', 'multiple', 'data-id', 'aria-hidden', 'style'].includes(attr.name))
					.map(attr => `${attr.name}="${attr.value}"`);

				selectAttribures.forEach(attr => {
					const [name, value] = attr.split('=');
					const selectOptions = document.querySelector(`.select__content[data-id="${select.getAttribute('data-id')}"] .select__options`);
					if (selectOptions) {
						selectOptions.setAttribute(name, value.replace(/"/g, ''));
						if (name === 'data-scroll') {
							selectOptions.style.maxHeight = value.replace(/["']/g, '');
						}
					}
				});

				select.addEventListener('change', function () {
					const selectedOption = this.options[this.selectedIndex];
					const href = selectedOption.getAttribute('data-href');
					if (href && href !== '#') {
						window.location.href = href;
					}
				});
			});

			window.addEventListener('scroll', () => {
				slimSelectInstances.forEach(({ instance }) => {
					instance.close();
				});
			});

			document.querySelectorAll('form').forEach(form => {
				form.addEventListener('reset', () => {
					requestAnimationFrame(() => {
						slimSelectInstances.forEach(({ instance, select }) => {
							if (form.contains(select)) {
								if (select.multiple) {
									const selectedValues = Array.from(select.selectedOptions).map(opt => opt.value);
									instance.setSelected(selectedValues);
								} else {
									instance.setSelected(select.value || '');
								}
							}
						});
					});
				});
			});
		}
	}

	/* 
		================================================
		  
		Фиксированное меню
		
		================================================
	*/

	function fixedMenu() {
		if (!headerTop) return;

		const isFixed = isDesktop() && window.scrollY > 180;

		if (isFixed) {
			headerTop.classList.add(headerTopFixed);
		} else {
			headerTop.classList.remove(headerTopFixed);
		}
	}

	window.addEventListener('scroll', throttle(fixedMenu, 100));
	window.addEventListener('resize', throttle(fixedMenu, 100));

	/* 
		================================================
		  
		Вставка видео
		
		================================================
	*/

	function video() {
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

	burger();
	gallery();
	popup();
	numbers();
	subMenu();
	map();
	spoller();
	showMore();
	select();
	fixedMenu();
	video();

	//
	//
	//
	//
	// Общие скрипты


	// 
	// 
	// Слайдеры

	// Наши проекты
	if (document.querySelector('.project-container')) {
		new Swiper('.project-container', {
			autoplay: {
				delay: 4000,
				pauseOnMouseEnter: true
			},
			loop: true,
			pagination: {
				el: '.project__pagination',
				type: 'bullets',
				clickable: true,
			},
			navigation: {
				nextEl: '.project__next',
				prevEl: '.project__prev',
			},
			keyboard: {
				enabled: true,
				onlyInViewport: false,
			},
			speed: 500,
			breakpoints: {
				1: {
					slidesPerView: 1,
					spaceBetween: 12,
				},
				768: {
					slidesPerView: 2,
					spaceBetween: 16,
				},
				1200: {
					slidesPerView: 3,
					spaceBetween: 20,
				},
			},
		});
	}

	// Новости
	if (document.querySelector('.news-container')) {
		new Swiper('.news-container', {
			autoplay: {
				delay: 4000,
				pauseOnMouseEnter: true
			},
			loop: true,
			pagination: {
				el: '.news__pagination',
				type: 'bullets',
				clickable: true,
			},
			navigation: {
				nextEl: '.news__next',
				prevEl: '.news__prev',
			},
			keyboard: {
				enabled: true,
				onlyInViewport: false,
			},
			speed: 500,
			breakpoints: {
				1: {
					slidesPerView: 1,
					spaceBetween: 12,
				},
				576: {
					slidesPerView: 2,
					spaceBetween: 16,
				},
				992: {
					slidesPerView: 3,
					spaceBetween: 16,
				},
				1200: {
					slidesPerView: 4,
					spaceBetween: 20,
				},
			},
		});
	}


	// Фильтрация в мобильной версии
	let filterButton = document.querySelector('.filter__title-button');
	let filterContent = document.querySelector('.filter__content');

	if (filterButton) {
		filterButton.addEventListener('click', function () {
			this.classList.toggle('active');
			_slideToggle(filterContent);

			if (this.classList.contains('active')) {
				hideScrollbar();
			} else {
				showScrollbar();
			}
		});
	}

	// input range
	let ranges = document.querySelectorAll('.range');

	if (ranges) {
		ranges.forEach((rangeBlock) => {
			const rangeMin = rangeBlock.querySelector('input[type=range][data-role="min"]');
			const rangeMax = rangeBlock.querySelector('input[type=range][data-role="max"]');
			const inputMin = rangeBlock.querySelector('input[type=number][data-role="min"]');
			const inputMax = rangeBlock.querySelector('input[type=number][data-role="max"]');
			const rangeBetween = rangeBlock.querySelector('.range__between');
			const track = rangeBlock.querySelector('.range__track');

			const minValue = parseInt(rangeMin.min);
			const maxValue = parseInt(rangeMax.max);
			let isTouched = false;

			function activateBetween() {
				if (!isTouched) {
					rangeBetween.style.display = 'block';
					isTouched = true;
				} else {
					if (!rangeBlock.classList.contains('active')) {
						rangeBlock.classList.add('active');
					}
				}
			}

			function updateBetween(min, max) {
				const range = maxValue - minValue;
				const left = ((min - minValue) / range) * 100;
				const right = 100 - ((max - minValue) / range) * 100;
				rangeBetween.style.left = `${left}%`;
				rangeBetween.style.right = `${right}%`;
			}

			function syncFromRange() {
				activateBetween();

				let min = parseInt(rangeMin.value);
				let max = parseInt(rangeMax.value);
				if (min > max) [min, max] = [max, min];

				inputMin.value = min;
				inputMax.value = max;

				updateBetween(min, max);
			}

			function syncFromInput() {
				activateBetween();

				let min = parseInt(inputMin.value);
				let max = parseInt(inputMax.value);

				min = Math.max(minValue, Math.min(min, maxValue));
				max = Math.max(minValue, Math.min(max, maxValue));

				if (min > max) [min, max] = [max, min];

				inputMin.value = min;
				inputMax.value = max;
				rangeMin.value = min;
				rangeMax.value = max;

				updateBetween(min, max);
			}

			track.addEventListener('click', (e) => {
				if (!(e.target.classList.contains('range__track') || e.target.classList.contains('range__between'))) {
					return;
				}

				const rect = track.getBoundingClientRect();
				const clickX = e.clientX - rect.left;
				const clickRatio = clickX / rect.width; // 0..1
				const clickedValue = Math.round(minValue + clickRatio * (maxValue - minValue));

				const distToMin = Math.abs(clickedValue - parseInt(rangeMin.value));
				const distToMax = Math.abs(clickedValue - parseInt(rangeMax.value));

				if (distToMin <= distToMax) {
					rangeMin.value = clickedValue;
				} else {
					rangeMax.value = clickedValue;
				}
				syncFromRange();
			});

			rangeMin.addEventListener('input', syncFromRange);
			rangeMax.addEventListener('input', syncFromRange);
			inputMin.addEventListener('change', syncFromInput);
			inputMax.addEventListener('change', syncFromInput);

			rangeBlock.closest('form').querySelector('[type="reset"]').addEventListener('click', function () {
				rangeBetween.style.left = "0";
				rangeBetween.style.right = "0";
			});

			syncFromRange();
		});
	}


	// Секция Кто мы 
	const who = document.querySelector('.info .container .who');
	const info = document.querySelector('.info');

	if (info && who) {
		const container = info.querySelector('.container');
		const parent = info.parentNode;

		let movedOut = false;

		const ro = new ResizeObserver(entries => {
			for (let entry of entries) {
				const width = entry.contentRect.width;

				if (width <= 1199 && !movedOut) {
					parent.insertBefore(who, info);
					movedOut = true;
				}
				else if (width > 1200 && movedOut) {
					container.insertBefore(who, container.firstChild);
					movedOut = false;
				}
			}
		});
		ro.observe(document.body);
	}


	// Кнопка Все вопросы в FAQ 
	let faqButton = document.querySelector('.faq__button');

	if (faqButton) {
		faqButton.addEventListener('click', function () {
			this.closest('.faq').querySelectorAll('.faq__item[hidden]').forEach(item => {
				item.hidden = false;

				this.remove();
			});
		});
	}

})();
//# sourceMappingURL=script.js.map
