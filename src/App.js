import React, { useCallback, useEffect } from 'react';
// import logo from './logo.svg';
import './App.css';
import { Home } from './components/home';
const tg = window.Telegram.WebApp

function App() {
  const onClose =() => {
    tg.close()
  }
  
  

  const onSendData = useCallback(() => {
    console.log('h')
    tg.sendData(JSON.stringify({message: 'hello!'}))
  }, [])

  useEffect(()=>{tg.ready()}, [])
  useEffect(() => {tg.MainButton.show()})
  useEffect(() => {tg.onEvent('mainButtonClicked', onSendData)})
  
  return (
    <div className="App">
      <button onClick={onClose}>Закрыть</button>
      <Home/>
    </div>
  );
}

export default App;
