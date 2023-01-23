import React, { useCallback, useEffect, useState } from 'react';
// import logo from './logo.svg';
import './App.css';
import { Home } from './components/home';
import { url } from './const/urls';
import { useTelegram } from './hooks/useTelegram';


function App() {
  const {tg} = useTelegram()
  const [title, setTitle] = useState('T')
  const onClose =() => {
    tg.close()
  }
  
  

  const onSendData = useCallback(() => {
    console.log('h')
    // tg.sendData(JSON.stringify({message: 'hello!'}))
    fetch(url + '/checkbalance', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        //   mode: 'no-cors',
        body: JSON.stringify({
          adress: '345'
        })
    })
    .then((response) => response.json())
    .then((data) => {
      console.log('data', data)
      setTitle('data.res')
    });
  }, [])

  useEffect(()=>{tg.ready()})
  useEffect(() => {tg.MainButton.show()})
  useEffect(() => {tg.onEvent('mainButtonClicked', onSendData)})
  
  return (
    <div className="App">
      <button onClick={onClose}>Закрыть</button>
      <h4>{title}</h4>
      <Home/>
    </div>
  );
}

export default App;
