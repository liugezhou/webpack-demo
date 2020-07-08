import avatar from './img.png';
function createAvatar() {
    let img = document.createElement('img');
    img.src = avatar;
    img.classList.add('avatar');

    let root = document.getElementById('root');
    root.appendChild(img);
}

export default createAvatar