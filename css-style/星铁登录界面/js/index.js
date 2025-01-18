const radio = document.querySelector('.radio')
const radioBtn = document.querySelector('.radio-btn')
const enterGame = document.querySelector('.enter-game')
const phoneNumberInput = document.querySelector('.phone-number-input')
const codeNumberInput = document.querySelector('.code-number-input')
const messageTip = document.querySelector('.message-tip')

radioBtn.addEventListener('click', function (e) {
  radio.checked = !radio.checked
})

enterGame.addEventListener('click', (e) => {
  e.preventDefault()
  messageTip.classList.remove('hidden')
  debounce(() => {
    messageTip.classList.add('hidden')
  }, 2000)()
})

function debounce(fn, t) {
  let timer
  return () => {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      fn()
    }, t)
  }
}
