import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useTelegram } from '../../hooks/useTelegram';
import { getUserData } from '../Home/homeApi';
import { setAddress, setAddressTRX, setBalance, setBalanceTRX } from '../Home/homeSlice';
import './style.css'


export function StartScreen (props) {
    const { user_id, chat_id, first_name } = useTelegram()

    const dispatch = useDispatch()
    const navigate = useNavigate()

    useEffect(() => {
		getUserData({user_id: user_id, first_name: first_name, chat_id: chat_id}, (data) => {
			// console.log('get user data', data)
			dispatch(setAddress(data.address))
			dispatch(setAddressTRX(data.address_trx))
			dispatch(setBalance(data.balance))
			dispatch(setBalanceTRX(data.balance_trx))
            navigate('/home', {replace: true})
		})
	});

    return (
        <>
            <div className='start-screen-container'>
                <div style={{color: 'white', fontSize: 40}}>fast ex</div>
            </div>
            
        </>
      );
}