import { getHash } from "../scripts/other/url.js"
import { indexInParent, scrollToSmoothly, offset } from "../scripts/core/helpers";
import { dataMediaQueries } from "../scripts/other/checks.js";
import { fadeIn } from "../scripts/other/animation";
import { headerTop } from "../scripts/core/variables.js";

/* 
	================================================
	  
	Табы
	
	================================================
*/

export function tab() {
	let tabs = document.querySelectorAll('[data-tabs]');
	let tabsActiveHash = [];

	if (tabs.length > 0) {
		let hash = getHash();

		if (hash && hash.startsWith('tab-')) {
			tabsActiveHash = hash.replace('tab-', '').split('-');
		}

		tabs.forEach((tabsBlock, index) => {
			tabsBlock.classList.add('tab_init');
			tabsBlock.setAttribute('data-tabs-index', index);
			tabsBlock.addEventListener("click", setTabsAction);
			initTabs(tabsBlock);
		});

		let mdQueriesArray = dataMediaQueries(tabs, "tabs");

		if (mdQueriesArray && mdQueriesArray.length) {
			mdQueriesArray.forEach(mdQueriesItem => {
				mdQueriesItem.matchMedia.addEventListener("change", function () {
					setTitlePosition(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
				});
				setTitlePosition(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
			});
		}
	}

	function setTitlePosition(tabsMediaArray, matchMedia) {
		tabsMediaArray.forEach(tabsMediaItem => {
			tabsMediaItem = tabsMediaItem.item;
			let tabsTitles = tabsMediaItem.querySelector('[data-tabs-header]');
			let tabsTitleItems = tabsMediaItem.querySelectorAll('[data-tabs-title]');
			let tabsContent = tabsMediaItem.querySelector('[data-tabs-body]');
			let tabsContentItems = tabsMediaItem.querySelectorAll('[data-tabs-item]');

			tabsTitleItems = Array.from(tabsTitleItems).filter(item => item.closest('[data-tabs]') === tabsMediaItem);
			tabsContentItems = Array.from(tabsContentItems).filter(item => item.closest('[data-tabs]') === tabsMediaItem);
			tabsContentItems.forEach((tabsContentItem, index) => {
				if (matchMedia.matches) {
					tabsContent.append(tabsTitleItems[index]);
					tabsContent.append(tabsContentItem);
					tabsMediaItem.classList.add('tab-spoller');
				} else {
					tabsTitles.append(tabsTitleItems[index]);
					tabsMediaItem.classList.remove('tab-spoller');
				}
			});
		});
	}

	function initTabs(tabsBlock) {
		let tabsTitles = tabsBlock.querySelectorAll('[data-tabs-header]>*');
		let tabsContent = tabsBlock.querySelectorAll('[data-tabs-body]>*');
		let tabsBlockIndex = tabsBlock.dataset.tabsIndex;
		let tabsActiveHashBlock = tabsActiveHash[0] == tabsBlockIndex;

		if (tabsActiveHashBlock) {
			let tabsActiveTitle = tabsBlock.querySelector('[data-tabs-header]>.active');
			tabsActiveTitle ? tabsActiveTitle.classList.remove('active') : null;
		}

		if (tabsContent.length) {
			tabsContent.forEach((tabsContentItem, index) => {
				tabsTitles[index].setAttribute('data-tabs-title', '');
				tabsContentItem.setAttribute('data-tabs-item', '');

				if (tabsActiveHashBlock && index == tabsActiveHash[1]) {
					tabsTitles[index].classList.add('active');
				}

				tabsContentItem.hidden = true;
			});

			if (!tabsBlock.querySelector('[data-tabs-header]>.active')) {
				tabsBlock.querySelector('[data-tabs-body]').children[0].hidden = false
			} else {
				tabsBlock.querySelector('[data-tabs-body]').children[indexInParent(tabsBlock.querySelector('[data-tabs-header]>.active'))].hidden = false
			}
		}
	}

	function setTabsStatus(tabsBlock) {
		let tabsTitles = tabsBlock.querySelectorAll('[data-tabs-title]');
		let tabsContent = tabsBlock.querySelectorAll('[data-tabs-item]');
		let tabsBlockIndex = tabsBlock.dataset.tabsIndex;

		function isTabsAnamate(tabsBlock) {
			if (tabsBlock.hasAttribute('data-tabs-animate')) {
				return tabsBlock.dataset.tabsAnimate > 0 ? Number(tabsBlock.dataset.tabsAnimate) : 500;
			}
		}

		let tabsBlockAnimate = isTabsAnamate(tabsBlock);

		if (tabsContent.length > 0) {
			let isHash = tabsBlock.hasAttribute('data-tabs-hash');

			tabsContent = Array.from(tabsContent).filter(item => item.closest('[data-tabs]') === tabsBlock);
			tabsTitles = Array.from(tabsTitles).filter(item => item.closest('[data-tabs]') === tabsBlock);
			tabsContent.forEach((tabsContentItem, index) => {
				if (tabsTitles[index].classList.contains('active')) {
					if (tabsBlockAnimate) {
						_slideDown(tabsContentItem, tabsBlockAnimate);
					} else {
						fadeIn(tabsContentItem, true)
						tabsContentItem.hidden = false;
					}
					if (isHash && !tabsContentItem.closest('.popup')) {
						setHash(`tab-${tabsBlockIndex}-${index}`);
					}
				} else {
					if (tabsBlockAnimate) {
						_slideUp(tabsContentItem, tabsBlockAnimate);
					} else {
						tabsContentItem.style.display = 'none'
						tabsContentItem.hidden = true;
					}
				}
			});
		}
	}

	function setTabsAction(e) {
		let el = e.target;

		if (el.closest('[data-tabs-title]') && !el.closest('[data-tabs-title]').classList.contains('active')) {
			let tabTitle = el.closest('[data-tabs-title]');
			let tabsBlock = tabTitle.closest('[data-tabs]');

			if (!tabTitle.classList.contains('active') && !tabsBlock.querySelector('._slide')) {
				let tabActiveTitle = tabsBlock.querySelectorAll('[data-tabs-title].active');
				tabActiveTitle.length ? tabActiveTitle = Array.from(tabActiveTitle).filter(item => item.closest('[data-tabs]') === tabsBlock) : null;
				tabActiveTitle.length ? tabActiveTitle[0].classList.remove('active') : null;
				tabTitle.classList.add('active');
				setTabsStatus(tabsBlock);

				scrollToSmoothly(offset(el.closest('[data-tabs]')).top - parseInt(headerTop.clientHeight))

			}

			e.preventDefault();
		}
	}

	// Переключение табов левыми кнопками (атрибут data-tab="") 
	let dataTabs = document.querySelectorAll('[data-tab]');

	dataTabs.forEach(button => {
		button.addEventListener('click', function () {
			document.querySelector(button.getAttribute('data-tab')).click();
			scrollToSmoothly(offset(document.querySelector(button.getAttribute('data-tab'))
			).top - parseInt(headerTop.clientHeight))
		});
	});
}
