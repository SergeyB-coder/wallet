import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fromMain, getUserData } from './homeApi';
import { selectBalance, selectBalanceTRX, setAddress, setAddressTRX, setBalance, setBalanceTRX } from './homeSlice';
import { MenuButtons } from './menubuttons';
import { useTelegram } from '../../hooks/useTelegram';
import { svg_ethereum } from '../../const/svgs';


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
			{/* <h3>Hello!</h3> */}
			<div className='balance-main'>{Math.round((parseFloat(balance)+parseFloat(balance_trx))*100)/100} USDT</div>
			<div className='bottom-balance'>&#11014; 323% ($400)</div>
			<MenuButtons/>	

			<div style={{marginTop: 50}}>
				{/* <button onClick={() => {
					fromMain({user_id: user_id}, (d)=>{console.log('d', d)})
				}}>TEST</button> */}
			</div>

			<div className='wallet-item-container'>
				<div className='wallet-item row'>
					<div className='wallet-item-svg-container'>
							{svg_ethereum}
					</div>
					<div className='wallet-item-info ms-2'>
						<div className='button-menu-text' style={{textAlign: 'left'}}>Tether</div>
						<div style={{textAlign: 'left', fontSize: 14}}>{Math.round((parseFloat(balance))*100)/100} USDT BEP</div>
					</div>
					<div className='wallet-item-info2'>
						<div className='button-menu-text text-nowrap' >$ {Math.round((parseFloat(balance))*100*70)/100}</div>
						<div className='bottom-info text-nowrap'>+ 323% ($400)</div>
					</div>
				</div>

				
			</div>

			<div className='wallet-item-container mt-3'>
				<div className='wallet-item row'>
					<div className='wallet-item-svg-container'>
							{svg_ethereum}
					</div>
					<div className='wallet-item-info ms-2'>
						<div className='button-menu-text' style={{textAlign: 'left'}}>Tether</div>
						<div style={{textAlign: 'left', fontSize: 14}}>{Math.round((parseFloat(balance))*100)/100} USDT TRC</div>
					</div>
					<div className='wallet-item-info2'>
						<div className='button-menu-text text-nowrap' >$ {Math.round((parseFloat(balance))*100*70)/100}</div>
						<div className='bottom-info text-nowrap'>+ 323% ($400)</div>
					</div>
				</div>
			</div>

			<div className='mt-5' style={{color: 'var(--btn-bg-color)'}}>Manage token list</div>
			
		</div>
	);
}
