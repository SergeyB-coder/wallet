import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { CURRENCY_FIAT_LIST, CURRENCY_LIST } from '../../../const/devdata';
import { useTelegram } from '../../../hooks/useTelegram';
import { Selecter } from '../../Common/selecter';
import { getCompaniesPay } from '../settings_pay/settingsPayApi';
import { getOrders } from './marketApi';
import { selectBuyOrder, selectCompaniesPay, selectMarketScreen, selectOrders, setBuyOrder, setCompaniesPay, setMarketScreen, setOrders, setQuantityOrders } from './marketSlice';
import { ScreenBuy } from './screenBuy';

import './style.css'
import { svg_share } from '../../../const/svgs';
import { parsePrice } from '../ptpApi';
import { selectPriceMarket, selectRubDollar, setPriceMarket, setPriceMarketTRX, setRubDollar } from '../ptpSlice';
import { dictionary } from '../../../const/dictionary';


export function Market() {
    const commission = 0.05
    const { tg, language_code } = useTelegram()

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const orders = useSelector(selectOrders)
    const companies_pay = useSelector(selectCompaniesPay)

    const price_market = useSelector(selectPriceMarket)
    const rub_dollar = useSelector(selectRubDollar)

    const marketScreen = useSelector(selectMarketScreen)
    // const quantity_orders = useSelector(selectQuantityOrders)
    // const [buyOrder, setBuyOrder] = useState(null)
    const buyOrder = useSelector(selectBuyOrder)
    const [currencyFiat, setCurrencyFiat] = useState(1)
    const [currencyNum, setCurrencyNum] = useState(1)
    const [typeOrderFilter, setTypeOrderFilter] = useState('s')
    const [indexMethod, setIndexMethod] = useState(0);

    const [listFilterOrders, setListFilterOrders] = useState([])

    const [filter_quantity, setFilter_quantity] = useState('')

    const [currentSelecter, setCurrentSelecter] = useState(''); //currency, fiat

    const [showMethodsPay, setShowMethodsPay] = useState(false);


    //labels
    const market_label = language_code === 'ru' ? dictionary.p2p.market.ru: dictionary.p2p.market.en
    const buy_label = language_code === 'ru' ? dictionary.market.buy.ru: dictionary.market.buy.en
    const sale_label = language_code === 'ru' ? dictionary.market.sale.ru: dictionary.market.sale.en
    const all = language_code === 'ru' ? dictionary.market.all.ru: dictionary.market.all.en
    const qty = language_code === 'ru' ? dictionary.market.qty.ru: dictionary.market.qty.en
    const price_per = language_code === 'ru' ? dictionary.market.price_per.ru: dictionary.market.price_per.en
    const transactions = language_code === 'ru' ? dictionary.market.transactions.ru: dictionary.market.transactions.en
    const available = language_code === 'ru' ? dictionary.market.available.ru: dictionary.market.available.en
    const limits = language_code === 'ru' ? dictionary.market.limits.ru: dictionary.market.limits.en
    const payment_methods = language_code === 'ru' ? dictionary.market.payment_methods.ru: dictionary.market.payment_methods.en

    const backScreen = (() => {
        if (marketScreen === 'select_method') dispatch(setMarketScreen('orders'))
        else if (marketScreen === 'buy') {
            if (showMethodsPay) setShowMethodsPay(false)
            else dispatch(setMarketScreen('orders'))
        }
        else navigate('/ptp', { replace: true })
    })

    function handleClickBuy(order) {
        dispatch(setBuyOrder(order))
        dispatch(setMarketScreen('buy'))
    }

    function handleChangeCurrency(index) {
        setCurrencyNum(index + 1)
        let newListFilterOrders = listFilterOrders.slice()
        orders.forEach((order, i) => {
            if (order.currency_id === (index + 1)) newListFilterOrders[i] = 1
            else newListFilterOrders[i] = 0
        });
        setListFilterOrders(newListFilterOrders)
    }

    function handleChangeCurrencyFiat(index) {
        setCurrencyFiat(index + 1)
        let newListFilterOrders = listFilterOrders.slice()
        orders.forEach((order, i) => {
            if (order.currency_fiat_id === (index + 1)) newListFilterOrders[i] = 1
            else newListFilterOrders[i] = 0
        });
        setListFilterOrders(newListFilterOrders)

        setIndexMethod(0)
        getCompaniesPay({ fiat_id: index + 1 }, (data) => {
            // console.log('getCompaniesPay', data)
            dispatch(setCompaniesPay([{ name: all }, ...data.companies_pay]))
        })
    }

    const handleChangeFilterQuantity = (e) => {
        // console.log('handleChangeFilterQuantity', e.target.value)
        setFilter_quantity(e.target.value)
        let newListFilterOrders = listFilterOrders.fill(1)

        if (e.target.value !== '') {
            const q_filter = parseFloat(e.target.value)

            orders.forEach((order, i) => {
                // console.log(order.quantity, q_filter)
                if ((
                    order.limit_order / (
                        order.type_price_id !== 2 ?
                            order.price :
                            Math.round(price_market * (order.currency_fiat_id === 1 ? rub_dollar : 1) * order.percent_price) / 100
                    ) <= q_filter && q_filter <= order.quantity - commission
                ) && order.currency_id === currencyNum) newListFilterOrders[i] = 1
                else newListFilterOrders[i] = 0
            });
        }


        setListFilterOrders(newListFilterOrders)
    }

    const handleClickSelectMethod = () => {
        dispatch(setMarketScreen('select_method'))
    }

    function getSortedOrders(orders) {
        let arr = orders.slice()
        let price1 = 0
        let price2 = 0
        for (let i = 0; i < arr.length - 1; i++) {
            for (let j = i + 1; j < arr.length; j++) {
                price1 = (arr[i].type_price_id !== 2 ? arr[i].price / (arr[i].currency_fiat_id === 1 ? rub_dollar : 1) : price_market * arr[i].percent_price / 100)
                price2 = (arr[j].type_price_id !== 2 ? arr[j].price / (arr[j].currency_fiat_id === 1 ? rub_dollar : 1) : price_market * arr[j].percent_price / 100)


                if (price2 < price1) {
                    const obj = arr[i]
                    arr[i] = arr[j]
                    arr[j] = obj
                }

            }
        }
        return arr
    }

    function getSortedOrdersD(orders) {
        let arr = orders.slice()
        let price1 = 0
        let price2 = 0
        for (let i = 0; i < arr.length - 1; i++) {
            for (let j = i + 1; j < arr.length; j++) {
                price1 = (arr[i].type_price_id !== 2 ? arr[i].price / (arr[i].currency_fiat_id === 1 ? rub_dollar : 1) : price_market * arr[i].percent_price / 100)
                price2 = (arr[j].type_price_id !== 2 ? arr[j].price / (arr[j].currency_fiat_id === 1 ? rub_dollar : 1) : price_market * arr[j].percent_price / 100)


                if (price2 > price1) {
                    const obj = arr[i]
                    arr[i] = arr[j]
                    arr[j] = obj
                }

            }
        }
        return arr
    }

    const divider =
        <div className='divider-order-market'></div>

    useEffect(() => {
        let filter_orders = new Array(orders.length).fill(1)
        setListFilterOrders(filter_orders)

        parsePrice({}, (data) => {
            dispatch(setPriceMarket(data.price_market))
            dispatch(setPriceMarketTRX(data.price_market_trx))
            dispatch(setRubDollar(data.rub_dollar))
            getOrders({ user_id: '' }, (data) => {
                // console.log('useEffect')
                const sorted_orders = getSortedOrders(data.orders)
                dispatch(setOrders(sorted_orders))
                
                dispatch(setQuantityOrders(data.orders.length))

            })
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch]);

    useEffect(() => {
        getCompaniesPay({ fiat_id: currencyFiat }, (data) => {
            // console.log('getCompaniesPay', data)
            dispatch(setCompaniesPay([{ name: all }, ...data.companies_pay]))
        })
    }, [all, currencyFiat, dispatch]);

    // useEffect(() => {

    // }, [dispatch]);

    // useEffect(() => {
    //     handleChangeCurrency(0)
    // }, [handleChangeCurrency]);

    useEffect(() => {
        tg.MainButton.hide()
        tg.BackButton.show()
    }, [tg.BackButton, tg.MainButton]);

    useEffect(() => {
        tg.onEvent('backButtonClicked', backScreen)
        return () => { tg.offEvent('backButtonClicked', backScreen) }
    },)

    return (
        <div className='d-flex justify-content-center'>
            <div className='market-container'>

                {marketScreen === 'orders' &&
                    <>
                        <div className='container-filter-sale-buy'>
                            <div className='text-market'>
                                {market_label}
                            </div>

                            <div className='container-buy-sale'>
                                <div className='filter-sale-buy-item'
                                    onClick={() => {
                                        dispatch(setOrders(getSortedOrders(orders)))
                                        setTypeOrderFilter('s')
                                    }}
                                >
                                    <div className={`selected-item-buy buy-sale-text ${typeOrderFilter === 's' && 'is_active'}`}>{buy_label}</div>
                                </div>
                                <div className='filter-sale-buy-item'
                                    onClick={() => {
                                        dispatch(setOrders(getSortedOrdersD(orders)))
                                        setTypeOrderFilter('b')
                                    }}
                                >
                                    <div className={`selected-item-sale buy-sale-text ${typeOrderFilter === 'b' && 'is_active'}`}>{sale_label}</div>
                                </div>
                            </div>
                        </div>

                        <div className='row d-flex justify-content-between mt-2 p-0 m-0'>
                            <div className='filter-item-company text-nowrap' onClick={handleClickSelectMethod}>
                                {/* <Selecter 
                                    list_values={METHOD_PAY_LIST} 
                                    class_name={'select-currency text-nowrap'} 
                                    setIndex={() => {}} 
                                    selected_value={currencyFiat}
                                /> */}
                                <div className='filter-item-company-text'>{companies_pay[indexMethod]?.name}</div>
                                <div>
                                    <svg width="8" height="14" viewBox="0 0 8 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path fill-rule="evenodd" clip-rule="evenodd" d="M4 0C4.26522 5.96046e-08 4.51957 0.105357 4.70711 0.292893L7.70711 3.29289C8.09763 3.68342 8.09763 4.31658 7.70711 4.70711C7.31658 5.09763 6.68342 5.09763 6.29289 4.70711L4 2.41421L1.70711 4.70711C1.31658 5.09763 0.683417 5.09763 0.292893 4.70711C-0.0976311 4.31658 -0.097631 3.68342 0.292893 3.29289L3.29289 0.292893C3.48043 0.105357 3.73478 0 4 0ZM0.292893 9.29289C0.683417 8.90237 1.31658 8.90237 1.70711 9.29289L4 11.5858L6.29289 9.29289C6.68342 8.90237 7.31658 8.90237 7.70711 9.29289C8.09763 9.68342 8.09763 10.3166 7.70711 10.7071L4.70711 13.7071C4.31658 14.0976 3.68342 14.0976 3.29289 13.7071L0.292893 10.7071C-0.0976311 10.3166 -0.0976311 9.68342 0.292893 9.29289Z" fill="white" />
                                    </svg>
                                </div>
                            </div>

                            <div className='filter-item-fiat position-relative'>
                                <Selecter
                                    list_values={CURRENCY_FIAT_LIST}
                                    class_name={'filter-item-fiat text-nowrap'}
                                    setIndex={handleChangeCurrencyFiat}
                                    selected_value={currencyFiat}
                                    is_show={currentSelecter === 'fiat'}
                                    setSelecter={() => setCurrentSelecter('fiat')}
                                />
                                <div>
                                    <svg width="8" height="14" viewBox="0 0 8 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path fill-rule="evenodd" clip-rule="evenodd" d="M4 0C4.26522 5.96046e-08 4.51957 0.105357 4.70711 0.292893L7.70711 3.29289C8.09763 3.68342 8.09763 4.31658 7.70711 4.70711C7.31658 5.09763 6.68342 5.09763 6.29289 4.70711L4 2.41421L1.70711 4.70711C1.31658 5.09763 0.683417 5.09763 0.292893 4.70711C-0.0976311 4.31658 -0.097631 3.68342 0.292893 3.29289L3.29289 0.292893C3.48043 0.105357 3.73478 0 4 0ZM0.292893 9.29289C0.683417 8.90237 1.31658 8.90237 1.70711 9.29289L4 11.5858L6.29289 9.29289C6.68342 8.90237 7.31658 8.90237 7.70711 9.29289C8.09763 9.68342 8.09763 10.3166 7.70711 10.7071L4.70711 13.7071C4.31658 14.0976 3.68342 14.0976 3.29289 13.7071L0.292893 10.7071C-0.0976311 10.3166 -0.0976311 9.68342 0.292893 9.29289Z" fill="white" />
                                    </svg>
                                </div>
                            </div>

                        </div>

                        <div className='row d-flex justify-content-between mt-2 p-0 m-0'>

                            <div className='filter-item-currency position-relative'>
                                {/* <div className='p-0 m-0 h-100'> */}
                                <svg width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="4" cy="4" r="4" fill="#34D399" />
                                </svg>
                                {/* </div> */}
                                <Selecter
                                    list_values={CURRENCY_LIST}
                                    class_name={'filter-item-currency text-nowrap'}
                                    setIndex={handleChangeCurrency}
                                    selected_value={currencyNum}
                                    is_show={currentSelecter === 'currency'}
                                    setSelecter={() => setCurrentSelecter('currency')}
                                />


                                <svg width="8" height="14" viewBox="0 0 8 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path fill-rule="evenodd" clip-rule="evenodd" d="M4 0C4.26522 5.96046e-08 4.51957 0.105357 4.70711 0.292893L7.70711 3.29289C8.09763 3.68342 8.09763 4.31658 7.70711 4.70711C7.31658 5.09763 6.68342 5.09763 6.29289 4.70711L4 2.41421L1.70711 4.70711C1.31658 5.09763 0.683417 5.09763 0.292893 4.70711C-0.0976311 4.31658 -0.097631 3.68342 0.292893 3.29289L3.29289 0.292893C3.48043 0.105357 3.73478 0 4 0ZM0.292893 9.29289C0.683417 8.90237 1.31658 8.90237 1.70711 9.29289L4 11.5858L6.29289 9.29289C6.68342 8.90237 7.31658 8.90237 7.70711 9.29289C8.09763 9.68342 8.09763 10.3166 7.70711 10.7071L4.70711 13.7071C4.31658 14.0976 3.68342 14.0976 3.29289 13.7071L0.292893 10.7071C-0.0976311 10.3166 -0.0976311 9.68342 0.292893 9.29289Z" fill="white" />
                                </svg>
                            </div>

                            <div className='filter-item-quantity position-relative'>
                                <input className='filter-input' type='number' placeholder={qty} onChange={handleChangeFilterQuantity} value={filter_quantity} />
                            </div>
                        </div>
                    </>
                }

                


                {marketScreen === 'orders' &&
                    orders.map((order, index) => {
                        return (
                            <div
                                style={
                                    (indexMethod !== 0 && companies_pay[indexMethod].id !== order.company_pay_id) || listFilterOrders[index] !== 1 || order.type !== typeOrderFilter ? { display: 'none' } : {}
                                }
                                className='order-item mt-3' key={order.id}
                            >
                                <div className='order-header a-c'>
                                    <div className='order-price'>
                                        <div className='mt-2'>
                                            {order.type_price_id !== 2 ? order.price : Math.round(price_market * (order.currency_fiat_id === 1 ? rub_dollar : 1) * order.percent_price) / 100}
                                            {/* {order.currency_fiat_id === 1 ? 'RUB' : 'USD'} */}
                                            {CURRENCY_FIAT_LIST[order.currency_fiat_id - 1] || ''}
                                        </div>
                                        <div className={order.type === 's' ? 'order-label' : 'mini-text-r'}>{price_per} 1 {order.currency_id === 1 ? 'USDT BEP20' : 'USDT TRC20'}</div>
                                    </div>

                                    <div className='container-center a-c'>
                                        {svg_share}
                                        <div className={order.type === 'b' ? 'order-sale ml-12' : 'order-buy ml-12'}
                                            onClick={() => { handleClickBuy(order) }}
                                        >
                                            {order.type === 's' ? buy_label : sale_label}
                                        </div>
                                    </div>
                                </div>
                                {/* {divider} */}

                                <div className='order-row-1'>
                                    <div className='order-user-name'>
                                        {order.first_name}
                                    </div>

                                    <div className='order-info-2'>
                                        <span className='order-info-1'>
                                            {(order.q_deals_maker || 0) + (order.q_deals_taker || 0)} {transactions}
                                        </span>
                                        {Math.round(100 * ((order.q_deals_cancel_maker || 0) + (order.q_deals_cancel_taker || 0)) / ((order.q_deals_maker || 0) + (order.q_deals_taker || 0))) || 0} %
                                    </div>
                                </div>

                                <div className='order-line-container'>
                                    <div className='order-line'></div>
                                </div>

                                <div className='order-row-1'>
                                    <div className='order-label-2'>
                                        {available}
                                    </div>
                                    <div className='order-info-3'>
                                        {order.quantity} USDT
                                    </div>
                                </div>

                                <div className='order-line-container'>
                                    <div className='order-line'></div>
                                </div>

                                <div className='order-row-1 h-30'>
                                    <div className='order-label-2'>
                                        {limits}
                                    </div>
                                    <div className='order-info-3'>
                                        {`${Math.round(1000 * order.limit_order / (order.type_price_id !== 2 ? order.price : price_market * (order.currency_fiat_id === 1 ? rub_dollar : 1) * order.percent_price / 100)) / 1000} - ${Math.round(100 * (order.quantity - commission)) / 100} USDT`}<br></br>
                                        {`${order.limit_order} - ${Math.round((order.quantity - commission) * (order.type_price_id !== 2 ? order.price : price_market * (order.currency_fiat_id === 1 ? rub_dollar : 1) * order.percent_price / 100) * 1000) / 1000} ${order.currency_fiat_id === 1 ? 'Rub' : '$'}`}
                                    </div>
                                </div>

                                <div style={{ marginTop: '5px' }} className='order-line-container'>
                                    <div className='order-line'></div>
                                </div>

                                

                                <div className='order-row-1'>
                                    <div className='order-label-2'>
                                        {payment_methods}
                                    </div>
                                    <div className='order-info-3'>
                                        {order.company}
                                    </div>
                                </div>
                            </div>
                        )
                    })
                }

                {marketScreen === 'buy' && <ScreenBuy buyOrder={buyOrder} showMethodsPay={showMethodsPay} setShowMethodsPay={setShowMethodsPay} />}

                {marketScreen === 'select_method' &&
                    <div>
                        <label className='title-select-method'>Выберите способ оплаты</label>
                        <div className='currency-settings-container mt-3'>
                            {companies_pay.map((method, index) => {
                                return (
                                    <div key={index} >
                                        <div className='row button-trade-menu'
                                            onClick={() => {
                                                setIndexMethod(index)
                                                dispatch(setMarketScreen('orders'))
                                            }}
                                        >
                                            <div className='method-name-col'>
                                                {method.name}
                                            </div>
                                        </div>
                                        {index !== companies_pay.length - 1 && divider}
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                }

            </div>
        </div>
    );
}
