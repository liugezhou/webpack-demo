// 异步加载lodash库
async function  getComponent(){
   const {default:_ }  = await  import('lodash');
   const element = document.createElement('div');
   element.innerHTML = _.join(['liu','ge','zhou'],'-');
   return element;
}
document.addEventListener('click', ()=>{
  getComponent().then(element => {
    document.body.appendChild(element);
  })
})
