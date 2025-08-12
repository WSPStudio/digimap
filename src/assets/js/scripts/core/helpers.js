import { windowWidth, checkWindowWidth } from "../variables.js";

// Задержка при вызове функции. Выполняется в конце
export function debounce(fn, delay) {
	let timer;
	return () => {
		clearTimeout(timer);
		timer = setTimeout(() => fn.apply(this, arguments), delay);
	};
}

// Задержка при вызове функции. Выполняется раз в delay мс
export function throttle(fn, delay) {
	let lastCall = 0;
	return function (...args) {
		const now = Date.now();
		if (now - lastCall >= delay) {
			lastCall = now;
			fn.apply(this, args);
		}
	};
}

// Закрытие элемента при клике вне него
export function closeOutClick(closedElement, clickedButton, clickedButtonActiveClass, callback) {
	document.addEventListener('click', (e) => {
		const button = document.querySelector(clickedButton);
		const element = document.querySelector(closedElement);
		const withinBoundaries = e.composedPath().includes(element);

		if (!withinBoundaries && button?.classList.contains(clickedButtonActiveClass) && e.target !== button) {
			element.classList.remove('active');
			button.classList.remove(clickedButtonActiveClass);

			if (typeof callback === 'function') {
				callback();
			}
		}
	});
}

// Плавный скролл
export function scrollToSmoothly(pos, time = 400) {
	const currentPos = window.pageYOffset;
	let start = null;
	window.requestAnimationFrame(function step(currentTime) {
		start = !start ? currentTime : start;
		const progress = currentTime - start;
		if (currentPos < pos) {
			window.scrollTo(0, ((pos - currentPos) * progress / time) + currentPos);
		} else {
			window.scrollTo(0, currentPos - ((currentPos - pos) * progress / time));
		}
		if (progress < time) {
			window.requestAnimationFrame(step);
		} else {
			window.scrollTo(0, pos);
		}
	});
}

window.addEventListener('resize', debounce(checkWindowWidth, 100));


//
//
//
//
// Общее

// Случайное число в диапазоне
export function randomInteger(min, max) {
	let rand = min - 0.5 + Math.random() * (max - min + 1);
	return Math.round(rand);
}


//
//
//
//
// Позиционирование

// Отступ элемента от краев страницы
export function offset(el) {
	var rect = el.getBoundingClientRect(),
		scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
		scrollTop = window.pageYOffset || document.documentElement.scrollTop;

	return {
		top: rect.top + scrollTop,
		left: rect.left + scrollLeft,
		right: windowWidth - rect.width - (rect.left + scrollLeft),
	}
}

// Сторона страницы
export function getPageSide(item) {
	if (offset(item).left > (windowWidth / 2)) {
		return 'right';
	} else {
		return 'left';
	}
}

// 
// 
// 
// 
// Массивы

// Индекс элемента
export function indexInParent(node) {
	var children = node.parentNode.childNodes;
	var num = 0;
	for (var i = 0; i < children.length; i++) {
		if (children[i] == node) return num;
		if (children[i].nodeType == 1) num++;
	}
	return -1;
}

// Уникализация массива
export function uniqArray(array) {
	return array.filter(function (item, index, self) {
		return self.indexOf(item) === index;
	});
}

// 
// 
// 
// 
// Куки 

// Установки куки
export function setCookie(name, value, hours = 24) {
	const expires = new Date(Date.now() + hours * 60 * 60 * 1000).toUTCString();
	document.cookie = `${name}=${encodeURIComponent(value)}; path=/; expires=${expires}`;
}

// Получение куки
export function getCookie(name) {
	const cookies = document.cookie.split('; ').reduce((acc, cookie) => {
		let [key, value] = cookie.split('=');
		acc[key] = decodeURIComponent(value);
		return acc;
	}, {});

	let cookieValue = cookies[name] || null;
	return cookieValue;
}



// 
// 
// 
// 
// Общее 

// Установить курсор на последний символ
export function setCaret(item) {
	let data = item.value;
	item.focus()
	item.value = ''
	item.value = data
}


// Добавление элементу обертки
let wrap = (query, tag, wrapContent = false) => {
	let elements;

	let tagName = tag.split('.')[0] || 'div';
	let tagClass = tag.split('.').slice(1);
	tagClass = tagClass.length > 0 ? tagClass : [];

	if (typeof query === 'object') {
		elements = query;
	} else {
		elements = document.querySelectorAll(query);
	}

	function createWrapElement(item) {
		let newElement = document.createElement(tagName);
		if (tagClass.length) {
			newElement.classList.add(...tagClass);
		}

		if (wrapContent) {
			while (item.firstChild) {
				newElement.appendChild(item.firstChild);
			}
			item.appendChild(newElement);
		} else {
			item.parentElement.insertBefore(newElement, item);
			newElement.appendChild(item);
		}
	}

	if (elements.length) {
		for (let i = 0; i < elements.length; i++) {
			createWrapElement(elements[i]);
		}
	} else {
		if (elements.parentElement) {
			createWrapElement(elements);
		}
	}
};

wrap('table', '.table');
wrap('video', '.video');

