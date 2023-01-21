import React, { useEffect } from 'react';
// import logo from './logo.svg';
import './App.css';
import { Home } from './components/home';
const tg = window.Telegram.WebApp

function App() {
  const onClose =() => {
    tg.close()
  }
  
  const onSend =() => {
    tg.sendData(JSON.stringify({message: 'hello!'}))
  }
  useEffect(()=>{tg.ready()}, [])
  useEffect(() => {tg.MainButton.show()})
  return (
    <div className="App">
      <button onClick={onClose}>Закрыть</button>
      <Home/>
      <button className='btn-send' onClick={onSend}>Send</button>
    </div>
  );
}

export default App;
