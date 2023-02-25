import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTelegram } from '../../../hooks/useTelegram';
import { ButtonNext } from '../buttonNext';
import { sendBuy } from './marketApi';
import { selectQuantityBuy, setDealScreenInfo, setQuantityBuy } from './marketSlice';

export function ScreenBuy (props) {
    const setMarketScreen = props.setMarketScreen
    const {user_id} = useTelegram()
    const dispatch = useDispatch()
    const quantity_buy = useSelector(selectQuantityBuy)

    const handleChangeQuantity = (e) => {
        // let inp = document.getElementById('quantity')
        // inp.style.width = (20 + (e.target.value.length + 1) * 13) + 'px'
        dispatch(setQuantityBuy(e.target.value))
    }

    const handleClickBuy = (e) => {
        sendBuy({user_id: user_id, order_id: props.buyOrder.id, quantity: quantity_buy}, (data) => {
            dispatch(setDealScreenInfo(
                {
                    deal_id: data.deal_id,
                    quantity: quantity_buy, 
                    saler: props?.buyOrder?.first_name, 
                    price: props?.buyOrder?.price,
                    fiat: props.buyOrder.currency_fiat_id,
                    currency: props.buyOrder.currency_id,
                    status: 'request',
                    saler_id: props.buyOrder.user_id
                }
            ))
            setMarketScreen('deal')
        })
    }

    // useEffect(() => {
    //     let inp = document.getElementById('quantity')
    //     inp.style.width = (20 + (quantity_buy && quantity_buy?.length + 1) * 13) + 'px'
    // }, [quantity_buy]);
    return (
        <>
            <div className='screen-buy-container mt-5'>
                <div className='title-buy'>Покупка у {props.buyOrder.first_name}</div>

                <div className=' mt-5'>
                    <label>Укажите количество:</label>
                    {/* <div>
                        <input id='quantity' className='bg-order-input' type='number' value={quantity_buy} onChange={handleChangeQuantity}/><span>USDT {props.buyOrder.currency_id === 1 ? 'BEP20': 'TRC20'}</span> 
                    </div>   */}
                    <div className='row address-item mt-2 mb-2 mx-2'>
                        <div className='address-item-col1'>
                            <div className=' p-0 m-0 d-flex align-items-center'>
                                <input className='address-to-input' type='number' placeholder='0 USDT' onChange={handleChangeQuantity} value={quantity_buy}/>
                            </div>
                        </div>
                    </div>   
                </div>

                <div style={{color: 'var(--text-mini)', fontSize: 14, marginTop: 30}}>Цена за 1 USDT {props.buyOrder.currency_id === 1 ? 'BEP20': 'TRC20'} = {props?.buyOrder?.price}</div>

                <div className='methods-pay pt-3 pb-3 m-2 mt-5'>
                    <div className='row mb-3'>
                        <div className='buy-label'>
                            Методы оплаты
                        </div>
                        <div className='buy-info'>
                            Raiffeisen
                        </div>
                    </div>
                    <div className='divider-order'></div>
                    <div className='row mt-3 mb-3'>
                        <div className='buy-label'>
                            Лимит
                        </div>
                        <div className='buy-info text-nowrap'>
                            {props.buyOrder.limit_order} USDT
                        </div>
                    </div>
                    <div className='divider-order'></div>
                    <div className='row mt-3'>
                        <div className='buy-label text-nowrap'>
                            Детали объявления
                        </div>
                        <div className='buy-info'>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chevron-right" viewBox="0 0 16 16">
                                <path fillRule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"/>
                            </svg>
                        </div>
                    </div>
                </div>

                <div className='m-2 mt-5'>
                    <ButtonNext text='Купить' onClick={handleClickBuy}/>
                </div>
                
            </div>
        </>
      );
}

