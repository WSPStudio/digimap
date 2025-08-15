// Очистка input и textarea при закрытии модалки и отправки формы / Удаление классов ошибки
let inputs = document.querySelectorAll('input, textarea');

export function clearInputs() {
	inputs.forEach(element => {
		element.classList.remove('wpcf7-not-valid', 'error');
	});
}

export function checkInputDateValue(input) {
	input.classList.toggle('empty', input.value.length === 0);
}

inputs.forEach(input => {
	const parentElement = input.parentElement;
	const submitButton = input.closest('form')?.querySelector('.submit');

	const updateActiveState = () => {
		if (input.type === 'text' || input.type === 'date') {
			parentElement.classList.toggle('active', input.value.length > 0);
		}
	};

	const resetValidation = () => {
		input.setCustomValidity('');
		submitButton.disabled = false;
	};

	input.addEventListener('keyup', updateActiveState);
	input.addEventListener('change', () => {
		input.classList.remove('wpcf7-not-valid');
		updateActiveState();
	});

	input.addEventListener('input', () => {
		// Форматирование чисел
		if (input.getAttribute('data-number')) {
			input.value = input.value.replace(/\D/g, '').replace(/(\d)(?=(\d{3})+$)/g, '$1 ');
		}

		// Валидация email
		if (input.type === 'email') {
			input.value = input.value.replace(/[^0-9a-zA-Z@.-]+/g, '');
		}

		// Валидация имени
		const nameAttr = input.name?.toLowerCase() || '';
		const placeholder = input.placeholder?.toLowerCase() || '';
		const fioKeywords = ['имя', 'фамилия', 'отчество'];
		const isFIO = nameAttr.includes('name') || fioKeywords.some(word => placeholder.includes(word));

		if (isFIO) {
			input.value = input.value.replace(/[^а-яА-ЯёЁa-zA-Z ]/g, '');
			return;
		}
	});

	if (input.type === 'tel' || input.type === 'email') {
		input.addEventListener('input', resetValidation);
	}
});

// Проверка формы перед отправкой
export function initFormValidation(form) {
	// Функция для проверки обязательных полей на выбор
	const checkRequiredChoice = () => {
		let requiredChoice = form.querySelectorAll('[data-required-choice]')
		let hasValue = Array.from(requiredChoice).some(input => input.value.trim() !== '' && input.value !== '+7 ')

		requiredChoice.forEach(input => {
			if (!hasValue) {
				input.setAttribute('required', 'true')
			} else {
				input.removeAttribute('required')
			}
		})
	}

	// Проверка при загрузке страницы
	checkRequiredChoice()

	form.addEventListener('submit', (e) => {
		let isValid = true

		form.querySelectorAll('input[type="tel"]').forEach(input => {
			const val = input.value.trim()

			const requiredLength = val.startsWith('+7') ? 17 : val.startsWith('8') ? 16 : Infinity

			if (val.length < requiredLength && val.length > 3) {
				input.setCustomValidity('Телефон должен содержать 11 цифр')
				input.reportValidity()
				isValid = false
			} else {
				input.setCustomValidity('')
			}
		})

		checkRequiredChoice()

		if (!isValid || !form.checkValidity()) e.preventDefault()
	})

	// Обновление `required` при вводе
	let requiredChoice = form.querySelectorAll('[data-required-choice]')

	requiredChoice.forEach(input => {
		input.addEventListener('input', checkRequiredChoice)
	})
}

document.querySelectorAll('form').forEach(initFormValidation)
