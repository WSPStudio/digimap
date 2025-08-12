window.addEventListener('DOMContentLoaded', () => {
	maskPhone()
})

function maskPhone() {
	const phoneInputs = document.querySelectorAll('[type="tel"]')
	const maskPlus7 = '+7 (___) ___ ____'
	const minValidLength = 5
	const minTrimmedLength = 4

	phoneInputs.forEach(input => {
		const originalPlaceholder = input.placeholder

		input.addEventListener('focus', function () {
			if (!this.value) {
				this.value = '+7 ('
				this.placeholder = ''
			}

			setTimeout(() => {
				this.setSelectionRange(this.value.length, this.value.length)
			}, 0)
		})


		input.addEventListener('input', function (event) {
			const isDelete = event.inputType === 'deleteContentBackward'
			let raw = this.value
			const digits = raw.replace(/\D/g, '')

			if (isDelete) {
				return
			}

			let formatted = formatWithMask(digits)

			this.value = formatted

			setTimeout(() => {
				const pos = this.value.indexOf('_')
				setCursorPosition(this, pos === -1 ? this.value.length : pos)
			}, 0)
		})

		input.addEventListener('blur', function () {
			if (this.value === '+7 (' || this.value.length < minValidLength) {
				this.value = ''
				this.placeholder = originalPlaceholder
			}
		})

		input.addEventListener('paste', function (e) {
			e.preventDefault()
			let pasted = (e.clipboardData || window.clipboardData).getData('text')
			pasted = pasted.replace(/\D/g, '')
			this.value = formatWithMask(pasted)
		})

		input.addEventListener('change', function () {
			const submit = input.closest('form')?.querySelector('[type="submit"]')
			if (!submit) return
			const validLength = this.value.startsWith('8') ? 16 : 18
			if (this.value.length < validLength) {
				submit.setAttribute('disabled', true)
				this.classList.add('error')
			} else {
				submit.removeAttribute('disabled')
				this.classList.remove('error')
			}
		})
	})

	function formatWithMask(digits) {
		if (!digits) return ''

		// Принудительно первая цифра 7 (если не 7 или 8)
		if (digits[0] !== '7' && digits[0] !== '8') {
			digits = '7' + digits
		}

		const mask = digits[0] === '8' ? '8 (___) ___ ____' : '+7 (___) ___ ____'

		let i = 0
		let formatted = ''

		for (const char of mask) {
			if (i >= digits.length) break
			if (char === '_' || /\d/.test(char)) {
				formatted += digits[i++]
			} else {
				formatted += char
			}
		}

		return formatted
	}


	function setCursorPosition(el, pos) {
		el.setSelectionRange(pos, pos)
	}
}
