import { haveScroll, isSafari } from "./checks";
import { html, body, popup, bodyOpenModalClass, fixedElements, stickyObservers, menu, menuActive } from "../variables";

// 
// 
// 
// 
// Функции для работы со скроллом и скроллбаром

// Скрытие скроллбара
export function hideScrollbar() {
	// changeScrollbarGutter()

	popup.forEach(element => {
		element.style.display = 'none'
	});

	if (haveScroll()) {
		body.classList.add('no-scroll')
	}

	changeScrollbarPadding()
}

export function showScrollbar() {
	if (!menu.classList.contains(menuActive)) {
		body.classList.remove('no-scroll')
	}

	changeScrollbarPadding(false)

	// if (haveScroll()) {
	// 	body.classList.add('scrollbar-auto')
	// 	html.classList.add('scrollbar-auto')
	// }
}

// Ширина скроллбара
export function getScrollBarWidth() {
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

// Добавление полосы прокрутки
export function changeScrollbarGutter(add = true) {
	if (haveScroll()) {
		if (add) {
			body.classList.add(bodyOpenModalClass, 'scrollbar-auto')
			html.classList.add('scrollbar-auto')
		} else {
			body.classList.remove(bodyOpenModalClass, 'scrollbar-auto')
			html.classList.remove('scrollbar-auto')
		}
	}
}

// Добавление и удаление отступа у body и фиксированных элементов
export function changeScrollbarPadding(add = true) {
	const scrollbarPadding = getScrollBarWidth() + 'px';

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

// Добавление прокрутки мышью для горизонтальных блоков
export function scrolling() {
	let dataScrollingBlocks = document.querySelectorAll('[data-scrolling]');

	if (dataScrollingBlocks) {
		dataScrollingBlocks.forEach(element => {
			let isDragging = false
			let startX
			let scrollLeft
			let moved = false

			element.addEventListener('mousedown', event => {
				isDragging = true
				moved = false
				element.classList.add('dragging')
				startX = event.pageX - element.offsetLeft
				scrollLeft = element.scrollLeft

				element.querySelectorAll('img, a').forEach(item => item.ondragstart = () => false)
			})

			element.addEventListener('mousemove', event => {
				if (!isDragging) return
				event.preventDefault()
				moved = true
				const x = event.pageX - element.offsetLeft
				const walk = x - startX
				element.scrollLeft = scrollLeft - walk
			})

			element.addEventListener('mouseup', event => {
				isDragging = false
				element.classList.remove('dragging')

				element.querySelectorAll('img, a').forEach(item => item.ondragstart = null)

				if (moved) {
					event.preventDefault()
					event.stopPropagation()
				}
			})

			element.addEventListener('mouseleave', () => {
				isDragging = false
				element.classList.remove('dragging')
				element.querySelectorAll('img, a').forEach(item => item.ondragstart = null)
			})

			element.querySelectorAll('a').forEach(link => {
				link.addEventListener('click', event => {
					if (moved) {
						event.preventDefault()
						event.stopPropagation()
					}
				})
			})
		})
	}
}
