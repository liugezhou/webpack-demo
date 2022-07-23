import style from './index.scss'
import avatar from './img.png'

import createAvatar from './createAvatar'
let root = document.getElementById('root')
import './index.scss'

root.innerHTML = '<div class="iconfont icon-icon-trash"></div>'

createAvatar()

let img = document.createElement('img')
img.src = avatar
img.classList.add(style.avatar)

root.appendChild(img)
