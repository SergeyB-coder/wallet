import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUserData } from './homeApi';
import { selectBalance, selectBalanceTRX, selectBalanceTRXv, setAddress, setAddressTRX, setBalance, setBalanceTRX, setBalanceTRXv } from './homeSlice';
import { MenuButtons } from './menubuttons';
import { useTelegram } from '../../hooks/useTelegram';
import { svg_bep1, svg_binance, svg_btc, svg_tron1 } from '../../const/svgs';
import { useState } from 'react';
import { Transactions } from './transactions';
// import { useNavigate } from 'react-router-dom';


export function Home() {
	const { user_id, chat_id, first_name } = useTelegram()

	const dispatch = useDispatch()
	// const navigate = useNavigate()

	const {tg} = useTelegram()

	const balance = useSelector(selectBalance)
	const balance_trx = useSelector(selectBalanceTRX)
	const balance_trx_v = useSelector(selectBalanceTRXv)

	const [isLoadData, setIsLoadData] = useState(true);
	const [showTransactions, setShowTransactions] = useState(false);
	const [isHide, setIsHide] = useState(false);

	const handleClickBep = () => {
		setShowTransactions(true)
		tg.BackButton.show()
	}

	const handleClickTrc = () => {
		setShowTransactions(true)
		tg.BackButton.show()
	}

	const backScreen = () => {
		tg.BackButton.hide()
		setShowTransactions(false)
	}

	useEffect(() => {
		getUserData({user_id: user_id, first_name: first_name, chat_id: chat_id}, (data) => {
			setIsHide(true)
			console.log('get user data', data)
			dispatch(setAddress(data.address))
			dispatch(setAddressTRX(data.address_trx))
			dispatch(setBalance(data.balance))
			dispatch(setBalanceTRX(data.balance_trx))
			dispatch(setBalanceTRXv(data.balance_trx_v))
			
			setTimeout(() => {setIsLoadData(false)}, 1000)
			
		})
	}, [chat_id, dispatch, first_name, user_id]);

	useEffect(() => {
        tg.MainButton.hide()
		tg.BackButton.hide()
    }, );

	useEffect(() => {
        tg.onEvent('backButtonClicked', backScreen)
            return () => {tg.offEvent('backButtonClicked', backScreen)}
        }, )

	return (
		<>
			{	!showTransactions &&
				<div>
					{/* <h3>Hello!</h3> */}
					<div className={`home-container-balance ${isHide && 'grow'} ${isLoadData ? 'h-205': 'h-230'}`}>
						<div className='d-flex justify-content-center'>
							<div className='row d-flex justify-content-between align-items-center mt-30 title-balance' >
								<div className='balance-label'>Ваш баланс</div>
								<div className='bottom-balance'>
									+$400
									<span className='bottom-balance-percent'>+32%</span>
								</div>
							</div>
						</div>
						
						<div className='d-flex justify-content-center'>
							{isLoadData && <div className={`balance-load ${isHide ? 'hide-balace-load': 'gradient'}`}></div>}
							{/* <div className={`balance-load hide-balace-load ${isLoadData ? '': 'hide-balace-load'}`}></div> */}
							{!isLoadData && <div className='balance-main'><span className='balance-main-sign'>$</span>{Math.round(parseFloat(balance + balance_trx + balance_trx_v)*1000)/1000}</div>}
						</div>
						
						{isLoadData && <div className={`home-container-balance-load ${isHide ? 'hide-balace-load': ''}`}>2</div>}
					</div>
					
					<MenuButtons/>	

					<div className='d-flex justify-content-center'>
						<div className='text-token-manage'>Управление токенами</div>
					</div>
					

					<div className='wallet-item-container mt-21'>
						<div className='wallet-item row' onClick={handleClickBep}>
							<div className='wallet-item-svg-container'>
								{svg_bep1}
								<div style={{position: 'absolute', left: '55%', top: '40%'}}>
									{svg_binance}
								</div>
							</div>
							<div className='wallet-item-info ps-0'>
								<div className='token-text text-nowrap' style={{textAlign: 'left'}}>Tether BEP</div>
								<div className='token-balance-text mt-2'>{Math.round((parseFloat(balance))*100)/100} USDT</div>
							</div>
							<div className='wallet-item-info2'>
								<div className='token-text text-nowrap' style={{textAlign: 'right'}}>${Math.round((parseFloat(balance))*100*1.1)/100}</div>
								<div className='bottom-info text-nowrap mt-2'>+23%</div>
							</div>
						</div>

						{	isLoadData &&
							<div className={`wallet-item-load ${isHide ? 'hide-balace-load': 'gradient'}`}>

							</div>
						}
					</div>

					

					<div className='wallet-item-container mt-16'>
						<div className='wallet-item row' onClick={handleClickTrc}>
							<div className='wallet-item-svg-container'>
								{svg_bep1}
								<div style={{position: 'absolute', left: '55%', top: '40%'}}>
									{svg_tron1}
								</div>
							</div>
							<div className='wallet-item-info ps-0'>
								<div className='token-text text-nowrap' style={{textAlign: 'left'}}>Tether TRC</div>
								<div className='token-balance-text mt-2'>{Math.round((parseFloat(balance_trx + balance_trx_v))*100)/100} USDT</div>
							</div>
							<div className='wallet-item-info2'>
								<div className='token-balance-text2 text-nowrap' style={{textAlign: 'right'}}>${Math.round((parseFloat(balance_trx))*100*1.1)/100}</div>
								<div className='bottom-info text-nowrap mt-2'>+23%</div>
							</div>
						</div>

						{	isLoadData &&
							<div className={`wallet-item-load ${isHide ? 'hide-balace-load': 'gradient'}`}>

							</div>
						}
					</div>


					<div className='wallet-item-container mt-16'>
						<div className='wallet-item row' onClick={handleClickTrc}>
							<div className='wallet-item-svg-container'>
								{svg_btc}
								{/* <div style={{position: 'absolute', left: '55%', top: '40%'}}>
									{svg_tron1}
								</div> */}
							</div>
							<div className='wallet-item-info ps-0'>
								<div className='token-text text-nowrap' style={{textAlign: 'left'}}>Bitcoin</div>
								<div className='token-balance-text mt-2'>1 BTC</div>
							</div>
							<div className='wallet-item-info2'>
								<div className='token-text text-nowrap' style={{textAlign: 'right'}}>${Math.round((parseFloat(balance_trx))*100*1.1)/100}</div>
								<div className='bottom-info text-nowrap mt-2'>+23%</div>
							</div>
						</div>

						{	isLoadData &&
							<div className={`wallet-item-load ${isHide ? 'hide-balace-load': 'gradient'}`}>

							</div>
						}
					</div>

					
				</div>
			}

			{	showTransactions &&

				<div className='p-2'>
					<Transactions/>
				</div>
			}
		</>
	);
}
