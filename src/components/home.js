import React from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// window.Telegram.WebApp

export function Home(props) {
  const setAdress = props.setAdress
  const adress = props.adress
  return (
    <div>
      <p>Hello!</p>
      <input placeholder='adress' onChange={(e) => {setAdress(e.target.value)}} value={adress}/>
    </div>
  );
}
