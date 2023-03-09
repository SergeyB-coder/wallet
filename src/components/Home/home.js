import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUserData } from './homeApi';
import { selectBalance, selectBalanceTRX, setAddress, setAddressTRX, setBalance, setBalanceTRX } from './homeSlice';
import { MenuButtons } from './menubuttons';
import { useTelegram } from '../../hooks/useTelegram';
import { svg_bep, svg_bep1, svg_binance, svg_tron } from '../../const/svgs';
// import { useNavigate } from 'react-router-dom';


export function Home() {
	const { user_id, chat_id, first_name } = useTelegram()

	const dispatch = useDispatch()
	// const navigate = useNavigate()

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
	}, [chat_id, dispatch, first_name, user_id]);

	useEffect(() => {
        tg.MainButton.hide()
		tg.BackButton.hide()
    }, );

	return (
		<div>
			{/* <h3>Hello!</h3> */}
			<div className='balance-label'>Ваш баланс</div>
			<div className='balance-main mt-2'><span className='balance-main-sign'>$</span>{Math.round((parseFloat(balance)+parseFloat(balance_trx))*1000)/1000}</div>
			<div className='bottom-balance mt-2'><span className='bottom-balance-percent'>+32%</span> +$400</div>
			<MenuButtons/>	

			<div style={{marginTop: 30}}>
				{/* <button onClick={() => {
					fromMain({user_id: user_id}, (d)=>{console.log('d', d)})
				}}>TEST</button> */}
			</div>

			<div className='mt-1' style={{color: 'var(--btn-bg-color)'}}>Manage token list</div>

			<div className='wallet-item-container mt-2'>
				<div className='wallet-item row'>
					<div className='wallet-item-svg-container'>
							{svg_bep1}
							<div style={{position: 'absolute', left: '55%', top: '40%'}}>
								{svg_binance}
							</div>
					</div>
					<div className='wallet-item-info ps-0'>
						<div className='token-text' style={{textAlign: 'left'}}>Tether BEP</div>
						<div className='token-balance-text mt-2'>{Math.round((parseFloat(balance))*100)/100} USDT</div>
					</div>
					<div className='wallet-item-info2'>
						<div className='token-text text-nowrap' style={{textAlign: 'right'}}>${Math.round((parseFloat(balance))*100*1.1)/100}</div>
						<div className='bottom-info text-nowrap mt-2'>+23%</div>
					</div>
				</div>
			</div>

			<div className='wallet-item-container'>
				<div className='wallet-item row'>
					<div style={{width: '5px'}}>

					</div>
					<div className='divider-token'>

					</div>
				</div>
			</div>
			

			<div className='wallet-item-container'>
				<div className='wallet-item row'>
					<div className='wallet-item-svg-container'>
							{svg_tron}
					</div>
					<div className='wallet-item-info ps-0'>
						<div className='token-text' style={{textAlign: 'left'}}>Tether TRC</div>
						<div className='token-balance-text mt-2'>{Math.round((parseFloat(balance_trx))*100)/100} USDT</div>
					</div>
					<div className='wallet-item-info2'>
						<div className='token-text text-nowrap' style={{textAlign: 'right'}}>${Math.round((parseFloat(balance_trx))*100*1.1)/100}</div>
						<div className='bottom-info text-nowrap mt-2'>+23%</div>
					</div>
				</div>
			</div>

			
		</div>
	);
}
