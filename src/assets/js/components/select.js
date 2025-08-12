
/* 
	================================================
	  
	Селекты
	
	================================================
*/

export function select() {
	let allSelects = document.querySelectorAll('select');
	let slimSelectInstances = []

	if (allSelects.length) {
		allSelects.forEach(select => {
			let instance = new SlimSelect({
				select: select,
				settings: {
					placeholderText: select.getAttribute('data-placeholder') || null,

					// openPosition: 'auto',
					// openPositionX: 'left',

					showSearch: select.hasAttribute('data-search'),
					searchText: 'Ничего не найдено',
					searchPlaceholder: 'Поиск',
					searchHighlight: true,
					allowDeselect: true,

					maxValuesShown: select.hasAttribute('data-count') ? 1 : false,
					maxValuesMessage: 'Выбрано ({number})',

					closeOnSelect: select.hasAttribute('data-not-close') ? false : true,
					// hideSelected: true,
				},
			});

			slimSelectInstances.push({ instance, select });

			const selectAttribures = Array.from(select.attributes)
				.filter(attr => !['class', 'tabindex', 'multiple', 'data-id', 'aria-hidden', 'style'].includes(attr.name))
				.map(attr => `${attr.name}="${attr.value}"`);

			selectAttribures.forEach(attr => {
				const [name, value] = attr.split('=');
				const selectOptions = document.querySelector(`.select__content[data-id="${select.getAttribute('data-id')}"] .select__options`);
				if (selectOptions) {
					selectOptions.setAttribute(name, value.replace(/"/g, ''));
					if (name === 'data-scroll') {
						selectOptions.style.maxHeight = value.replace(/["']/g, '');
					}
				}
			});

			select.addEventListener('change', function () {
				const selectedOption = this.options[this.selectedIndex];
				const href = selectedOption.getAttribute('data-href');
				if (href && href !== '#') {
					window.location.href = href;
				}
			});
		});

		window.addEventListener('scroll', () => {
			slimSelectInstances.forEach(({ instance }) => {
				instance.close();
			});
		});

		document.querySelectorAll('form').forEach(form => {
			form.addEventListener('reset', () => {
				requestAnimationFrame(() => {
					slimSelectInstances.forEach(({ instance, select }) => {
						if (form.contains(select)) {
							if (select.multiple) {
								const selectedValues = Array.from(select.selectedOptions).map(opt => opt.value);
								instance.setSelected(selectedValues);
							} else {
								instance.setSelected(select.value || '');
							}
						}
					});
				});
			});
		});
	}
}
