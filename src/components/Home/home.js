import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { activateAccount, createWalletBit, getBalance, getTransactions, getUserData } from './homeApi';
import { selectBalance, selectBalanceTRX, selectBalanceTRXv, selectBalanceV, selectFirstRun, selectNameUser, setAddress, setAddressBTC, setAddressTRX, setBalance, setBalanceBTC, setBalanceTRX, setBalanceTRXv, setBalanceV, setFirstRun, setNameUser } from './homeSlice';
import { MenuButtons } from './menubuttons';
import { useTelegram } from '../../hooks/useTelegram';
import { svg_bep1, svg_binance, svg_btc, svg_tron1 } from '../../const/svgs';
import { useState } from 'react';
import { Transactions } from './transactions';
import { parsePrice } from '../Ptp/ptpApi';
import { selectPriceMarket, selectPriceMarketBTC, selectPriceMarketBTCh, selectPriceMarketTRX, selectPriceMarketTRXh, setPriceMarket, setPriceMarketBTC, setPriceMarketBTCh, setPriceMarketTRX, setPriceMarketTRXh, setRubDollar } from '../Ptp/ptpSlice';
import { dictionary } from '../../const/dictionary';


export function Home() {
	const { user_id, chat_id, first_name, language_code } = useTelegram()

	const dispatch = useDispatch()
	// const navigate = useNavigate()

	const { tg, init_data } = useTelegram()

	const balance = useSelector(selectBalance)
	const balance_v = useSelector(selectBalanceV)
	const balance_trx = useSelector(selectBalanceTRX)
	const balance_trx_v = useSelector(selectBalanceTRXv)
	const name_user = useSelector(selectNameUser)

	const price_market = useSelector(selectPriceMarket)
	const price_market_trx = useSelector(selectPriceMarketTRX)
	const price_market_trx_h = useSelector(selectPriceMarketTRXh)

	const price_market_btc = useSelector(selectPriceMarketBTC)
	const price_market_btc_h = useSelector(selectPriceMarketBTCh)

	const delta_usdt = price_market_trx_h !== 0 ? Math.round(((price_market_trx - price_market_trx_h) / price_market_trx_h) * 10000) / 100 : 0
	const delta_btc = price_market_trx_h !== 0 ? Math.round(((price_market_btc - price_market_btc_h) / price_market_btc_h) * 10000) / 100 : 0
	// const rub_dollar = useSelector(selectRubDollar)
	const first_run = useSelector(selectFirstRun)

	const [isLoadData, setIsLoadData] = useState(first_run);
	const [showTransactions, setShowTransactions] = useState(false);
	const [isHide, setIsHide] = useState(!first_run);

	const [transactions, setTransactions] = useState([]);

	//labels
	const yourbalance = language_code === 'ru' ? dictionary.home.balance.ru : dictionary.home.balance.en
	const token_management = language_code === 'ru' ? dictionary.home.token_management.ru : dictionary.home.token_management.en


	const handleClickBep = () => {
		getTransactions({ user_id: user_id, token: 'bep' }, (data) => {
			setTransactions(data.transactions)
		})
		setShowTransactions(true)
		tg.BackButton.show()
	}

	const handleClickTrc = () => {
		getTransactions({ user_id: user_id, token: 'trx' }, (data) => {
			console.log('getTransactions', data.transactions)
			setTransactions(data.transactions)
		})
		setShowTransactions(true)
		tg.BackButton.show()
	}

	const backScreen = () => {
		tg.BackButton.hide()
		setShowTransactions(false)
	}

	useEffect(() => {
		console.log('language_code ', language_code)
	}, [language_code]);

	useEffect(() => {
		// console.log('init_data', init_data, user_id)

		// const local_balance = localStorage.getItem('balance')
		// const local_balance_v = localStorage.getItem('balance_v')
		// const local_balance_trx = localStorage.getItem('balance_trx')
		// const local_balance_trx_v = localStorage.getItem('balance_trx_v')
		// const local_name_user = localStorage.getItem('name_user')


		// dispatch(setBalance(local_balance))
		// dispatch(setBalanceV(local_balance_v))
		// dispatch(setBalanceTRX(local_balance_trx))
		// dispatch(setBalanceTRXv(local_balance_trx_v))
		// dispatch(setNameUser(local_name_user))

		// const price_market = localStorage.getItem('price_market')
		// const price_market_trx = localStorage.getItem('price_market_trx')
		// const rub_dollar = localStorage.getItem('rub_dollar')
		// dispatch(setPriceMarket(price_market || 0))
		// dispatch(setPriceMarketTRX(price_market_trx || 0))
		// dispatch(setRubDollar(rub_dollar || 0))
		// Функция для проверки и приведения значения к числу
		const validateNumber = (value, defaultValue = 0) => {
			const number = parseFloat(value);
			return isNaN(number) ? defaultValue : number;
		};

		// Функция для проверки и приведения значения к строке
		const validateString = (value, defaultValue = '') => {
			return value ?? defaultValue;
		};

		// Получение значений из localStorage
		const local_balance = localStorage.getItem('balance');
		const local_balance_v = localStorage.getItem('balance_v');
		const local_balance_trx = localStorage.getItem('balance_trx');
		const local_balance_trx_v = localStorage.getItem('balance_trx_v');
		const local_name_user = localStorage.getItem('name_user');
		const price_market = localStorage.getItem('price_market');
		const price_market_trx = localStorage.getItem('price_market_trx');
		const rub_dollar = localStorage.getItem('rub_dollar');

		// Проверка и диспетчеризация значений
		dispatch(setBalance(validateNumber(local_balance)));
		dispatch(setBalanceV(validateNumber(local_balance_v)));
		dispatch(setBalanceTRX(validateNumber(local_balance_trx)));
		dispatch(setBalanceTRXv(validateNumber(local_balance_trx_v)));
		dispatch(setNameUser(validateString(local_name_user)));

		dispatch(setPriceMarket(validateNumber(price_market)));
		dispatch(setPriceMarketTRX(validateNumber(price_market_trx)));
		dispatch(setRubDollar(validateNumber(rub_dollar)));



		getBalance({ user_id: user_id, init_data: init_data }, (data) => {
			console.log('getBalance', data)
			setIsHide(true)
			dispatch(setBalance(data.balance_bep))
			dispatch(setBalanceV(data.balance_bep_v))
			dispatch(setBalanceTRX(data.balance_trx))
			dispatch(setBalanceTRXv(data.balance_trx_v))
			dispatch(setNameUser(data.name_user))
			setIsLoadData(false)
			// setTimeout(() => {setIsLoadData(false)}, 400)
		})
		getUserData({ user_id: user_id, first_name: first_name, chat_id: chat_id, is_visit: true }, (data) => {
			setIsHide(true)
			console.log('get user data', data)
			dispatch(setFirstRun(false))
			dispatch(setAddress(data.address))
			dispatch(setAddressTRX(data.address_trx))
			dispatch(setAddressBTC(data.address_btc))
			dispatch(setBalance(data.balance))
			dispatch(setBalanceV(data.balance_v))
			dispatch(setBalanceTRX(data.balance_trx))
			dispatch(setBalanceBTC(1))
			// dispatch(setBalanceBTC(data.balance_btc))
			dispatch(setBalanceTRXv(data.balance_trx_v))
			dispatch(setNameUser(data.name_user))
			localStorage.setItem('name_user', data.name_user)

			localStorage.setItem('balance', data.balance)
			localStorage.setItem('balance_v', data.balance_v)
			localStorage.setItem('balance_trx', data.balance_trx)
			localStorage.setItem('balance_trx_v', data.balance_trx_v)
			setTimeout(() => { setIsLoadData(false) }, 400)

		})
	}, [chat_id, dispatch, first_name, init_data, user_id]);


	useEffect(() => {
		parsePrice({}, (data) => {
			if (!data.res) return
			dispatch(setPriceMarket(data.price_market))
			dispatch(setPriceMarketTRX(data.price_market_trx))
			dispatch(setRubDollar(data.rub_dollar))

			dispatch(setPriceMarketTRXh(data.prices_h && isNaN(data.prices_h) ? data.prices_h.usdt : 0))

			dispatch(setPriceMarketBTC(data.res_btc.data.last))
			dispatch(setPriceMarketBTCh(data.prices_h.btc))

			localStorage.setItem('price_market', data.price_market)
			localStorage.setItem('price_market_trx', data.price_market_trx)
			localStorage.setItem('rub_dollar', data.rub_dollar)
		})
	}, [dispatch]);

	useEffect(() => {
		tg.MainButton.hide()
		// tg.BackButton.hide()
	},);

	useEffect(() => {
		tg.onEvent('backButtonClicked', backScreen)
		return () => { tg.offEvent('backButtonClicked', backScreen) }
	},)

	useEffect(() => {
		activateAccount({ address_trx: 'TBs551svwG3hjowbd4n1JgAxtLMB7qJvoT' }, () => { })
	}, []);

	// const handleTouchMove = (e) => {
		// if (window.Telegram.WebApp) {
		  // Предотвращаем свайп вниз
		//   e.preventDefault();
		// }
	//   };

	useEffect(() => {
        tg.expand()
		// window.addEventListener('touchmove', handleTouchMove, { passive: false });
    }, [tg]);

	return (
		<>
			{!showTransactions &&
				<div>
					{/* <h3>Hello!</h3> */}
					{/* <div className={`home-container-balance ${isHide && 'grow'} ${isLoadData ? 'h-205' : 'h-230'}`}> */}
					<div className='home-container-balance h-230'>
						<div className='d-flex justify-content-center '>
							<div className='row d-flex justify-content-between align-items-center mt-30 title-balance' >
								<div className='balance-label' onClick={() => createWalletBit((d) => { })}>{yourbalance}</div>
								<div className='bottom-balance'>
									{name_user}
									{/* <span className='bottom-balance-percent'>+32%</span> */}
								</div>
							</div>
						</div>

						<div className='d-flex justify-content-center position-relative'>
							{/* {
								isLoadData &&
								
								<>
									<div className={`wallet-item-load-1 ${isHide ? 'hide-balace-load' : 'anim-load-inv'}`}></div>
									<div className={`wallet-item-load-2 ${isHide ? 'hide-balace-load' : 'anim-load'}`}></div>
								</>
							} */}

							{/* {!isLoadData && <div className='balance-main'><span className='balance-main-sign'>$</span>{Math.round(parseFloat(((balance + balance_v + balance_trx + balance_trx_v) || 0)) * 1000) / 1000}</div>} */}
							<div className='balance-main'><span className='balance-main-sign'>$</span>{Math.round((parseFloat(balance || 0) + parseFloat(balance_v || 0) + parseFloat(balance_trx || 0) + parseFloat(balance_trx_v || 0)) * 100) / 100}</div>
						</div>

						{/* {isLoadData && <div className={`home-container-balance-load ${isHide ? 'grow-hide' : ''}`}></div>} */}
					</div>

					<MenuButtons />

					<div className='d-flex justify-content-center'>
						<div className='text-token-manage'>{token_management}</div>
					</div>


					<div className='wallet-item-container mt-21'>
						<div className='wallet-item row' onClick={handleClickBep}>
							{isHide &&
								<>
									<div className='wallet-item-svg-container'>
										{svg_bep1}
										<div style={{ position: 'absolute', left: '55%', top: '40%' }}>
											{svg_binance}
										</div>
									</div>
									<div className='wallet-item-info ps-0'>
										<div className='token-text text-nowrap' style={{ textAlign: 'left' }}>Tether BEP</div>
										<div className='token-balance-text mt-2 text-nowrap'>
											{Math.round((parseFloat(price_market_trx || 0)) * 100) / 100} $ <span className={delta_usdt >= 0 ? 'green_delta' : 'red_delta'}>{delta_usdt >= 0 ? '  +' : '  -'}{Math.abs(delta_usdt)}%</span>
										</div>
									</div>
									<div className='wallet-item-info2'>
										<div className='token-balance-text2 mt-2 text-nowrap'>{Math.round((parseFloat(balance || 0 + balance_v || 0)) * 100) / 100} USDT</div>
										<div className='token-balance-text text-nowrap' style={{ textAlign: 'right' }}>${Math.round(((parseFloat(balance) || 0) + (parseFloat(balance_v) || 0)) * 100 * (parseFloat(price_market) || 0)) / 100}</div>
										{/* <div className='bottom-info text-nowrap mt-2'>+23%</div> */}
									</div>
								</>
							}
						</div>

						{isLoadData &&
							// <div className={`wallet-item-load ${isHide ? 'hide-balace-load': 'gradient'}`}>

							// </div>
							<>
								<div className={`wallet-item-load-1 ${isHide ? 'hide-balace-load' : 'anim-load'}`}></div>
								<div className={`wallet-item-load-2 ${isHide ? 'hide-balace-load' : 'anim-load-inv'}`}></div>
							</>

						}
					</div>



					<div className='wallet-item-container mt-16'>
						<div className='wallet-item row' onClick={handleClickTrc}>
							{isHide &&
								<>
									<div className='wallet-item-svg-container'>
										{svg_bep1}
										<div style={{ position: 'absolute', left: '55%', top: '40%' }}>
											{svg_tron1}
										</div>
									</div>
									<div className='wallet-item-info ps-0'>
										<div className='token-text text-nowrap' style={{ textAlign: 'left' }}>Tether TRC</div>
										<div className='token-balance-text mt-2 text-nowrap'>
											{Math.round((parseFloat(price_market_trx || 0)) * 100) / 100} $ <span className={delta_usdt >= 0 ? 'green_delta' : 'red_delta'}>{delta_usdt >= 0 ? '  +' : '  -'}{Math.abs(delta_usdt)}%</span>
										</div>
									</div>
									<div className='wallet-item-info2'>
										<div className='token-balance-text2 mt-2'>{Math.round((parseFloat(balance_trx || 0) + parseFloat(balance_trx_v || 0)) * 100) / 100} USDT</div>
										<div className='token-balance-text text-nowrap' style={{ textAlign: 'right' }}>${(Math.round((parseFloat(balance_trx || 0) + parseFloat(balance_trx_v || 0)) * 100 * price_market_trx)) / 100}</div>
										{/* <div className='bottom-info text-nowrap mt-2'>+23%</div> */}
									</div>
								</>
							}
						</div>

						{isLoadData &&
							// <div className={`wallet-item-load ${isHide ? 'hide-balace-load': 'gradient-back'}`}>

							// </div>
							<>
								<div className={`wallet-item-load-1 ${isHide ? 'hide-balace-load' : 'anim-load-inv'}`}></div>
								<div className={`wallet-item-load-2 ${isHide ? 'hide-balace-load' : 'anim-load'}`}></div>
							</>
						}
					</div>


					<div className='wallet-item-container mt-16'>
						<div className='wallet-item row' onClick={() => { }}>
							{isHide &&
								<>
									<div className='wallet-item-svg-container'>
										{svg_btc}
									</div>
									<div className='wallet-item-info ps-0'>
										<div className='token-text text-nowrap' style={{ textAlign: 'left', color: '#A8A196' }}>Bitcoin</div>
										<div className='token-balance-text mt-2 text-nowrap'>
											{Math.round((parseFloat(price_market_btc || 0)) * 100) / 100} $ <span className={delta_btc >= 0 ? 'green_delta' : 'red_delta'}>{delta_btc >= 0 ? '  +' : '  -'}{Math.abs(delta_btc)}%</span>
										</div>

									</div>
									<div className='wallet-item-info2'>
										<div className='token-balance-text2 mt-2' >0 BTC</div>
										<div className='token-balance-text text-nowrap' style={{ textAlign: 'right', color: '#A8A196' }}>$0</div>
										{/* <div className='bottom-info text-nowrap mt-2'>+23%</div> */}
									</div>
								</>
							}
						</div>

						{isLoadData &&
							// <div className={`wallet-item-load ${isHide ? 'hide-balace-load': 'gradient'}`}>

							// </div>
							<>
								<div className={`wallet-item-load-1 ${isHide ? 'hide-balace-load' : 'anim-load'}`}></div>
								<div className={`wallet-item-load-2 ${isHide ? 'hide-balace-load' : 'anim-load-inv'}`}></div>
							</>
						}
					</div>


				</div>
			}

			{showTransactions &&

				<div className='p-2'>
					<Transactions transactions={transactions} />
				</div>
			}
		</>
	);
}
