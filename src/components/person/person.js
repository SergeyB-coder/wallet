import React from 'react';
import { useTelegram } from '../../hooks/useTelegram';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useEffect } from 'react';
import { getOrders } from '../Ptp/market/marketApi';
import { svg_share } from '../../const/svgs';
import { getUserQDeals, parsePrice, setActiveOrder } from '../Ptp/ptpApi';
import { useDispatch, useSelector } from 'react-redux';
import { setBackStepCreateOrder } from '../Ptp/market/marketSlice';
import { selectPriceMarket, selectRubDollar, setComment, setCurrencyFiat, setCurrencyOrder, setLimitOrder, setMethodPay, setPercentPrice, setPrice, setPriceMarket, setPriceMarketTRX, setPriceType, setQuantityOrder, setRubDollar, setTypeOrder } from '../Ptp/ptpSlice';
import { setMethodsPay } from '../Ptp/settings_pay/settingsPaySlice';

const commission = 0.05

export function Person (props) {
    const { user_id, tg, first_name } = useTelegram()
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const [allOrderActive, setAllOrderActive] = useState(true);
    const [orders, setOrders] = useState([]);
    const [qDeals, setQDeals] = useState(0);

    const price_market = useSelector(selectPriceMarket)
    const rub_dollar = useSelector(selectRubDollar)

    const handleClickCreateOrder = () => {
        dispatch(setBackStepCreateOrder('person'))
        navigate('/createorder', {replace: true})
    }

    

    const handleClickSettingsPay = () => {
        navigate('/settingspay', {replace: true})
    }

    const backScreen = () => {
        navigate('/ptp', {replace: true})
        // navigate('/home', {replace: true})
    }

    function handleClickEditOrder (index) {
        dispatch(setPercentPrice(orders[index].percent_price))
        dispatch(setQuantityOrder(orders[index].quantity))
        dispatch(setLimitOrder(orders[index].limit_order))
        dispatch(setCurrencyFiat(orders[index].currency_fiat_id))
        dispatch(setCurrencyOrder(orders[index].currency_order))
        dispatch(setPrice(orders[index].price))
        // dispatch(setMethodPay(orders[index].method_pay))
        
        // const method_pay = useSelector(selectMethodPay)

        dispatch(setTypeOrder(orders[index].type))
        dispatch(setPriceType(orders[index].type_price_id))
        dispatch(setComment(orders[index].comment))
        // dispatch(setMethodsPay(orders[index].meth))
        navigate('/createorder', {replace: true})
        
    }

    const handleClickAllOrderActive = () => {
        setActiveOrder({user_id: user_id, value: !allOrderActive}, (data) => {
            console.log(data)
            getOrders({user_id: user_id}, (data) => {
                console.log('getOrders person', data)
                setOrders(data.orders)
            })
        })

        setAllOrderActive(!allOrderActive)
    }

    function handleClickRunOrder (index) {
        setActiveOrder({order_id: orders[index].id, value: true}, (data) => {
            console.log(data)
            getOrders({user_id: user_id}, (data) => {
                console.log('getOrders person', data)
                setOrders(data.orders)
            })
        })
    }

    
    function handleClickStopOrder (index) {
        setActiveOrder({order_id: orders[index].id, value: false}, (data) => {
            console.log(data)
            getOrders({user_id: user_id}, (data) => {
                console.log('getOrders person', data)
                setOrders(data.orders)
            })
        })
    }

    useEffect(() => {
        parsePrice({}, (data) => {
            dispatch(setPriceMarket(data.price_market))
            dispatch(setPriceMarketTRX(data.price_market_trx))
            dispatch(setRubDollar(data.rub_dollar))            
        })
    }, [dispatch]);
    
    useEffect(() => {
        getUserQDeals({user_id: user_id}, (data) => {
            if (data.res) setQDeals((data.q_deals.q_taker || 0)+(data.q_deals.q_maker || 0))
        })
    }, [user_id]);

    useEffect(() => {

        getOrders({user_id: user_id}, (data) => {
            console.log('getOrders person', data)
            setOrders(data.orders)
        })
    }, [user_id]);

    useEffect(() => {
        tg.MainButton.hide()
        tg.BackButton.show()
    }, [tg.BackButton, tg.MainButton]);

    useEffect(() => {
        tg.onEvent('backButtonClicked', backScreen)
            return () => {tg.offEvent('backButtonClicked', backScreen)}
        }, )

    return (
        <div className='container-center'>
            <div className='w-cntr'>
                <div className='container-title mt-20'>
                    <div className='title-text'>Личный кабинет</div>
                </div>

                <div className='h-cntr-person color-bg-cntr-person pt-26 mt-20'>
                    <div className='name-text'>{first_name}</div>

                    <div className='container-center'>
                        <div className='mini-text w-227'>
                            Это имя будет Вашим ID для всех операций на P2P Маркете.
                        </div>
                    </div>
                </div>

                <div className='row-2 mt-10'>
                    <div className='cntr-2 color-bg-cntr-person'>
                        <div className='num-text'>
                            {qDeals}
                        </div>
                        <div className='mini-text'>
                            Количество сделок
                        </div>
                    </div>
                    <div className='cntr-2 color-bg-cntr-person'>
                        <div className='num-text'>
                            84%
                        </div>
                        <div className='mini-text'>
                            Завершенные сделки
                        </div>
                    </div>
                </div>

                <div className='h-118 color-bg-cntr-person pt-9 mt-10'>

                    <div className='row-2 p-17 a-c h-47' onClick={handleClickSettingsPay}>
                        <div className='item-text'>
                            Настройка оплаты
                        </div>
                        <div>
                            <svg width="5" height="9" viewBox="0 0 5 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M5 4.5C5 4.76522 4.89464 5.01957 4.70711 5.20711L1.70711 8.20711C1.31658 8.59763 0.683416 8.59763 0.292892 8.20711C-0.0976318 7.81658 -0.0976317 7.18342 0.292893 6.79289L2.58579 4.5L0.292893 2.20711C-0.097631 1.81658 -0.0976315 1.18342 0.292893 0.792893C0.683417 0.402369 1.31658 0.402369 1.70711 0.792893L4.70711 3.79289C4.89464 3.98043 5 4.23478 5 4.5Z" fill="white"/>
                            </svg>
                        </div>
                    </div>

                    <div className='container-center'>
                        <div className='line'></div>
                    </div>

                    <div className='row-2 p-17 a-c h-47'>
                        <div className='item-text'>
                            Активность всех объявлений
                        </div>
                        {/* <div>
                            <div className={1 ? 'method-switch': 'method-switch-off'}
                                onClick={() => {}}
                            >
                                <div className={1 ? 'method-switch-circle':'method-switch-off-circle'}></div>
                            </div>
                        </div> */}

                        <div className=''>
                            <div className={allOrderActive ? 'method-switch anim-switch': 'method-switch-off anim-switch-off'}
                                onClick={handleClickAllOrderActive}
                            >
                                <div className={allOrderActive ? 'method-switch-circle anim-circle':'method-switch-off-circle anim-circle-b'}></div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='container-title mt-20'>
                    <div className='title-text'>Ваши объявления</div>
                </div>

                <div className='container-center mt-20'>
                    <div className='btn-add-method-pay'>
                        <div className='svg-add-method'>
                            <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M15 30C23.2843 30 30 23.2843 30 15C30 6.71573 23.2843 0 15 0C6.71573 0 0 6.71573 0 15C0 23.2843 6.71573 30 15 30ZM22 17.9251V13.0749H17.2752V8H11.7248V13.0749H7V17.9251H11.7248V23H17.2752V17.9251H22Z" fill="#86EFAC"/>
                            </svg>
                        </div>
                        <div className='btn-add-method-text' onClick={handleClickCreateOrder}>
                            Создать объявление
                        </div>
                    </div>
                </div>


                {
                    orders.slice(0, 5).map((order, index) => {
                        return (
                                <div 
                                    // style={
                                    //     (indexMethod !== 0 && companies_pay[indexMethod].id !== order.company_pay_id) || listFilterOrders[index] !== 1 || order.type !== typeOrderFilter ? {display: 'none'}: {}
                                    // } 
                                    className='order-item-user mt-3' key={order.id}
                                >
                                    <div className='order-header a-c'>
                                        <div className='order-price'>
                                            <div className='mt-2'>{order.price}
                                                {order.currency_fiat_id === 1 ? 'RUB': 'USD'}
                                            </div>
                                            <div className={order.type === 's' ? 'order-label':'mini-text-r'}>Цена за 1 {order.currency_id === 1 ? 'USDT BEP20': 'USDT TRC20'}</div>
                                        </div>
                                        
                                        <div className='container-center a-c'>
                                            {svg_share}
                                            <div className={order.type === 'b' ? 'order-sale ml-12': 'order-buy ml-12'} 
                                                onClick={() => {}}
                                            >
                                                    {order.type === 's' ? 'Купить': 'Продать'}
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
                                            3 сделки
                                        </span>
                                            67%
                                        </div>
                                    </div>

                                    <div className='order-line-container'>
                                        <div className='order-line'></div>
                                    </div>

                                    <div className='order-row-1'>
                                        <div className='order-label-2'>
                                            Доступно
                                        </div>
                                        <div className='order-info-3'>
                                            {order.quantity} USDT
                                        </div>
                                    </div>

                                    <div className='order-line-container'>
                                        <div className='order-line'></div>
                                    </div>

                                    <div className='order-row-1'>
                                        <div className='order-label-2'>
                                            Лимиты
                                        </div>
                                        <div className='order-info-3'>
                                        {`${ Math.round(1000*order.limit_order/(order.type_price_id === 1 ? order.price: price_market * (order.currency_fiat_id === 1 ? rub_dollar: 1) * order.percent_price/100))/1000} - ${order.quantity - commission} USDT`}<br></br>
                                        {`${order.limit_order} - ${ Math.round((order.quantity - commission)*order.price*1000)/1000 } ${order.currency_fiat_id === 1 ? 'Руб': '$'}`}
                                        </div>
                                    </div>

                                    <div className='order-line-container'>
                                        <div className='order-line'></div>
                                    </div>

                                    <div className='order-row-1'>
                                        <div className='order-label-2'>
                                            Сумма
                                        </div>
                                        <div className='order-info-3'>
                                            {'0.13 USDT'}
                                        </div>
                                    </div>

                                    <div className='order-line-container'>
                                        <div className='order-line'></div>
                                    </div>
                                    
                                    <div className='order-row-1'>
                                        <div className='order-label-2 t-a-l'>
                                            Методы оплаты
                                        </div>
                                        <div className='order-info-3'>
                                            {order.company}
                                        </div>
                                    </div>

                                    <div style={{display: 'flex', position: 'absolute', bottom: 0, alignItems: 'flex-end'}}>
                                        <div className='btn-edit'
                                            onClick={()=>handleClickEditOrder(index)}
                                        >
                                            Редактировать
                                        </div>
                                        {   order.active ?
                                            <div className='btn-run'
                                                onClick={()=>handleClickStopOrder(index)}
                                            >
                                                Остановить
                                            </div>:
                                            <div className='btn-run'
                                                onClick={()=>handleClickRunOrder(index)}
                                            >
                                                Запустить
                                            </div>
                                        }
                                    </div>
                                </div>
                        )
                    })
                }
            </div>
        </div>
      );
}

