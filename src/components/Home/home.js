import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUserData } from './homeApi';
import { selectBalance, setAddress, setBalance } from './homeSlice';
import { MenuButtons } from './menubuttons';
import { useTelegram } from '../../hooks/useTelegram';


export function Home() {
	const { user_id, chat_id, first_name } = useTelegram()

	const dispatch = useDispatch()

	const {tg} = useTelegram()

	const balance = useSelector(selectBalance)

	useEffect(() => {
		getUserData({user_id: user_id, first_name: first_name, chat_id: chat_id}, (data) => {
			console.log('get user data', data)
			dispatch(setAddress(data.address))
			dispatch(setBalance(data.balance))
		})
	});

	useEffect(() => {
        tg.MainButton.hide()
		tg.BackButton.hide()
    }, );

	return (
		<div>
			<h3>Hello!</h3>
			<MenuButtons/>	
			<div className='mt-5'>
				Ваш баланс {balance} USDT
			</div>	
		</div>
	);
}
