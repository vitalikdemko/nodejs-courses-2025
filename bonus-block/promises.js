const createPromise = (delay, text) =>{
    return new Promise((resolve)=>{
        setTimeout(()=>{
            resolve(text)
        }, delay)
    })
}

(async () => {
  const p1 = createPromise(2000, 'Проміс через 2 секунди');
  const p2 = createPromise(5000, 'Проміс через 5 секунд');
  const p3 = createPromise(10000, 'Проміс через 10 секунд');

  console.log(await p1);
  console.log(await p2);
  console.log(await p3);
})();