import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { CURRENCY_FIAT_LIST, CURRENCY_LIST, METHOD_PAY_LIST } from '../../../const/devdata';
import { useTelegram } from '../../../hooks/useTelegram';
import { Selecter } from '../../Common/selecter';
import { getOrders } from './marketApi';
import { selectOrders, setOrders } from './marketSlice';
import { ScreenBuy } from './screenBuy';

import './style.css'


export function Market() {
    const {tg} = useTelegram()

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const orders = useSelector(selectOrders)

    const [marketScreen, setMarketScreen] = useState('orders') // buy 
    const [buyOrder, setBuyOrder] = useState(null)
    const [currencyFiat, setCurrencyFiat] = useState(1)
    const [currencyNum, setCurrencyNum] = useState(1)
    
    const [listFilterOrders, setListFilterOrders] = useState([])
    

    const backScreen = (() => {
        navigate('/ptp', {replace: true})
    })

    function handleClickBuy (order) {
        setBuyOrder(order)
        setMarketScreen('buy')
    }

    function handleChangeCurrency(index) {
        setCurrencyNum(index+1)
        let newListFilterOrders = listFilterOrders.slice()
        orders.forEach((order, i) => {
            if (order.currency_id === (index+1)) newListFilterOrders[i] = 1
            else newListFilterOrders[i] = 0
        });
        setListFilterOrders(newListFilterOrders)
    }

    function handleChangeCurrencyFiat(index) {
        setCurrencyFiat(index+1)
        let newListFilterOrders = listFilterOrders.slice()
        orders.forEach((order, i) => {
            if (order.currency_fiat_id === (index+1)) newListFilterOrders[i] = 1
            else newListFilterOrders[i] = 0
        });
        setListFilterOrders(newListFilterOrders)
    }

    const divider = 
        <div className='divider-order'></div>
    
    useEffect(() => {
        getOrders({user_id: ''}, (data) => {
            dispatch(setOrders(data.orders))
            const filter_orders = new Array(data.orders.length).fill(1)
            setListFilterOrders(filter_orders)
        })
    }, [dispatch]);

    useEffect(() => {
        tg.MainButton.hide()
        tg.BackButton.show()
    }, [tg.BackButton, tg.MainButton]);

    useEffect(() => {
        tg.onEvent('backButtonClicked', backScreen)
            return () => {tg.offEvent('backButtonClicked', backScreen)}
        }, )

    return (
        <div className='market-container'>

            {marketScreen === 'orders' && 
                <div className='row d-flex justify-content-between'>
                    <div className='filter-item'>
                        <Selecter 
                            list_values={METHOD_PAY_LIST} 
                            class_name={'select-currency text-nowrap'} 
                            setIndex={() => {}} 
                            selected_value={currencyFiat}
                        />
                    </div>
                    <div className='filter-item'>
                        <Selecter 
                            list_values={CURRENCY_LIST} 
                            class_name={'select-currency text-nowrap'} 
                            setIndex={handleChangeCurrency} 
                            selected_value={currencyNum}
                        />
                    </div>
                    <div className='filter-item'>
                        <Selecter 
                            list_values={CURRENCY_FIAT_LIST} 
                            class_name={'select-currency text-nowrap'} 
                            setIndex={handleChangeCurrencyFiat} 
                            selected_value={currencyFiat}
                        />
                    </div>
                </div>
            }

            {marketScreen === 'orders' && 
                orders.map((order, index) => {
                    return (
                            <div style={listFilterOrders[index] !== 1 ? {display: 'none'}: {}} className='order-item mt-3' key={order.id}>
                                <div className='row mb-3 '>
                                    <div className='order-price'>
                                        <div className='order-price mt-2'>{order.price}
                                             {order.currency_fiat_id === '1' ? 'RUB': 'USD'}
                                        </div>
                                        <div className='order-label'>{order.currency_id === 1 ? 'Token USDT BEP20': 'Token USDT TRC'}</div>
                                    </div>
                                    

                                    <div className='order-buy mt-4' onClick={() => {handleClickBuy(order)}}>Купить</div>
                                </div>
                                {divider}

                                <div className='row mt-1'>
                                    <div className='order-user-name'>
                                        {order.first_name}
                                    </div>
                                    <div className='order-info'>
                                        Заявок 0
                                    </div>
                                </div>

                                <div className='row mt-3'>
                                    <div className='order-label'>
                                        Доступно
                                    </div>
                                    <div className='order-info'>
                                        {order.quantity} USDT
                                    </div>
                                </div>

                                <div className='row mt-3'>
                                    <div className='order-label'>
                                        Лимиты
                                    </div>
                                    <div className='order-info'>
                                        {order.limit_order} USDT
                                    </div>
                                </div>
                                
                                <div className='row mt-3'>
                                    <div className='order-label'>
                                        Методы оплаты
                                    </div>
                                    <div className='order-info'>
                                        Raiffeisen
                                    </div>
                                </div>
                            </div>
                    )
                })
            }

            {marketScreen === 'buy' && <ScreenBuy buyOrder={buyOrder} setMarketScreen={setMarketScreen}/>}
        </div>
    );
}
