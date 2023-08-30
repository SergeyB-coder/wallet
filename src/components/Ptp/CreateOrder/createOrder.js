import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useTelegram } from '../../../hooks/useTelegram';
import { CreateOrder1 } from './createorder1';
import { CreateOrder2 } from './createorder2';
import { CreateOrder4 } from './createorder4';
import { CreateOrder5 } from './createorder5';
import { createOrder, parsePrice } from '../ptpApi';
import { selectComment, selectCurrencyFiat, selectCurrencyOrder, selectLimitOrder, selectMethodPay, selectPercentPrice, selectPrice, selectPriceType, selectQuantityOrder, selectTimeLimit, selectTypeOrder, setPriceMarket, setPriceMarketTRX, setRubDollar } from '../ptpSlice';
import { CreateOrder3 } from './createorder3';
import { selectMethodsPay } from '../settings_pay/settingsPaySlice';
import { selectBackStepCreateOrder } from '../market/marketSlice';
import { getUserSumOrders } from '../../Home/homeApi';
import { setSumOrders } from '../../Home/homeSlice';


export function CreateOrder() {
    const {tg, user_id, init_data} = useTelegram()
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
    const comment = useSelector(selectComment)
    const list_methods = useSelector(selectMethodsPay)
    const time_limit_order = useSelector(selectTimeLimit)

    const back_screen = useSelector(selectBackStepCreateOrder)

    const [screen, setScreen] = useState('createorder1') 
    const [listCheckedMethods, setListCheckedMethods] = useState([]);
    // const [test, setTest] = useState('') 

    

    // const nextScreen = () => {
    //     switch (screen) {
    //         case 'createorder1':
    //             setScreen('createorder2')
    //             break;

    //         case 'createorder2':
                
    //             setScreen('createorder3')
    //             break;

    //         case 'createorder3':
    //             tg.MainButton.hide()
                
    //             setScreen('createorder4')
    //             break;

    //         case 'createorder4':
    //             handleClickCreateOrder()
    //             break;

    //         default:
    //             break;
    //     }
    // }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const backScreen = () => {
        if (back_screen === 'person') {
            navigate('/person', {replace: true})
        }
        else {
            switch (screen) {
                case 'createorder1':
                    navigate('/ptp', {replace: true})
                    break;
    
                case 'createorder2':
                    setScreen('createorder1')
                    break;
    
                case 'createorder3':
                    setScreen('createorder2')
                    break;
    
                case 'createorder4':
                    setScreen('createorder3')
                    break;
                
                default:
                    break;
            }
        }
    }

    const handleClickCreateOrder = () => {
        // console.log('handleClickCreateOrder', list_methods, listCheckedMethods)
        let list_method_id = []
        for (let ind in list_methods) {
            if (listCheckedMethods[ind]) {
                list_method_id.push(list_methods[ind].id)
            }
        }

        createOrder({
            init_data: init_data,
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
            comment: comment,
            list_method_id: list_method_id,
            time_limit_order: time_limit_order === 1 ? 15: time_limit_order === 2 ? 60: 360,
        }, () => {
            setScreen('createorder5')
        })
    }

    useEffect(() => {
        getUserSumOrders({user_id: user_id, currency_id: currency_order}, (data) => {
            // console.log('sum_orders', data.sum_orders)
            dispatch(setSumOrders(data.sum_orders))
        })
    }, [currency_order, dispatch, user_id]);

    useEffect(() => {
        parsePrice({}, (data) => {
            dispatch(setPriceMarket(data.price_market))
            dispatch(setPriceMarketTRX(data.price_market_trx))
            dispatch(setRubDollar(data.rub_dollar))            
        })
    }, [dispatch]);

    useEffect(() => {
        // tg.MainButton.show()
        // tg.MainButton.setText('Далее')
        // tg.MainButton.setParams({color: '#86EFAC'})
        tg.BackButton.show()
    }, [tg.BackButton]);

    // useEffect(() => {
    //     tg.onEvent('mainButtonClicked', nextScreen)
    //         return () => {tg.offEvent('mainButtonClicked', nextScreen)}
    //     }, )

    useEffect(() => {
        // setTest(par)
        // console.log('uef')
        tg.onEvent('backButtonClicked', backScreen)
            return () => {tg.offEvent('backButtonClicked', backScreen)}
        })

    return (
        <div className='d-flex justify-content-center'>
            {screen === 'createorder1' && <CreateOrder1 setScreen={setScreen}/>}
            {screen === 'createorder2' && <CreateOrder2 setScreen={setScreen} listCheckedMethods={listCheckedMethods} setListCheckedMethods={setListCheckedMethods}/>}
            {screen === 'createorder3' && <CreateOrder3 setScreen={setScreen}/>}
            {screen === 'createorder4' && <CreateOrder4 setScreen={setScreen} listCheckedMethods={listCheckedMethods} handleClickCreateOrder={handleClickCreateOrder}/>}
            {screen === 'createorder5' && <CreateOrder5 setScreen={setScreen}/>}
        </div>
    );
}