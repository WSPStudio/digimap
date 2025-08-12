
/* 
	================================================
	  
	Слайдеры
	
	================================================
*/

// Включение слайдера на определенных брекпоинтах
export function slider(match, settings) {
	if (settings[0]) {
		let slider;
		let breakpoint = window.matchMedia(`(${match})`);

		let breakpointChecker = function () {
			if (breakpoint.matches === true) {
				return enableSwiper();
			} else if (breakpoint.matches === false) {
				if (slider !== undefined) {
					slider.destroy(true, true);
				}
				return;
			}
		};

		let enableSwiper = function () {
			slider = new Swiper(settings[0], settings[1])
		};

		breakpoint.addListener(breakpointChecker);
		breakpointChecker();
	}
}

// Пример
// let aboutSlider = [
// 	'.about-container',
// 	{
// 		settings
// 	}];

// checkBreakpoint('max-width: 767px', aboutSlider);
