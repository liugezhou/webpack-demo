import test from './test'
console.log(test.name)
function getComponent(){
  // 异步加载lodash库
  return import('lodash').then( ({default :_} ) => {
    var element = document.createElement('div');
    element.innerHTML = _.join(['liu','ge','zhou'],'-');
    return element;
  })
}

getComponent().then(element =>{
  document.body.appendChild(element)
})