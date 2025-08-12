
// Замена текста при выборе файла 
export function formFiles() {
	document.querySelectorAll('.input-file').forEach(wrapper => {
		const input = wrapper.querySelector('input')
		const textEl = wrapper.querySelector('.input-file-text')
		const defaultText = textEl.textContent
		const form = wrapper.closest('form')

		let dragCounter = 0

		const updateFileText = () => {
			if (!input.files.length) {
				textEl.textContent = defaultText
				return
			}

			const names = Array.from(input.files).map(f => f.name).join(', ')
			textEl.textContent = names
		}

		input.addEventListener('change', updateFileText)

		form?.addEventListener('reset', () => {
			textEl.textContent = defaultText
		})

		form?.addEventListener('dragenter', e => {
			e.preventDefault()
			dragCounter++
			form.classList.add('form-dragover')
		})

		form?.addEventListener('dragleave', e => {
			e.preventDefault()
			dragCounter--
			if (dragCounter === 0) {
				form.classList.remove('form-dragover')
			}
		})

		form?.addEventListener('dragover', e => {
			e.preventDefault()
		})

		form?.addEventListener('drop', e => {
			e.preventDefault()
			dragCounter = 0
			form.classList.remove('form-dragover')

			if (e.dataTransfer.files.length) {
				const dataTransfer = new DataTransfer()
				Array.from(e.dataTransfer.files).forEach(f => dataTransfer.items.add(f))
				input.files = dataTransfer.files
				updateFileText()
			}
		})
	})
}
