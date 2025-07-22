import './style.css'
import javascriptLogo from './javascript.svg'
import viteLogo from '/vite.svg'
import { startGame } from './phaser_game.js'

document.querySelector('#app').innerHTML = `
  <div>
    <h1>hi ashin <3</h1>
    <div id = "pookie" class="card">
    </div>
  </div>
`

startGame(document.querySelector('#pookie'))
