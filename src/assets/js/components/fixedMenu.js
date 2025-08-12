import { headerTop, headerTopFixed } from "../scripts/variables";
import { isDesktop } from "../scripts/other/checks";
import { throttle } from "../scripts/core/helpers";

/* 
	================================================
	  
	Фиксированное меню
	
	================================================
*/

export function fixedMenu() {
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

// Проверка sticky элементов
function observeStickyPosition(elOrSelector, stuckClass = 'sticky') {
	const stickyEl =
		typeof elOrSelector === 'string'
			? document.querySelector(elOrSelector)
			: elOrSelector instanceof Element
				? elOrSelector
				: null;

	if (!stickyEl) return;

	const topOffset = parseInt(getComputedStyle(stickyEl).top) || 0;

	function checkSticky() {
		const rect = stickyEl.getBoundingClientRect();
		if (Math.round(rect.top) <= topOffset) {
			stickyEl.classList.add(stuckClass);
		} else {
			stickyEl.classList.remove(stuckClass);
		}
	}

	checkSticky();
	window.addEventListener('scroll', throttle(checkSticky, 100));
	window.addEventListener('resize', throttle(checkSticky, 100));
}

