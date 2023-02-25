import React from 'react';
import { useSelector } from 'react-redux';
import { useTelegram } from '../../../hooks/useTelegram';
import { ButtonNext } from '../../Common/buttonNext';
import { CURRENCY_FIAT_LIST, CURRENCY_LIST, TIME_LIMITS } from '../../../const/devdata';

import { selectQuantityOrder, selectCurrencyFiat, selectCurrencyOrder, selectCurrencyType, selectPrice, selectLimitOrder, selectTimeLimit } from '../ptpSlice';

export function CreateOrder4(props) {
    const {first_name} = useTelegram()
    // const percent_price = useSelector(selectPercentPrice)
    const quantity_order = useSelector(selectQuantityOrder)
    // const limit_order = useSelector(selectLimitOrder)
    const currency_fiat = useSelector(selectCurrencyFiat)
    const currency_order = useSelector(selectCurrencyOrder)
    const currency_type = useSelector(selectCurrencyType)

    
    
    // const user_id = '652065848'
    // const {user_id} = useTelegram()
    // const setScreen = props.setScreen
    const price = useSelector(selectPrice)
    const limit_order = useSelector(selectLimitOrder)
    const timeLimit = useSelector(selectTimeLimit)

    const divider = 
        <div className='divider-test-order'></div>
    
    
    
    return (
        <div>
            <div className='row  mt-3 text-dark-color'>
                <div className='col-9 t-left-align'>Проверка объявления</div>
                <div className='col-2'>4/4</div>
            </div>
            
            <div className='test-order-container mt-3 mb-5'>
                <div className='row d-flex align-items-center'>
                    <div className='test-order-col1'>
                        <div className='test-order-price'>{`${price} ${CURRENCY_FIAT_LIST[currency_fiat - 1]}`}</div>
                        <div className='test-order-text'>{currency_type === 1 ? 'Фиксированная': 'Плавающая'} цена за 1 USDT</div>
                    </div>
                    <div className='test-order-col2'>
                        <div className='test-order-buy'>
                            Купить
                        </div>
                    </div>
                </div>
                
                {divider}

                <div className='row'>
                    <div className='test-order-info-col d-flex flex-column justify-content-start'>
                        <p>{first_name}</p>
                        <p>Лимит</p>
                        <p>Методы оплаты</p>
                        <p className='text-nowrap'>Оплатить в течение</p>
                    </div>
                    <div className='test-order-info-col'>
                        <p>{quantity_order} {CURRENCY_LIST[currency_order - 1]}</p>
                        <p>{limit_order} {CURRENCY_FIAT_LIST[currency_fiat - 1]}</p>
                        <p>Raiffeisen Bank</p>
                        <p>{TIME_LIMITS[timeLimit - 1]}</p>
                    </div>

                </div>

            </div>
            <ButtonNext onClick={props.handleClickCreateOrder} text={'Создать объявление'}/>
        </div>
    );
}
