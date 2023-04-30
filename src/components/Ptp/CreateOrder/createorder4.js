import React, {useEffect, useState} from 'react';
import { useSelector } from 'react-redux';
// import { useTelegram } from '../../../hooks/useTelegram';
// import { ButtonNext } from '../../Common/buttonNext';
import {  TIME_LIMITS } from '../../../const/devdata';

import { selectQuantityOrder,  selectLimitOrder, selectTimeLimit, selectPrice, selectCurrencyFiat, selectPriceType, selectPriceMarket, selectRubDollar, selectPercentPrice } from '../ptpSlice';
import { selectMethodsPay } from '../settings_pay/settingsPaySlice';

const commission = 0.25

export function CreateOrder4(props) {
    const listCheckedMethods = props.listCheckedMethods

    const [methodPay, setMethodPay] = useState('');
    // const {first_name} = useTelegram()
    // const percent_price = useSelector(selectPercentPrice)
    const quantity_order = useSelector(selectQuantityOrder)
    // const limit_order = useSelector(selectLimitOrder)
    // const currency_fiat = useSelector(selectCurrencyFiat)
    // const currency_order = useSelector(selectCurrencyOrder)
    // const currency_type = useSelector(selectPriceType)

    // const method_pay = useSelector(selectMethodPay)
    const methods_pay = useSelector(selectMethodsPay)
    // const price = useSelector(selectPrice)
    const limit_order = useSelector(selectLimitOrder)
    const timeLimit = useSelector(selectTimeLimit)
    const price = useSelector(selectPrice)
    const type_price = useSelector(selectPriceType)
    const price_market = useSelector(selectPriceMarket)
    const rub_dollar = useSelector(selectRubDollar)
    const percent_price = useSelector(selectPercentPrice)
    const currencyFiat = useSelector(selectCurrencyFiat)
    // const typeOrder = useSelector(selectTypeOrder)

    const divider = 
        <div className='container-center'>
            <div className='divider-check-order'></div>
        </div>
    
    useEffect(() => {
        // const ind = listCheckedMethods.findIndex(e => e)
        // if (ind !== -1) {
        let methods_pay_text = ''
        for (let i in listCheckedMethods) {
            if (listCheckedMethods[i]) methods_pay_text = methods_pay_text + methods_pay[i].company_name + ' '
        }
        setMethodPay(methods_pay_text)
        // }
    }, [listCheckedMethods, methods_pay]);
    
    return (
        <div className='container-create-order mt-20'>
            <div className='container-title'>
                <div className='title-text'>Проверьте объявление</div>
                <div className='page-number'>4/4</div>
            </div>
            
            <div className='container-check-order mt-20'>
                <div className='check-order-container-item'>
                    <div className='order-settings-label'>
                        Сумма
                    </div>

                    <div className='check-order-text'>
                        {quantity_order}
                    </div>
                </div>
                
                {divider}

                <div className='check-order-container-item'>
                    <div className='order-settings-label'>
                        Лимиты
                    </div>

                    <div className='check-order-text'>
                        {`${ Math.round(1000*limit_order/(type_price === 1 ? price: price_market * (currencyFiat === 1 ? rub_dollar: 1) * percent_price/100))/1000} - ${Math.round(100* quantity_order * (1 - commission))/100} USDT`}<br></br>
                        {`${limit_order} - ${ Math.round((quantity_order * (1-commission))*(type_price === 1 ? price: price_market * (currencyFiat === 1 ? rub_dollar: 1) * percent_price/100)*1000)/1000 } ${currencyFiat === 1 ? 'Руб': '$'}`}
                    </div>
                </div>

                {divider}

                <div className='check-order-container-item'>
                    <div className='order-settings-label'>
                        Метод оплаты
                    </div>

                    <div className='check-order-text'>
                        {methodPay}
                    </div>
                </div>

                {divider}

                <div className='check-order-container-item'>
                    <div className='order-settings-label text-nowrap'>
                        Оплатить в течение
                    </div>

                    <div className='check-order-text'>
                        {TIME_LIMITS[timeLimit - 1]}
                    </div>
                </div>

                {divider}

                <div className='comment-check-order mt-20'>
                    Комиссия продавца за каждую транзакцию — 0.25%.
                    Комиссия покупателя — 0%
                </div>

            </div>
            {/* <ButtonNext onClick={props.handleClickCreateOrder} text={'Создать объявление'}/> */}

            <div onClick={props.handleClickCreateOrder} className='button-send-box button-active-send-bg active-text mt-20'>
                Создать объявление
            </div>
        </div>
    );
}
