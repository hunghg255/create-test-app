const messBox = document.getElementById('mess-box')
const inpMess = document.getElementById('inp-mess')
const formMess = document.getElementById('form-mess')

const client = io('http://localhost:3000', {
  transportOptions: {
    polling: {
      extraHeaders: {
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2Mjg4MTgzODgsImV4cCI6MTYyODkwNDc4OH0.ojrnKFYCNRugVxguD1hCrXhdRrieHQQcXA0fv6IOOF8'
      }
    }
  }
})

client.on("connect", () => {
  console.log(`Conected with id: ${client.id}`);
});

client.on('server-send', (mess) => {
  addMess(mess)
  messBox.scrollTop = messBox.scrollHeight
})

formMess.addEventListener('submit', (e) => {
  e.preventDefault()
  const mess = inpMess.value
  addMess(mess, 1)
  inpMess.value = ''
  messBox.scrollTop = messBox.scrollHeight
  client.emit('client-send', mess)
})

function addMess(mess, from) {
  const text = document.createElement('span')
  const div = document.createElement('div')
  div.style.display = 'flex'
  div.style.flexDirection = 'column'
  text.textContent = mess
  text.style.maxWidth = '100px'
  text.style.wordBreak = 'break-all'
  text.style.display = 'block'
  if (from) text.style.marginLeft = 'auto'
  div.appendChild(text)
  messBox.appendChild(div)
}