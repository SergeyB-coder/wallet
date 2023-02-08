import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUserData } from './homeApi';
import { selectBalance, selectBalanceTRX, setAddress, setAddressTRX, setBalance, setBalanceTRX } from './homeSlice';
import { MenuButtons } from './menubuttons';
import { useTelegram } from '../../hooks/useTelegram';


export function Home() {
	const { user_id, chat_id, first_name } = useTelegram()

	const dispatch = useDispatch()

	const {tg} = useTelegram()

	const balance = useSelector(selectBalance)
	const balance_trx = useSelector(selectBalanceTRX)

	useEffect(() => {
		getUserData({user_id: user_id, first_name: first_name, chat_id: chat_id}, (data) => {
			console.log('get user data', data)
			dispatch(setAddress(data.address))
			dispatch(setAddressTRX(data.address_trx))
			dispatch(setBalance(data.balance))
			dispatch(setBalanceTRX(data.balance_trx))
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
				Ваш баланс:
			</div>	
			<div> {balance} USDT BEP</div>
			<div> {balance_trx} USDT TRC</div>
		</div>
	);
}
