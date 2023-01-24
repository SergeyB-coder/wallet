import React, { useCallback, useEffect, useState } from 'react';
// import logo from './logo.svg';
import './App.css';
import { Home } from './components/home';
import { url } from './const/urls';
import { useTelegram } from './hooks/useTelegram';


function App() {
  const {tg} = useTelegram()
  const [title, setTitle] = useState(0)
  const [adress, setAdress] = useState('')
  
  

  const onSendData = useCallback( () => {
    console.log('adress', adress)
    // tg.sendData(JSON.stringify({message: 'hello!'}))
    fetch(url + '/checkadress', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        //   mode: 'no-cors',
        body: JSON.stringify({
          adress: adress
        })
    })
    .then((response) => response.json())
    .then((data) => {
      console.log('data', data)
      setTitle(data.res)
    });
  }, [adress])

  useEffect(()=>{tg.ready()})
  useEffect(() => {tg.MainButton.show()})
  useEffect(() => {
    tg.onEvent('mainButtonClicked', onSendData)
    return () => {tg.offEvent('mainButtonClicked', onSendData)}
  }, [onSendData, tg])
  
  return (
    <div className="App">
      {/* <button onClick={onClose}>Закрыть</button> */}
      <h4>{title}</h4>
      <Home setAdress={setAdress} adress={adress}/>
    </div>
  );
}

export default App;
