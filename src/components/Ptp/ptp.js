import React, { useState } from 'react';
import { CreateOrder1 } from './createorder1';
import { TradeMenu } from './trademenu';
// import { useSelector, useDispatch } from 'react-redux';
// window.Telegram.WebApp

export function Ptp(props) {
  const [screen, setScreen] = useState('menu') 
  return (
    <div className='p-4'>
      {/* <h3>P2P</h3> */}
      {screen === 'menu' && <TradeMenu setScreen={setScreen}/>}
      {screen === 'createorder1' && <CreateOrder1/>}
    </div>
  );
}
