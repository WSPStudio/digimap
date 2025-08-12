import { body } from "../scripts/variables";
import { fadeIn, fadeOut } from "../scripts/other/animation";

/* 
	================================================
	  
	Отправка форм
	
	================================================
*/

export function form() {
	const allForms = document.querySelectorAll('form');

	allForms.forEach(form => {
		if (!form.classList.contains('wpcf7-form') && !form.classList.contains('catalog__left')) {
			if (!form.hasAttribute('enctype')) {
				form.setAttribute('enctype', 'multipart/form-data');
			}

			form.addEventListener('submit', formSend);

			async function formSend(e) {
				e.preventDefault();

				let formData = new FormData(form);
				form.classList.add('sending');

				try {
					let mailResponse = await fetch('/mail.php', {
						method: 'POST',
						body: formData
					});

					let wpFormData = new FormData(form);
					wpFormData.append('action', 'submit_request');

					let wpResponse = await fetch('/wp-admin/admin-ajax.php', {
						method: 'POST',
						body: wpFormData,
						credentials: 'same-origin'
					});

					let wpResult = await wpResponse.json();

					if (mailResponse.ok && wpResult.success) {
						fadeOut('.popup');

						setTimeout(() => {
							fadeIn('.popup-thank');
						}, 1000);

						setTimeout(() => {
							fadeOut('.popup');
						}, 3000);

						setTimeout(() => {
							body.classList.remove('no-scroll');
						}, 3500);

						form.reset();
					} else {
						console.error('Ошибка при отправке:', {
							mail: mailResponse,
							wp: wpResult
						});
					}
				} catch (error) {
					console.error('Ошибка сети:', error);
				} finally {
					form.classList.remove('sending');
				}
			}
		}
	});
}

