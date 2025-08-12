import { isHidden } from "./checks";

// 
// 
// 
// 
// Анимации 

// Плавное появление
export const fadeIn = (el, isItem = false, display, timeout = 400) => {
	document.body.classList.add('_fade');

	let elements = isItem ? el : document.querySelectorAll(el);

	if (elements.length > 0) {
		elements.forEach(element => {
			element.style.opacity = 0;
			element.style.display = display || 'block';
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
		el.style.display = display || 'block';
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
export const fadeOut = (el, isItem = false, timeout = 400) => {
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
				element.removeAttribute('style')
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
			el.removeAttribute('style')
		}, timeout + 400);
	}
};

// Плавно скрыть с анимацией слайда 
export const _slideUp = (target, duration = 400, showmore = 0) => {
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
}

// Плавно показать с анимацией слайда 
export const _slideDown = (target, duration = 400) => {
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
}

// Плавно изменить состояние между _slideUp и _slideDown
export const _slideToggle = (target, duration = 400) => {
	if (target && isHidden(target)) {
		return _slideDown(target, duration);

		console.log(target);

	} else {
		return _slideUp(target, duration);
	}
}
