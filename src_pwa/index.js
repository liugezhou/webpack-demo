console.log('hello,mingzhou1');

if('serviceWorker' in  navigator){
  window.addEventListener('load', () =>{
    navigator.serviceWorker.register('/service-worker.js').then(
      registration =>{
        console.log('service-worker registed');
      }
    ).catch(()=>{
      console.log('service worker error!')
    })
  })
}