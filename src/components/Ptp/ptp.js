import React from 'react';
import { TradeMenu } from './trademenu';
// import { useSelector, useDispatch } from 'react-redux';
// window.Telegram.WebApp

export function Ptp(props) {
  return (
    <div className='p-4'>
      <h3>P2P</h3>
      <TradeMenu/>
    </div>
  );
}
