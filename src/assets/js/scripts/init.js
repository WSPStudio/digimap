import { isSafari, checkWebp, checkBurgerAndMenu } from './other/checks'
import { debounce } from './core/helpers'
import { loaded } from './core/dom'
import { formFiles } from './forms/file'


// Проверка на браузер safari
if (isSafari) document.documentElement.classList.add('safari')

// Проверка поддержки webp 
checkWebp()

// Закрытие бургера на десктопе
window.addEventListener('resize', debounce(checkBurgerAndMenu, 100))
checkBurgerAndMenu()

// Добавление класса loaded при загрузке страницы
loaded()

// Обработка input file 
formFiles()
