import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ButtonNext } from '../buttonNext';
import { selectQuantityBuy, setQuantityBuy } from './marketSlice';

export function ScreenBuy (props) {
    const dispatch = useDispatch()
    const quantity_buy = useSelector(selectQuantityBuy)

    const handleChangeQuantity = (e) => {
        dispatch(setQuantityBuy(e.target.value))
    }

    const handleClickBuy = (e) => {

    }
    
    return (
        <>
            <div className='screen-buy-container'>
                <div>Вы покупаете у </div>
                <div>
                    <input className='bg-order-input' type='number' value={quantity_buy} onChange={handleChangeQuantity}/><span>USDT</span> 
                </div>
                <div>Цена за 1 USDT = {props?.buyOrder?.price}</div>

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
                            Лимиты
                        </div>
                        <div className='buy-info text-nowrap'>
                            1,345 ~ 20,384 USDT
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

