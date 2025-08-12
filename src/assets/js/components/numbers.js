
/* 
	================================================
	  
	Анимация чисел
	
	================================================
*/

export function numbers() {
	function digitsCountersInit(digitsCountersItems) {
		let digitsCounters = digitsCountersItems ? digitsCountersItems : document.querySelectorAll('[data-digits-counter]')

		if (digitsCounters) {
			digitsCounters.forEach(digitsCounter => {
				// Если элемент уже был активирован, сбрасываем его
				if (digitsCounter.classList.contains('active')) {
					digitsCounter.innerHTML = '0'
				} else {
					digitsCounter.dataset.originalValue = digitsCounter.innerHTML.replace(' ', '').replace(',', '.')
				}

				digitsCounter.style.width = digitsCounter.offsetWidth + 'px'

				if (parseFloat(digitsCounter.innerHTML.replace(',', '.')) % 1 != 0) {
					digitsCounter.setAttribute('data-float', true)
				}

				digitsCountersAnimate(digitsCounter)
			});
		}
	}

	function digitsCountersAnimate(digitsCounter) {
		let startTimestamp = null
		const duration = parseInt(digitsCounter.dataset.digitsCounter) || 1000
		const startValue = parseFloat(digitsCounter.dataset.originalValue) || 0
		const startPosition = 0

		digitsCounter.classList.add('active')

		const step = (timestamp) => {
			if (!startTimestamp) startTimestamp = timestamp
			const progress = Math.min((timestamp - startTimestamp) / duration, 1)

			if (digitsCounter.getAttribute('data-float')) {
				digitsCounter.innerHTML = (progress * (startPosition + startValue)).toFixed(1).replace('.', ',')
			} else {
				digitsCounter.innerHTML = Math.floor(progress * (startPosition + startValue))
				digitsCounter.innerHTML = digitsCounter.innerHTML.replace(/\D/g, '').replace(/(\d)(?=(\d{3})+$)/g, '$1 ')
			}

			if (progress < 1) {
				window.requestAnimationFrame(step)
			}
		}

		window.requestAnimationFrame(step)

		setTimeout(() => {
			digitsCounter.removeAttribute('style')
		}, duration + 500)
	}

	// digitsCountersInit() // Запуск при скролле 

	let options = {
		threshold: 0.6
	}

	let observer = new IntersectionObserver((entries, observer) => {
		entries.forEach(entry => {
			const targetElement = entry.target
			const digitsCountersItems = targetElement.querySelectorAll('[data-digits-counter]')

			if (entry.isIntersecting) {
				if (digitsCountersItems.length) {
					digitsCountersInit(digitsCountersItems)
				}
			} else {
				digitsCountersItems.forEach(item => item.classList.remove('active'))
			}
		});
	}, options)

	let sections = document.querySelectorAll('[class*="section"]')

	if (sections.length) {
		sections.forEach(section => observer.observe(section))
	}
}



