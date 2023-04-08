import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { CURRENCY_FIAT_LIST, CURRENCY_LIST } from '../../../const/devdata';
import { useTelegram } from '../../../hooks/useTelegram';
import { Selecter } from '../../Common/selecter';
import { getCompaniesPay } from '../settings_pay/settingsPayApi';
import { selectCompaniesPay, setCompaniesPay } from '../settings_pay/settingsPaySlice';
import { getOrders } from './marketApi';
import { selectOrders, setOrders } from './marketSlice';
import { ScreenBuy } from './screenBuy';

import './style.css'
import { svg_share } from '../../../const/svgs';


export function Market() {
    const {tg} = useTelegram()

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const orders = useSelector(selectOrders)
    const companies_pay = useSelector(selectCompaniesPay)

    const [marketScreen, setMarketScreen] = useState('orders') // buy //select_method_pay
    const [buyOrder, setBuyOrder] = useState(null)
    const [currencyFiat, setCurrencyFiat] = useState(1)
    const [currencyNum, setCurrencyNum] = useState(1)
    const [typeOrderFilter, setTypeOrderFilter] = useState('s')
    const [indexMethod, setIndexMethod] = useState(0);
    
    const [listFilterOrders, setListFilterOrders] = useState([])

    const [filter_quantity, setFilter_quantity] = useState('')
    
    const [currentSelecter, setCurrentSelecter] = useState(''); //currency, fiat

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

    const handleChangeFilterQuantity = (e) => {
        setFilter_quantity(e.target.value)

        let newListFilterOrders = listFilterOrders.slice()
        orders.forEach((order, i) => {
            console.log(order.quantity, parseFloat(e.target.value))
            if (order.quantity <= parseFloat(e.target.value) ) newListFilterOrders[i] = 1
            else newListFilterOrders[i] = 0
        });
        setListFilterOrders(newListFilterOrders)
    }

    const handleClickSelectMethod = () => {
        setMarketScreen('select_method')
    }

    const divider = 
        <div className='divider-order-market'></div>

    useEffect(() => {
        getCompaniesPay({}, (data) => {
            console.log('getCompaniesPay', data)
            dispatch(setCompaniesPay([{name: 'Все'}, ...data.companies_pay]))
        })
    }, [dispatch]);
    
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
        <div className='d-flex justify-content-center'>
            <div className='market-container'>

                {marketScreen === 'orders' && 
                    <>
                        <div className='container-filter-sale-buy'>
                            <div className='text-market'>
                                Маркет
                            </div>

                            <div className='container-buy-sale'>
                                <div className='filter-sale-buy-item'
                                    onClick={() => setTypeOrderFilter('s')}
                                >
                                    <div className={`selected-item-buy buy-sale-text ${typeOrderFilter === 's' && 'is_active'}`}>Купить</div>
                                </div>
                                <div className='filter-sale-buy-item'
                                    onClick={() => setTypeOrderFilter('b')}
                                >
                                    <div className={`selected-item-sale buy-sale-text ${typeOrderFilter === 'b' && 'is_active'}`}>Продать</div>
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
                                        <path fill-rule="evenodd" clip-rule="evenodd" d="M4 0C4.26522 5.96046e-08 4.51957 0.105357 4.70711 0.292893L7.70711 3.29289C8.09763 3.68342 8.09763 4.31658 7.70711 4.70711C7.31658 5.09763 6.68342 5.09763 6.29289 4.70711L4 2.41421L1.70711 4.70711C1.31658 5.09763 0.683417 5.09763 0.292893 4.70711C-0.0976311 4.31658 -0.097631 3.68342 0.292893 3.29289L3.29289 0.292893C3.48043 0.105357 3.73478 0 4 0ZM0.292893 9.29289C0.683417 8.90237 1.31658 8.90237 1.70711 9.29289L4 11.5858L6.29289 9.29289C6.68342 8.90237 7.31658 8.90237 7.70711 9.29289C8.09763 9.68342 8.09763 10.3166 7.70711 10.7071L4.70711 13.7071C4.31658 14.0976 3.68342 14.0976 3.29289 13.7071L0.292893 10.7071C-0.0976311 10.3166 -0.0976311 9.68342 0.292893 9.29289Z" fill="white"/>
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
                                    setSelecter={()=>setCurrentSelecter('fiat')}
                                />
                                <div>
                                    <svg width="8" height="14" viewBox="0 0 8 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path fill-rule="evenodd" clip-rule="evenodd" d="M4 0C4.26522 5.96046e-08 4.51957 0.105357 4.70711 0.292893L7.70711 3.29289C8.09763 3.68342 8.09763 4.31658 7.70711 4.70711C7.31658 5.09763 6.68342 5.09763 6.29289 4.70711L4 2.41421L1.70711 4.70711C1.31658 5.09763 0.683417 5.09763 0.292893 4.70711C-0.0976311 4.31658 -0.097631 3.68342 0.292893 3.29289L3.29289 0.292893C3.48043 0.105357 3.73478 0 4 0ZM0.292893 9.29289C0.683417 8.90237 1.31658 8.90237 1.70711 9.29289L4 11.5858L6.29289 9.29289C6.68342 8.90237 7.31658 8.90237 7.70711 9.29289C8.09763 9.68342 8.09763 10.3166 7.70711 10.7071L4.70711 13.7071C4.31658 14.0976 3.68342 14.0976 3.29289 13.7071L0.292893 10.7071C-0.0976311 10.3166 -0.0976311 9.68342 0.292893 9.29289Z" fill="white"/>
                                    </svg>
                                </div>
                            </div>

                        </div>

                        <div className='row d-flex justify-content-between mt-2 p-0 m-0'>
                            
                            <div className='filter-item-currency position-relative'>
                                {/* <div className='p-0 m-0 h-100'> */}
                                    <svg width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <circle cx="4" cy="4" r="4" fill="#34D399"/>
                                    </svg>
                                {/* </div> */}
                                <Selecter 
                                    list_values={CURRENCY_LIST} 
                                    class_name={'filter-item-currency text-nowrap'} 
                                    setIndex={handleChangeCurrency} 
                                    selected_value={currencyNum}
                                    is_show={currentSelecter === 'currency'}
                                    setSelecter={()=>setCurrentSelecter('currency')}
                                />

                                
                                    <svg width="8" height="14" viewBox="0 0 8 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path fill-rule="evenodd" clip-rule="evenodd" d="M4 0C4.26522 5.96046e-08 4.51957 0.105357 4.70711 0.292893L7.70711 3.29289C8.09763 3.68342 8.09763 4.31658 7.70711 4.70711C7.31658 5.09763 6.68342 5.09763 6.29289 4.70711L4 2.41421L1.70711 4.70711C1.31658 5.09763 0.683417 5.09763 0.292893 4.70711C-0.0976311 4.31658 -0.097631 3.68342 0.292893 3.29289L3.29289 0.292893C3.48043 0.105357 3.73478 0 4 0ZM0.292893 9.29289C0.683417 8.90237 1.31658 8.90237 1.70711 9.29289L4 11.5858L6.29289 9.29289C6.68342 8.90237 7.31658 8.90237 7.70711 9.29289C8.09763 9.68342 8.09763 10.3166 7.70711 10.7071L4.70711 13.7071C4.31658 14.0976 3.68342 14.0976 3.29289 13.7071L0.292893 10.7071C-0.0976311 10.3166 -0.0976311 9.68342 0.292893 9.29289Z" fill="white"/>
                                    </svg>
                            </div>
                            
                            <div className='filter-item-quantity position-relative'>
                                <input className='filter-input' type='number' placeholder='Кол-во' onChange={handleChangeFilterQuantity} value={filter_quantity}/>
                            </div>
                        </div>
                    </>
                }

                {marketScreen === 'orders' && 
                    orders.map((order, index) => {
                        return (
                                <div 
                                    style={
                                        (indexMethod !== 0 && companies_pay[indexMethod].id !== order.company_pay_id) || listFilterOrders[index] !== 1 || order.type !== typeOrderFilter ? {display: 'none'}: {}
                                    } 
                                    className='order-item mt-3' key={order.id}
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
                                                onClick={() => {handleClickBuy(order)}}
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
                                            {order.limit_order} {order.currency_fiat_id === 1 ? 'RUB': 'USD'}
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
                                        <div className='order-label-2'>
                                            Методы оплаты
                                        </div>
                                        <div className='order-info-3'>
                                            {order.company}
                                        </div>
                                    </div>
                                </div>
                        )
                    })
                }

                {marketScreen === 'buy' && <ScreenBuy buyOrder={buyOrder} setMarketScreen={setMarketScreen}/>}

                {marketScreen === 'select_method' && 
                    <div>
                        <label className='title-select-method'>Выберите способ оплаты</label>
                        <div className='currency-settings-container mt-3'>
                            {companies_pay.map((method, index) => {
                                return (
                                    <div key={index} >
                                        <div className='row button-trade-menu' 
                                            onClick={()=>{
                                                setIndexMethod(index)
                                                setMarketScreen('orders')
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
