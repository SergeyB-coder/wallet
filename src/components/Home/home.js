import React from 'react';
import { MenuButtons } from './menubuttons';
// import { useSelector, useDispatch } from 'react-redux';
// window.Telegram.WebApp

export function Home() {
  return (
    <div>
      <h3>Hello!</h3>
      {/* <input className='home-input' placeholder='adress' onChange={(e) => {setAdress(e.target.value)}} value={adress}/> */}
      <MenuButtons/>
      
    </div>
  );
}
