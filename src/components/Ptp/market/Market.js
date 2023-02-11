import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useTelegram } from '../../../hooks/useTelegram';
import { getOrders } from './marketApi';
import { selectOrders, setOrders } from './marketSlice';
import { ScreenBuy } from './screenBuy';
import { ScreenDeal } from './screenDeal';

import './style.css'


export function Market() {
    const {tg} = useTelegram()

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const orders = useSelector(selectOrders)

    const [marketScreen, setMarketScreen] = useState('orders') // buy1 buy2
    const [buyOrder, setBuyOrder] = useState(null)

    const backScreen = (() => {
        navigate('/', {replace: true})
    })

    function handleClickBuy (order) {
        setBuyOrder(order)
        setMarketScreen('buy1')
    }

    const divider = 
        <div className='divider-order'></div>
    
    useEffect(() => {
        getOrders({user_id: ''}, (data) => {
            dispatch(setOrders(data.orders))
        })
    }, [dispatch]);

    useEffect(() => {
        tg.MainButton.hide()
        tg.BackButton.show()
    }, );

    useEffect(() => {
        tg.onEvent('backButtonClicked', backScreen)
            return () => {tg.offEvent('backButtonClicked', backScreen)}
        }, )

    return (
        <div className='market-container'>
            Market

            {marketScreen === 'orders' && 
                orders.map((order) => {
                    return (
                        <>
                            <div className='order-item mt-3' key={order.id}>
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
                            
                        </>
                    )
                })
            }

            {marketScreen === 'buy1' && <ScreenBuy buyOrder={buyOrder} setMarketScreen={setMarketScreen}/>}
            {marketScreen === 'deal' && <ScreenDeal />}
        </div>
    );
}
