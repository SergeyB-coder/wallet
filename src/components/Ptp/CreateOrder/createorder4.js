import React, {useEffect, useState} from 'react';
import { useSelector } from 'react-redux';
import { useTelegram } from '../../../hooks/useTelegram';
// import { ButtonNext } from '../../Common/buttonNext';
import {  TIME_LIMITS } from '../../../const/devdata';

import { selectQuantityOrder,  selectLimitOrder, selectTimeLimit, selectPrice, selectCurrencyFiat, selectPriceType, selectPriceMarket, selectRubDollar, selectPercentPrice } from '../ptpSlice';
import { selectMethodsPay } from '../settings_pay/settingsPaySlice';
import { dictionary } from '../../../const/dictionary';

const commission = 0.0025

export function CreateOrder4(props) {

    const { language_code} = useTelegram()
    const listCheckedMethods = props.listCheckedMethods

    const sum = language_code === 'ru' ? dictionary.sum.ru: dictionary.sum.en
    const payment_method = language_code === 'ru' ? dictionary.payment_method.ru: dictionary.payment_method.en
    const pay_within = language_code === 'ru' ? dictionary.pay_within.ru: dictionary.pay_within.en
    const merchant_transaction = language_code === 'ru' ? dictionary.merchant_transaction.ru: dictionary.merchant_transaction.en
    const create_ad = language_code === 'ru' ? dictionary.create_ad.ru: dictionary.create_ad.en
    const buyer_commission = language_code === 'ru' ? dictionary.buyer_commission.ru: dictionary.buyer_commission.en
    const check_ad = language_code === 'ru' ? dictionary.check_ad.ru: dictionary.check_ad.en

    const limits = language_code === 'ru' ? dictionary.limits.ru: dictionary.limits.en


    const [methodPay, setMethodPay] = useState('');
    const quantity_order = useSelector(selectQuantityOrder)
    const methods_pay = useSelector(selectMethodsPay)
    const limit_order = useSelector(selectLimitOrder)
    const timeLimit = useSelector(selectTimeLimit)
    const price = useSelector(selectPrice)
    const type_price = useSelector(selectPriceType)
    const price_market = useSelector(selectPriceMarket)
    const rub_dollar = useSelector(selectRubDollar)
    const percent_price = useSelector(selectPercentPrice)
    const currencyFiat = useSelector(selectCurrencyFiat)

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
                <div className='title-text'>{check_ad}</div>
                <div className='page-number'>4/4</div>
            </div>
            
            <div className='container-check-order mt-20'>
                <div className='check-order-container-item'>
                    <div className='order-settings-label'>
                        {sum}
                    </div>

                    <div className='check-order-text'>
                        {quantity_order}
                    </div>
                </div>
                
                {divider}

                <div className='check-order-container-item'>
                    <div className='order-settings-label'>
                        {limits}
                    </div>

                    <div className='check-order-text'>
                        {`${ Math.round(1000*limit_order/(type_price === 1 ? price: price_market * (currencyFiat === 1 ? rub_dollar: 1) * percent_price/100))/1000} - ${Math.round(1000* quantity_order * (1 - commission))/1000} USDT`}<br></br>
                        {`${limit_order} - ${ Math.round((quantity_order * (1-commission))*(type_price === 1 ? price: price_market * (currencyFiat === 1 ? rub_dollar: 1) * percent_price/100)*1000)/1000 } ${currencyFiat === 1 ? '₽': '$'}`}
                    </div>
                </div>

                {divider}

                <div className='check-order-container-item'>
                    <div className='order-settings-label'>
                        {payment_method}
                    </div>

                    <div className='check-order-text'>
                        {methodPay}
                    </div>
                </div>

                {divider}

                <div className='check-order-container-item'>
                    <div className='order-settings-label text-nowrap'>
                        {pay_within}
                    </div>

                    <div className='check-order-text'>
                        {TIME_LIMITS[timeLimit - 1]}
                    </div>
                </div>

                {divider}

                <div className='comment-check-order mt-20'>
                    {merchant_transaction} — 0.25%.
                    {buyer_commission} — 0%
                </div>

            </div>
            

            <div onClick={props.handleClickCreateOrder} className='button-send-box button-active-send-bg active-text mt-20'>
                {create_ad}
            </div>
        </div>
    );
}
