import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useTelegram } from '../../../hooks/useTelegram';
import { CreateOrder1 } from './createorder1';
import { CreateOrder2 } from './createorder2';
import { CreateOrder4 } from './createorder4';
import { CreateOrder5 } from './createorder5';
import { createOrder, parsePrice } from '../ptpApi';
import { selectCurrencyFiat, selectCurrencyOrder, selectLimitOrder, selectMethodPay, selectPercentPrice, selectPrice, selectPriceType, selectQuantityOrder, selectTypeOrder, setPriceMarket, setPriceMarketTRX, setRubDollar } from '../ptpSlice';


export function CreateOrder() {
    const {tg, user_id} = useTelegram()
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const percent_price = useSelector(selectPercentPrice)
    const quantity_order = useSelector(selectQuantityOrder)
    const limit_order = useSelector(selectLimitOrder)
    const currency_fiat = useSelector(selectCurrencyFiat)
    const currency_order = useSelector(selectCurrencyOrder)
    const price = useSelector(selectPrice)
    const method_pay = useSelector(selectMethodPay)
    const type_order = useSelector(selectTypeOrder)
    const price_type = useSelector(selectPriceType)

    const [screen, setScreen] = useState('createorder1') 
    // const [test, setTest] = useState('') 

    

    const nextScreen = () => {
        switch (screen) {
            case 'createorder1':
                setScreen('createorder2')
                break;

            case 'createorder2':
                tg.MainButton.hide()
                setScreen('createorder4')
                break;

            case 'createorder4':
                createOrder({
                    user_id: user_id,
                    percent_price: percent_price,
                    quantity_order: quantity_order,
                    limit_order: limit_order,
                    currency_fiat: currency_fiat,
                    currency_order: currency_order
                }, () => {
                    setScreen('createorder5')
                })
                break;

            default:
                break;
        }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const backScreen = () => {
        switch (screen) {
            case 'createorder1':
                navigate('/ptp', {replace: true})
                break;

            case 'createorder2':
                setScreen('createorder1')
                break;

            case 'createorder4':
                setScreen('createorder2')
                break;
            
            default:
                break;
        }
    }

    const handleClickCreateOrder = () => {
        createOrder({
            user_id: user_id,
            percent_price: percent_price,
            price: price,
            quantity_order: quantity_order,
            limit_order: limit_order,
            currency_fiat: currency_fiat,
            currency_order: currency_order,
            method_pay_id: method_pay?.id,
            type: type_order,
            type_price_id: price_type,
        }, () => {
            setScreen('createorder5')
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
        tg.MainButton.show()
        tg.MainButton.setText('Далее')
        tg.MainButton.setParams({color: '#8BFF63'})
        tg.BackButton.show()
    }, [tg.BackButton, tg.MainButton]);

    useEffect(() => {
        tg.onEvent('mainButtonClicked', nextScreen)
            return () => {tg.offEvent('mainButtonClicked', nextScreen)}
        }, )

    useEffect(() => {
        // setTest(par)
        console.log('uef')
        tg.onEvent('backButtonClicked', backScreen)
            return () => {tg.offEvent('backButtonClicked', backScreen)}
        })

    return (
        <div className={screen === 'createorder5' ? 'p-4 ptp-container': 'p-4'} >
            {screen === 'createorder1' && <CreateOrder1 setScreen={setScreen}/>}
            {screen === 'createorder2' && <CreateOrder2 setScreen={setScreen}/>}
            {screen === 'createorder4' && <CreateOrder4 setScreen={setScreen} handleClickCreateOrder={handleClickCreateOrder}/>}
            {screen === 'createorder5' && <CreateOrder5 setScreen={setScreen}/>}
        </div>
    );
}