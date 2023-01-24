import React from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// window.Telegram.WebApp

export function Home(props) {
  const setBalance = props.setBalance
  const balance = props.balance
  return (
    <div>
      <p>Hello!</p>
      <input placeholder='adress' onChange={(e) => {setBalance(e.target.value)}} value={balance}/>
    </div>
  );
}
