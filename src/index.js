import style from './index.scss';
import avatar from './img.png';

import createAvatar from './createAvatar'
createAvatar();

let img = document.createElement('img');
img.src = avatar;
img.classList.add(style.avatar);

let root = document.getElementById('root');
root.appendChild(img);