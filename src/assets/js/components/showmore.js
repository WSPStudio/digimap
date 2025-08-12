/* 
	================================================
	  
	Показать еще
	
	================================================
*/

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
			span.className = 'hidden';
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
				span.className = 'hidden';
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
			span.className = 'hidden';
			node.parentNode.insertBefore(span, node);
			span.appendChild(node);
			hiddenSpans.push(span);
		}
	}

	Array.from(element.childNodes).forEach(walkNodes);

	return hiddenSpans;
}

export function showMore() {
	document.querySelectorAll('[data-more-wrapper]').forEach(wrapper => {
		const button = wrapper.querySelector('[data-more]')
		if (!button) return

		const [initialCount, stepCount, selector = '[data-more-item]'] = button.getAttribute('data-more').split(',')
		const items = Array.from(wrapper.querySelectorAll(selector))
		const moreOpenText = button.querySelector('[data-more-open]')
		const moreCloseText = button.querySelector('[data-more-close]')
		const [mediaBreakpointRaw, mediaBreakpointType = 'max'] = wrapper.dataset.media ? wrapper.dataset.media.split(',') : []
		const mediaBreakpoint = mediaBreakpointRaw ? parseInt(mediaBreakpointRaw) : null

		let visibleCount = parseInt(initialCount)
		let mediaQuery = null

		const isLinesMode = stepCount === 'lines'
		let isToggleActive = false
		const linesTarget = wrapper.querySelector('[data-lines]')
		let hiddenElements = []

		const applyTransition = element => {
			element.style.transition = 'max-height 0.3s ease'
			element.style.overflow = 'hidden'
		}

		const toggleLinesMode = () => {
			if (!linesTarget) return

			const isExpanded = linesTarget.classList.toggle('active')

			if (isExpanded) {
				hiddenElements.forEach(span => {
					const children = Array.from(span.childNodes)
					span.replaceWith(...children)
				})
				hiddenElements = []
			} else {
				hiddenElements = limitLines(linesTarget, initialCount)
			}

			if (moreOpenText) moreOpenText.style.display = isExpanded ? 'none' : ''
			if (moreCloseText) moreCloseText.style.display = isExpanded ? '' : 'none'

			if (isExpanded) {
				wrapper.classList.add('active')
				button.classList.add('active')
			} else {
				wrapper.classList.remove('active')
				button.classList.remove('active')
			}
		}

		const resetInitialState = () => {
			visibleCount = parseInt(initialCount)

			if (isLinesMode && linesTarget) {
				hiddenElements.forEach(span => {
					const children = Array.from(span.childNodes)
					span.replaceWith(...children)
				})

				hiddenElements = limitLines(linesTarget, initialCount)

				linesTarget.classList.remove('active')
				wrapper.classList.remove('active')
				button.classList.remove('active')
			} else {
				items.forEach((item, index) => {
					applyTransition(item)
					if (index >= visibleCount) item.style.maxHeight = '0px'
					else item.style.maxHeight = `${item.scrollHeight}px`
				})

				button.style.display = visibleCount >= items.length ? 'none' : ''
			}

			if (moreOpenText) moreOpenText.style.display = ''
			if (moreCloseText) moreCloseText.style.display = 'none'
		}

		const showAllItems = () => {
			if (!isLinesMode) {
				items.forEach(item => item.style.maxHeight = `${item.scrollHeight}px`)
			}
			wrapper.classList.add('active')
			button.classList.add('active')
		}

		const buttonHandler = () => {
			if (isLinesMode) {
				toggleLinesMode()
				return
			}

			if (stepCount === 'all') {
				showAllItems()
				button.remove()
				return
			}

			if (stepCount === 'toggle') {
				if (!isToggleActive) {
					showAllItems()
					isToggleActive = true
					if (moreOpenText) moreOpenText.style.display = 'none'
					if (moreCloseText) moreCloseText.style.display = ''
				} else {
					isToggleActive = false

					items.forEach((item, index) => {
						if (index < visibleCount) {
							item.style.maxHeight = `${item.scrollHeight}px`
						} else {
							item.style.maxHeight = '0px'
						}
					})

					if (moreOpenText) moreOpenText.style.display = ''
					if (moreCloseText) moreCloseText.style.display = 'none'
					wrapper.classList.remove('active')
					button.classList.remove('active')
				}
				return
			}

			const step = parseInt(stepCount)
			visibleCount += step

			items.forEach((item, index) => {
				if (index < visibleCount) item.style.maxHeight = `${item.scrollHeight}px`
			})

			if (visibleCount >= items.length) {
				button.style.display = 'none'
				wrapper.classList.add('active')
				button.classList.add('active')
			}
		}

		const handleMediaQuery = e => {
			if (!e.matches) {
				showAllItems()
			} else {
				resetInitialState()
				button.addEventListener('click', buttonHandler)
			}
		}

		const initialize = () => {
			resetInitialState()
			button.addEventListener('click', buttonHandler)

			if (isLinesMode && linesTarget) {
				hiddenElements.forEach(span => {
					const children = Array.from(span.childNodes)
					span.replaceWith(...children)
				})
				hiddenElements = []

				const fullHeight = linesTarget.scrollHeight

				hiddenElements = limitLines(linesTarget, initialCount)
				const limitedHeight = linesTarget.scrollHeight

				if (fullHeight <= limitedHeight) {
					button.remove()
				}
			}
		}

		if (mediaBreakpoint) {
			const queryType = mediaBreakpointType === 'min' ? 'min-width' : 'max-width'
			mediaQuery = window.matchMedia(`(${queryType}: ${mediaBreakpoint}px)`)
			mediaQuery.addEventListener('change', handleMediaQuery)
			handleMediaQuery(mediaQuery)
		} else {
			initialize()
		}
	})
} 
