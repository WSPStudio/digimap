
import './scripts/init.js';
import './components.js';
import { _slideToggle } from './scripts/other/animation.js';
import { hideScrollbar, showScrollbar } from './scripts/other/scroll.js';

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
	let projectSlider = new Swiper('.project-container', {
		autoplay: {
			delay: 4000,
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

			},
			1200: {
				slidesPerView: 3,
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
		this.classList.toggle('active')
		_slideToggle(filterContent)

		if (this.classList.contains('active')) {
			hideScrollbar();
		} else {
			showScrollbar()
		}
	});
}

// input range
let ranges = document.querySelectorAll('.range');

if (ranges) {
	ranges.forEach((rangeBlock) => {
		const rangeMin = rangeBlock.querySelector('input[type=range][data-role="min"]')
		const rangeMax = rangeBlock.querySelector('input[type=range][data-role="max"]')
		const inputMin = rangeBlock.querySelector('input[type=number][data-role="min"]')
		const inputMax = rangeBlock.querySelector('input[type=number][data-role="max"]')
		const rangeBetween = rangeBlock.querySelector('.range__between')

		const minValue = parseInt(rangeMin.min)
		const maxValue = parseInt(rangeMax.max)
		let isTouched = false

		function activateBetween() {
			if (!isTouched) {
				rangeBetween.style.display = 'block'
				isTouched = true
			}
		}

		function updateBetween(min, max) {
			const range = maxValue - minValue
			const left = ((min - minValue) / range) * 100
			const right = 100 - ((max - minValue) / range) * 100
			rangeBetween.style.left = `${left}%`
			rangeBetween.style.right = `${right}%`
		}

		function syncFromRange() {
			activateBetween()

			let min = parseInt(rangeMin.value)
			let max = parseInt(rangeMax.value)
			if (min > max) [min, max] = [max, min]

			inputMin.value = min
			inputMax.value = max

			updateBetween(min, max)
		}

		function syncFromInput() {
			activateBetween()

			let min = parseInt(inputMin.value)
			let max = parseInt(inputMax.value)

			min = Math.max(minValue, Math.min(min, maxValue))
			max = Math.max(minValue, Math.min(max, maxValue))

			if (min > max) [min, max] = [max, min]

			inputMin.value = min
			inputMax.value = max
			rangeMin.value = min
			rangeMax.value = max

			updateBetween(min, max)
		}

		rangeMin.addEventListener('input', syncFromRange)
		rangeMax.addEventListener('input', syncFromRange)
		inputMin.addEventListener('change', syncFromInput)
		inputMax.addEventListener('change', syncFromInput)

		rangeBlock.closest('form').querySelector('[type="reset"]').addEventListener('click', function () {
			rangeBetween.style.left = "0"
			rangeBetween.style.right = "0"
		});

		syncFromRange()
	})
}


// Секция Кто мы 
const who = document.querySelector('.info .container .who')
const info = document.querySelector('.info')

if (info && who) {
	const container = info.querySelector('.container')
	const parent = info.parentNode

	let movedOut = false

	const ro = new ResizeObserver(entries => {
		for (let entry of entries) {
			const width = entry.contentRect.width

			if (width <= 1199 && !movedOut) {
				parent.insertBefore(who, info)
				movedOut = true
			}
			else if (width > 1200 && movedOut) {
				container.insertBefore(who, container.firstChild)
				movedOut = false
			}
		}
	})
	ro.observe(document.body)
}


