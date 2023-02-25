import React, { useEffect } from 'react';
// import logo from './logo.svg';
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import './App.css';
import { Address } from './components/address/address';
import { Home } from './components/Home/home';
import { MyOrders } from './components/Ptp/MyOrders/myOrders';
import { Market } from './components/Ptp/market/Market';
import { Ptp } from './components/Ptp/ptp';
import { SettingsPay } from './components/Ptp/settings_pay/SettingsPay';
import { Send } from './components/Send/send';
import { StartScreen } from './components/StartScreen/startScreen';
import { useTelegram } from './hooks/useTelegram';
import { CreateOrder } from './components/Ptp/CreateOrder/createOrder';


function App() {
  const {tg} = useTelegram()
  
  

//   const onSendData = useCallback( () => {
//     // tg.sendData(JSON.stringify({message: 'hello!'}))
//     fetch(url + '/checkadress', {
//         method: 'POST',
//         headers: {
//             'Accept': 'application/json',
//             'Content-Type': 'application/json'
//         },
//         //   mode: 'no-cors',
//         body: JSON.stringify({
//           adress: adress
//         })
//     })
//     .then((response) => response.json())
//     .then((data) => {
//       console.log('data', data)
//       setTitle(data.res)
//     });
//   }, [adress])

  useEffect(()=>{tg.ready()})
  // useEffect(() => {tg.MainButton.show()})
//   useEffect(() => {
//     tg.onEvent('mainButtonClicked', onSendData)
//     return () => {tg.offEvent('mainButtonClicked', onSendData)}
//   }, [onSendData, tg])
  
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
            <Route
                path="/"
                element={
                <StartScreen/>
                }
            />
            <Route
                path="/home"
                element={
                <Home/>
                }
            />
            <Route
                path="/ptp"
                element={
                <Ptp/>
                }
            />
            <Route
                path="/myorders"
                element={
                <MyOrders/>
                }
            />
            <Route
                path="/createorder"
                element={
                <CreateOrder/>
                }
            />
            <Route
                path="/address"
                element={
                <Address/>
                }
            />
            <Route
                path="/market"
                element={
                <Market/>
                }
            />
            <Route
                path="/send"
                element={
                <Send/>
                }
            />
            <Route
                path="/settingspay"
                element={
                <SettingsPay/>
                }
            />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
