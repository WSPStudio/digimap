
/* 
	================================================
	  
	Звёздный рейтинг
	
	================================================
*/

export function rating() {
	const ratings = document.querySelectorAll('.rating__item');

	ratings.forEach(initRating);

	function initRating(rating) {
		const ratingActive = rating.querySelector('.rating__active');
		const ratingValue = rating.querySelector('.rating__value');
		const ratingInputs = rating.querySelectorAll('input');

		setRatingActiveWidth(ratingActive, ratingValue, ratingInputs.length);

		if (rating.classList.contains('rating__item_set')) {
			setRating(rating, ratingActive, ratingValue, ratingInputs.length);
		}
	}

	function setRatingActiveWidth(ratingActive, ratingValue, totalStars, index = null) {
		const value = index !== null ? index : ratingValue.innerHTML;
		const ratingActiveWidth = (100 / totalStars) * value;
		ratingActive.style.width = `${ratingActiveWidth}%`;
	}

	function setRating(rating, ratingActive, ratingValue, totalStars) {
		const ratingItems = rating.querySelectorAll('.rating__items input');

		ratingItems.forEach((ratingItem, index) => {
			ratingItem.addEventListener('mouseenter', () => {
				setRatingActiveWidth(ratingActive, ratingValue, totalStars, ratingItem.value);
			});

			ratingItem.addEventListener('mouseleave', () => {
				setRatingActiveWidth(ratingActive, ratingValue, totalStars);
			});

			ratingItem.addEventListener('click', () => {
				ratingValue.innerHTML = index + 1;
				setRatingActiveWidth(ratingActive, ratingValue, totalStars);
			});
		});
	}
}

