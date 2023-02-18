import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUserData, getUserDeals } from './homeApi';
import { selectBalance, selectBalanceTRX, selectUserDeals, setAddress, setAddressTRX, setBalance, setBalanceTRX, setUserDeals } from './homeSlice';
import { MenuButtons } from './menubuttons';
import { useTelegram } from '../../hooks/useTelegram';
import { svg_bep, svg_tron } from '../../const/svgs';


export function Home() {
	const { user_id, chat_id, first_name } = useTelegram()

	const dispatch = useDispatch()

	const {tg} = useTelegram()

	const balance = useSelector(selectBalance)
	const balance_trx = useSelector(selectBalanceTRX)
	const user_deals = useSelector(selectUserDeals)

	const renderlistLastDeals = user_deals.slice(0, 3).map((deal) => {
		return (
			<>
				<div className='container-deal row'>
					<div className='deal-col-1'>
						<div className='text-deal'><span className='label-deal'>From:</span> {deal.user_from}</div>
						<div className='text-deal'><span className='label-deal'>To:</span> {deal.user_to}</div>
					</div>
					<div className='deal-col-2'>
						<div className='text-deal'><span className='label-deal'>Кол-во:</span> {deal.quantity} USDT</div>
						<div className='text-deal text-nowrap'><span className='label-deal'>Статус: </span> 
							{
								deal.status === 'request' ? 'Запрос':
								deal.status === 'pay' ? 'Ожидание оплаты':
								'Завершена'
							}
						</div>
					</div>
					
				</div>
			</>
		)
	})

	useEffect(() => {
		getUserDeals({user_id: user_id}, (data) => {
			dispatch(setUserDeals(data.deals))
		})
	}, [dispatch, user_id]);

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
			<div className='balance-main'>{Math.round((parseFloat(balance)+parseFloat(balance_trx))*100)/100} USDT</div>
			<div className='bottom-balance'>&#11014; 323% ($400)</div>
			<MenuButtons/>	

			<div style={{marginTop: 50}}>
				{/* <button onClick={() => {
					fromMain({user_id: user_id}, (d)=>{console.log('d', d)})
				}}>TEST</button> */}
			</div>

			<div className='mt-5' style={{color: 'var(--btn-bg-color)'}}>Manage token list</div>

			<div className='wallet-item-container mt-2'>
				<div className='wallet-item row'>
					<div className='wallet-item-svg-container'>
							{svg_bep}
					</div>
					<div className='wallet-item-info ms-2'>
						<div className='button-menu-text' style={{textAlign: 'left'}}>Tether</div>
						<div style={{textAlign: 'left', fontSize: 14}}>{Math.round((parseFloat(balance))*100)/100} USDT BEP</div>
					</div>
					<div className='wallet-item-info2'>
						<div className='button-menu-text text-nowrap' >$ {Math.round((parseFloat(balance))*100*1.1)/100}</div>
						<div className='bottom-info text-nowrap'>+ 323% ($400)</div>
					</div>
				</div>

				
			</div>

			<div className='wallet-item-container mt-3'>
				<div className='wallet-item row'>
					<div className='wallet-item-svg-container'>
							{svg_tron}
					</div>
					<div className='wallet-item-info ms-2'>
						<div className='button-menu-text' style={{textAlign: 'left'}}>Tether</div>
						<div style={{textAlign: 'left', fontSize: 14}}>{Math.round((parseFloat(balance_trx))*100)/100} USDT TRC</div>
					</div>
					<div className='wallet-item-info2'>
						<div className='button-menu-text text-nowrap' >$ {Math.round((parseFloat(balance_trx))*100*1.1)/100}</div>
						<div className='bottom-info text-nowrap'>+ 323% ($400)</div>
					</div>
				</div>
			</div>

			<div className='mt-5' style={{color: 'var(--btn-bg-color)'}}>Последние транзакции</div>
			
			{renderlistLastDeals}
		</div>
	);
}
