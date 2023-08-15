import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getBalance, getUserData } from './homeApi';
import { selectBalance, selectBalanceTRX, selectBalanceTRXv, selectBalanceV, selectFirstRun, selectNameUser, setAddress, setAddressTRX, setBalance, setBalanceTRX, setBalanceTRXv, setBalanceV, setFirstRun, setNameUser } from './homeSlice';
import { MenuButtons } from './menubuttons';
import { useTelegram } from '../../hooks/useTelegram';
import { svg_bep1, svg_binance, svg_btc, svg_tron1 } from '../../const/svgs';
import { useState } from 'react';
import { Transactions } from './transactions';
import { parsePrice } from '../Ptp/ptpApi';
import { selectPriceMarket, selectPriceMarketTRX, setPriceMarket, setPriceMarketTRX, setRubDollar } from '../Ptp/ptpSlice';
// import { Timer } from '../Common/timerDeal';
// import { useNavigate } from 'react-router-dom';


export function Home() {
	const { user_id, chat_id, first_name } = useTelegram()

	const dispatch = useDispatch()
	// const navigate = useNavigate()

	const {tg} = useTelegram()

	const balance = useSelector(selectBalance)
	const balance_v = useSelector(selectBalanceV)
	const balance_trx = useSelector(selectBalanceTRX)
	const balance_trx_v = useSelector(selectBalanceTRXv)
	const name_user = useSelector(selectNameUser)

	const price_market = useSelector(selectPriceMarket)
	const price_market_trx = useSelector(selectPriceMarketTRX)
    // const rub_dollar = useSelector(selectRubDollar)
	const first_run = useSelector(selectFirstRun)

	const [isLoadData, setIsLoadData] = useState(first_run);
	const [showTransactions, setShowTransactions] = useState(false);
	const [isHide, setIsHide] = useState(!first_run);

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
		getBalance({user_id: user_id}, (data) => {
			console.log('getBalance', data)
			setIsHide(true)
			dispatch(setBalance(data.balance_bep))
			dispatch(setBalanceV(data.balance_bep_v))
			dispatch(setBalanceTRX(data.balance_trx))
			dispatch(setBalanceTRXv(data.balance_trx_v))
			dispatch(setNameUser(data.name_user))
			setTimeout(() => {setIsLoadData(false)}, 400)
		})
		getUserData({user_id: user_id, first_name: first_name, chat_id: chat_id}, (data) => {
			setIsHide(true)
			console.log('get user data', data)
			dispatch(setFirstRun(false))
			dispatch(setAddress(data.address))
			dispatch(setAddressTRX(data.address_trx))
			dispatch(setBalance(data.balance))
			dispatch(setBalanceV(data.balance_v))
			dispatch(setBalanceTRX(data.balance_trx))
			dispatch(setBalanceTRXv(data.balance_trx_v))
			dispatch(setNameUser(data.name_user))
			setTimeout(() => {setIsLoadData(false)}, 400)
			
		})
	}, [chat_id, dispatch, first_name, user_id]);


	useEffect(() => {
        parsePrice({}, (data) => {
            dispatch(setPriceMarket(data.price_market))
            dispatch(setPriceMarketTRX(data.price_market_trx))
            dispatch(setRubDollar(data.rub_dollar))            
        })
    }, [dispatch]);

	useEffect(() => {
        tg.MainButton.hide()
		// tg.BackButton.hide()
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
						<div className='d-flex justify-content-center '>
							<div className='row d-flex justify-content-between align-items-center mt-30 title-balance' >
								<div className='balance-label'>Ваш баланс</div>
								<div className='bottom-balance'>
									{name_user}
									{/* <span className='bottom-balance-percent'>+32%</span> */}
								</div>
							</div>
						</div>
						
						<div className='d-flex justify-content-center position-relative'>
							{
							isLoadData && 
							// <div className={`balance-load ${isHide ? 'hide-balace-load': 'gradient-back'}`}></div>
							<>
								<div className={`wallet-item-load-1 ${isHide ? 'hide-balace-load': 'anim-load-inv'}`}></div>
								<div className={`wallet-item-load-2 ${isHide ? 'hide-balace-load': 'anim-load'}`}></div>
							</>
							}
							{/* <div className={`balance-load hide-balace-load ${isLoadData ? '': 'hide-balace-load'}`}></div> */}
							{!isLoadData  && <div className='balance-main'><span className='balance-main-sign'>$</span>{Math.round(parseFloat(((balance + balance_v + balance_trx + balance_trx_v) || 0))*1000)/1000}</div>}
						</div>
						
						{isLoadData && <div className={`home-container-balance-load ${isHide ? 'grow-hide': ''}`}></div>}
					</div>
					
					<MenuButtons/>	

					<div className='d-flex justify-content-center'>
						<div className='text-token-manage'>Управление токенами</div>
					</div>
					

					<div className='wallet-item-container mt-21'>
						<div className='wallet-item row' onClick={handleClickBep}>
							{isHide && 
								<>
									<div className='wallet-item-svg-container'>
										{svg_bep1}
										<div style={{position: 'absolute', left: '55%', top: '40%'}}>
											{svg_binance}
										</div>
									</div>
									<div className='wallet-item-info ps-0'>
										<div className='token-text text-nowrap' style={{textAlign: 'left'}}>Tether BEP</div>
										<div className='token-balance-text mt-2 text-nowrap'>{Math.round((parseFloat(balance + balance_v))*100)/100} USDT</div>
									</div>
									<div className='wallet-item-info2'>
										<div className='token-balance-text2 text-nowrap' style={{textAlign: 'right'}}>${Math.round((parseFloat((balance || 0) + balance_v))*100*price_market)/100}</div>
										{/* <div className='bottom-info text-nowrap mt-2'>+23%</div> */}
									</div>
								</>
							}
						</div>

						{	isLoadData &&
							// <div className={`wallet-item-load ${isHide ? 'hide-balace-load': 'gradient'}`}>

							// </div>
							<>
								<div className={`wallet-item-load-1 ${isHide ? 'hide-balace-load': 'anim-load'}`}></div>
								<div className={`wallet-item-load-2 ${isHide ? 'hide-balace-load': 'anim-load-inv'}`}></div>
							</>
							
						}
					</div>

					

					<div className='wallet-item-container mt-16'>
						<div className='wallet-item row' onClick={handleClickTrc}>
							{	isHide &&
								<>
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
									<div className='token-balance-text2 text-nowrap' style={{textAlign: 'right'}}>${Math.round((parseFloat(balance_trx + balance_trx_v || 0))*100*price_market_trx)/100}</div>
									{/* <div className='bottom-info text-nowrap mt-2'>+23%</div> */}
								</div>
								</>
							}
						</div>

						{	isLoadData &&
							// <div className={`wallet-item-load ${isHide ? 'hide-balace-load': 'gradient-back'}`}>

							// </div>
							<>
								<div className={`wallet-item-load-1 ${isHide ? 'hide-balace-load': 'anim-load-inv'}`}></div>
								<div className={`wallet-item-load-2 ${isHide ? 'hide-balace-load': 'anim-load'}`}></div>
							</>
						}
					</div>


					<div className='wallet-item-container mt-16'>
						<div className='wallet-item row' onClick={()=>{}}>
							{	isHide &&
								<>
									<div className='wallet-item-svg-container'>
										{svg_btc}
									</div>
									<div className='wallet-item-info ps-0'>
										<div className='token-text text-nowrap' style={{textAlign: 'left', color: '#A8A196'}}>Bitcoin</div>
										<div className='token-balance-text mt-2' style={{color: '#A8A196'}}>0 BTC</div>
									</div>
									<div className='wallet-item-info2'>
										<div className='token-balance-text2 text-nowrap' style={{textAlign: 'right', color: '#A8A196'}}>$0</div>
										{/* <div className='bottom-info text-nowrap mt-2'>+23%</div> */}
									</div>
								</>
							}
						</div>

						{	isLoadData &&
							// <div className={`wallet-item-load ${isHide ? 'hide-balace-load': 'gradient'}`}>

							// </div>
							<>
								<div className={`wallet-item-load-1 ${isHide ? 'hide-balace-load': 'anim-load'}`}></div>
								<div className={`wallet-item-load-2 ${isHide ? 'hide-balace-load': 'anim-load-inv'}`}></div>
							</>
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
