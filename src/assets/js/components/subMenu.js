import { isDesktop } from "../scripts/other/checks";
import { debounce } from "../scripts/core/helpers";
import { offset } from "../scripts/core/helpers";
import { _slideDown, _slideUp } from "../scripts/other/animation"
import { windowWidth } from "../scripts/variables";

/* 
	================================================
	  
	Многоуровневое меню
	
	================================================
*/

export function subMenu() {
	subMenuInit()

	let mediaSwitcher = false;
	let isResize;

	function subMenuResize() {


		if (isDesktop()) {

			subMenuInit(isResize = true)

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
				item.querySelector('.sub-menu-wrapper').style.display = 'block'
				toggleSubMenuVisible(item)
			})

			mediaSwitcher = false
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
					if (!item.contains(e.relatedTarget)) {
						item.classList.remove('active');
					}
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
	let isClicked = false

	menuItemArrow.forEach(item => {
		item.addEventListener('click', function (e) {
			e.preventDefault()
			if (!isDesktop()) {
				if (!isClicked) {
					isClicked = true
					if (!item.classList.contains('active')) {
						item.classList.add('active')
						item.parentElement.nextElementSibling.classList.add('active');
						_slideDown(item.parentElement.nextElementSibling, 200)
					} else {
						item.classList.remove('active')
						item.parentElement.nextElementSibling.classList.remove('remove');
						_slideUp(item.parentElement.nextElementSibling, 200)
					}

					setTimeout(() => {
						isClicked = false
					}, 300);
				}
			}
		});
	})

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
			element.style.display = state ? 'none' : 'block'
		});
	}

	function getTargetElementTag(e) {
		return e.target.parentElement.tagName == "LI" ? e.target.parentElement : e.target
	}

	function getPageSideMenu(e) {
		return e.target.closest('.menu') ? offset(e.target.closest('.menu>.menu-item-has-children')).left > (windowWidth / 2) ? 'right' : 'left' : 'left'
	}
}
