import { html, body, bodyOpenModalClass, burgerMedia, windowWidth, menu, menuActive, menuLink } from '../variables.js'

//
//  
//
//
// Проверки

// Проверка на мобильное устройство
export function isMobile() {
	return /Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(navigator.userAgent)
}

// Проверка на десктоп разрешение 
export function isDesktop() {
	return windowWidth > burgerMedia
}

// Проверка поддержки webp 
export function checkWebp() {
	const webP = new Image()
	webP.onload = webP.onerror = function () {
		if (webP.height !== 2) {
			document.querySelectorAll('[style]').forEach(item => {
				const styleAttr = item.getAttribute('style')
				if (styleAttr.indexOf('background-image') === 0) {
					item.setAttribute('style', styleAttr.replace('.webp', '.jpg'))
				}
			})
		}
	}
	webP.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA"
}

// Проверка на браузер safari
export const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent)

// Проверка есть ли скролл 
export function haveScroll() {
	return document.documentElement.scrollHeight !== document.documentElement.clientHeight
}

// Видимость элемента
export function isHidden(el) {
	return window.getComputedStyle(el).display === 'none'
}

// Закрытие бургера на десктопе
export function checkBurgerAndMenu() {
	if (isDesktop()) {
		menuLink.classList.remove('active')
		if (menu) {
			menu.classList.remove(menuActive)
			if (!body.classList.contains(bodyOpenModalClass)) {
				body.classList.remove('no-scroll')
			}
		}
	}

	if (html.classList.contains('lg-on')) {
		if (isMobile()) {
			body.style.paddingRight = '0'
		} else {
			body.style.paddingRight = getScrollBarWidth() + 'px'
		}
	}
}

// Видимость элементов
export function watchElements(callback) {
	const elements = document.querySelectorAll('[data-watch]')
	if (!elements.length) return

	const observer = new IntersectionObserver((entries) => {
		entries.forEach((entry) => {
			const { target, isIntersecting } = entry
			const toggleClass = target.hasAttribute('data-watch-toggle')

			if (isIntersecting) {
				target.classList.add('_visible')
				if (typeof callback === 'function') callback(target)
			} else if (toggleClass) {
				target.classList.remove('_visible')
			}
		})
	}, { threshold: 0.1 })

	elements.forEach(el => observer.observe(el))
}

// Получение объектов с медиа-запросами
export function dataMediaQueries(array, dataSetValue) {
	let media = Array.from(array).filter(function (item) {
		if (item.dataset[dataSetValue]) {
			return item.dataset[dataSetValue].split(",")[0]
		}
	})

	if (media.length) {
		let breakpointsArray = []
		media.forEach(item => {
			let params = item.dataset[dataSetValue]
			let breakpoint = {}
			let paramsArray = params.split(",")
			breakpoint.value = paramsArray[0]
			breakpoint.type = paramsArray[1] ? paramsArray[1].trim() : "max"
			breakpoint.item = item
			breakpointsArray.push(breakpoint)
		})

		let mdQueries = breakpointsArray.map(function (item) {
			return '(' + item.type + "-width: " + item.value + "px)," + item.value + ',' + item.type
		})

		mdQueries = uniqArray(mdQueries)
		let mdQueriesArray = []

		if (mdQueries.length) {
			mdQueries.forEach(breakpoint => {
				let paramsArray = breakpoint.split(",")
				let mediaBreakpoint = paramsArray[1]
				let mediaType = paramsArray[2]
				let matchMedia = window.matchMedia(paramsArray[0])

				let itemsArray = breakpointsArray.filter(function (item) {
					return item.value === mediaBreakpoint && item.type === mediaType
				})

				mdQueriesArray.push({ itemsArray, matchMedia })
			})



			return

		}
	}
}
