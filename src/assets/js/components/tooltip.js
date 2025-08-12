import { getPageSide } from "../scripts/core/helpers";

/* 
	================================================
	  
	Тултипы
	
	================================================
*/

export function tooltip() {
	let tooltipItems = document.querySelectorAll('[data-tooltip]');

	let calculatePosTooltip = (item) => {
		tooltip = item.querySelector('.tooltip')

		if (getPageSide(item) == 'left') {
			tooltip.style.left = 0
			tooltip.style.bottom = item.offsetHeight + 'px'
		} else {
			tooltip.style.right = 0
			tooltip.style.bottom = item.offsetHeight + 'px'
		}
	}

	function createTooltips() {
		tooltipItems.forEach(item => {
			let timer, tooltip, tooltipText;

			let tooltipIsHtml = item.getAttribute('data-tooltip') == 'html' ? true : false

			if (item.hasAttribute('title')) {
				tooltipText = item.getAttribute('title')
			} else if (item.getAttribute('data-tooltip') != '') {
				tooltipText = item.getAttribute('data-tooltip');
			} else {
				tooltipText = '';
			}

			if (tooltipIsHtml) {
				tooltip = item.querySelector('.tooltip');
			} else {
				tooltip = document.createElement("div");
				item.append(tooltip)
				tooltip.classList.add('tooltip')
				tooltip.textContent = tooltipText
			}

			calculatePosTooltip(item);

			item.addEventListener('mouseenter', () => {
				tooltip.classList.add('tooltip_active');
			});

			item.addEventListener('focusin', () => {
				tooltip.classList.add('tooltip_active');
			});

			item.addEventListener('mouseleave', () => {
				timer = setTimeout(() => {
					tooltip.classList.remove('tooltip_active');
				}, 200);
			});

			item.addEventListener('focusout', () => {
				timer = setTimeout(() => {
					tooltip.classList.remove('tooltip_active');
				}, 200);
			});

			tooltip.addEventListener('mouseenter', () => clearTimeout(timer));
			tooltip.addEventListener('mouseleave', () => tooltip.classList.remove('tooltip_active'));

		});

	}

	createTooltips()
}
