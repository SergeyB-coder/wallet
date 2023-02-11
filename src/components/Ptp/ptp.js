import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useTelegram } from '../../hooks/useTelegram';
import { CreateOrder1 } from './createorder1';
import { CreateOrder2 } from './createorder2';
import { CreateOrder4 } from './createorder4';
import { CreateOrder5 } from './createorder5';
import { createOrder } from './ptpApi';
import { selectCurrencyFiat, selectCurrencyOrder, selectLimitOrder, selectPercentPrice, selectQuantityOrder } from './ptpSlice';
import { TradeMenu } from './trademenu';


export function Ptp() {
    const {tg, user_id} = useTelegram()
    const navigate = useNavigate()

    const percent_price = useSelector(selectPercentPrice)
    const quantity_order = useSelector(selectQuantityOrder)
    const limit_order = useSelector(selectLimitOrder)
    const currency_fiat = useSelector(selectCurrencyFiat)
    const currency_order = useSelector(selectCurrencyOrder)

    const [screen, setScreen] = useState('menu') 

    useEffect(() => {
        tg.MainButton.show()
        tg.MainButton.setText('Далее')
        tg.MainButton.setParams({color: '#728788'})
        tg.BackButton.show()
    }, );

    const nextScreen = () => {
        switch (screen) {
            case 'menu':
                setScreen('createorder1')
                break;
            
            case 'createorder1':
                setScreen('createorder2')
                break;

            case 'createorder2':
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

    const backScreen = () => {
        switch (screen) {
            case 'menu':
                navigate('/', {replace: true})
                break;
            
            case 'createorder1':
                setScreen('menu')
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
            quantity_order: quantity_order,
            limit_order: limit_order,
            currency_fiat: currency_fiat,
            currency_order: currency_order
        }, () => {
            setScreen('createorder5')
        })
    }

    useEffect(() => {
        tg.onEvent('mainButtonClicked', nextScreen)
            return () => {tg.offEvent('mainButtonClicked', nextScreen)}
        }, )

    useEffect(() => {
        tg.onEvent('backButtonClicked', backScreen)
            return () => {tg.offEvent('backButtonClicked', backScreen)}
        }, )

    return (
        <div className={screen === 'createorder5' ? 'p-4 ptp-container': 'p-4'} >
        {/* <h3>P2P</h3> */}
        {screen === 'menu' && <TradeMenu setScreen={setScreen}/>}
        {screen === 'createorder1' && <CreateOrder1 setScreen={setScreen}/>}
        {screen === 'createorder2' && <CreateOrder2 setScreen={setScreen}/>}
        {screen === 'createorder4' && <CreateOrder4 setScreen={setScreen} handleClickCreateOrder={handleClickCreateOrder}/>}
        {screen === 'createorder5' && <CreateOrder5 setScreen={setScreen}/>}
        </div>
    );
}
