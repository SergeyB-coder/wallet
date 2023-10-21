import React, { useEffect } from 'react';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useTelegram } from '../../../hooks/useTelegram';
// import { ButtonNext } from '../../Common/buttonNext';
import { getOrderMethods, sendBuy } from './marketApi';
import { selectQuantityBuy, selectShowMethodsPay, setQuantityBuy, setShowMethodsPay } from './marketSlice';
import { selectBalance, selectBalanceTRX, selectBalanceTRXv, selectBalanceV, selectNameUser } from '../../Home/homeSlice';
import {  selectPriceMarket, selectRubDollar } from '../ptpSlice';
import { setBackScreen, setNewMethod, setSelectedCompanyIndex } from '../settings_pay/settingsPaySlice';
import { CURRENCY_LIST, CURRENCY_LIST_SHORT } from '../../../const/devdata';
import { dictionary } from '../../../const/dictionary';

export function ScreenBuy (props) {
    const showMethodsPay = useSelector(selectShowMethodsPay)
    const navigate = useNavigate()
    const { user_id, init_data, language_code} = useTelegram()
    const dispatch = useDispatch()

    const name_user = useSelector(selectNameUser)

    const quantity_buy = useSelector(selectQuantityBuy)

    const balance = useSelector(selectBalance)
    const balance_v = useSelector(selectBalanceV)
    const balance_trx = useSelector(selectBalanceTRX)
    const balance_trx_v = useSelector(selectBalanceTRXv)

    
    const price_market = useSelector(selectPriceMarket)
    const rub_dollar = useSelector(selectRubDollar)

    // const [showMethodsPay, setShowMethodsPay] = useState(false);
    const [listMethodsPay, setListMethodsPay] = useState([]);
    const [indexMethodPay, setIndexMethodPay] = useState(9);

    //labels
    const you_buy = language_code === 'ru' ? dictionary.market.you_buy.ru: dictionary.market.you_buy.en
    const price_per = language_code === 'ru' ? dictionary.market.price_per.ru: dictionary.market.price_per.en
    const payment_methods = language_code === 'ru' ? dictionary.market.payment_methods.ru: dictionary.market.payment_methods.en
    const limits = language_code === 'ru' ? dictionary.market.limits.ru: dictionary.market.limits.en
    const choose = language_code === 'ru' ? dictionary.market.choose.ru: dictionary.market.choose.en
    const message_buy = language_code === 'ru' ? dictionary.market.message_buy.ru: dictionary.market.message_buy.en
    const amount_not_limit = language_code === 'ru' ? dictionary.market.amount_not_limit.ru: dictionary.market.amount_not_limit.en
    const amount_exceeds_balance = language_code === 'ru' ? dictionary.market.amount_exceeds_balance.ru: dictionary.market.amount_exceeds_balance.en
    const add_details = language_code === 'ru' ? dictionary.market.add_details.ru: dictionary.market.add_details.en
    const add_payment_method = language_code === 'ru' ? dictionary.market.add_payment_method.ru: dictionary.market.add_payment_method.en
    const start_deal = language_code === 'ru' ? dictionary.market.start_deal.ru: dictionary.market.start_deal.en


    const is_buy = props.buyOrder.type === 'b'

    const handleChangeQuantity = (e) => {
        // console.log('e.target.value', e.target.value)
        let inp = document.getElementById('q_buy')
        inp.style.width = (11 + e.target.value.length * 11) + 'px'
        dispatch(setQuantityBuy(e.target.value))
    }

    const handleClickBuy = (e) => {
        // console.log(isCorrectQuantity())
        if (isCorrectQuantity()) {
            sendBuy({
                init_data: init_data,
                user_id: user_id, 
                first_name: name_user,
                order_id: props.buyOrder.id, 
                quantity: quantity_buy, 
                price: props?.buyOrder?.type_price_id !== 2 ? props?.buyOrder?.price: price_market * (props?.buyOrder?.currency_fiat_id !== 1 ? 1: rub_dollar * props?.buyOrder?.percent_price/100) , 
                fiat: props?.buyOrder.currency_fiat_id,
                // company: props?.buyOrder.company,
                company: listMethodsPay[indexMethodPay]?.company_name,
                card_number: props?.buyOrder.card_number,
                type_order: props?.buyOrder.type,
                method_pay_id: is_buy ? listMethodsPay[indexMethodPay].method_pay_id_taker: listMethodsPay[indexMethodPay].method_pay_id
            }, (data) => {
                console.log('sendBuy res', data)
                navigate('/deal/' + data.deal_id.toString(), {replace: true})
            })
        }
    }

    const handleClickSelectMethodPay = () => {
        dispatch(setShowMethodsPay(true))
    }

    function handleClickMethodPay(index) {
        setIndexMethodPay(index)
        dispatch(setShowMethodsPay(false))
    }


    const handleClickAddMethod = (company_id) => {
        // console.log('company_id', company_id)
        dispatch(setSelectedCompanyIndex(company_id))
        dispatch(setBackScreen('screenbuy'))
        dispatch(setNewMethod(true))
        navigate('/settingspay', {replace: true})
    }

    function isCorrectQuantity() {

        return !is_buy || 
        (
            is_buy && (
                    (props.buyOrder.currency_id === 1 && quantity_buy <= balance + balance_v) ||
                    (props.buyOrder.currency_id === 2 && quantity_buy <= balance_trx+balance_trx_v)
                )
        )
    }

    function isQuantityInLimit() {
        return (
            props.buyOrder.quantity >= quantity_buy && 
            props.buyOrder.limit_order/(props.buyOrder.type_price_id === 1 ? props.buyOrder.price: price_market * (props.buyOrder.currency_fiat_id === 1 ? rub_dollar: 1) * props.buyOrder.percent_price/100) <= quantity_buy
        )
    }

    useEffect(() => {
        getOrderMethods({
            order_id: props.buyOrder.id, 
            taker_id: user_id, 
            maker_id: props.buyOrder.user_id,
            order_type: props.buyOrder.type
        }, (data) => {
            
            console.log('getOrderMethods', data)
            let index = -1
            const methods = data.order_methods
            for (let i in methods) {
                if (methods[i].method_pay_id_taker) {
                    index = i
                    setIndexMethodPay(index)
                    break
                }
            }
            // if (index === -1) setIndexMethodPay(-1)
            setIndexMethodPay(-1)
            setListMethodsPay(data.order_methods)
            // console.log('getOrderMethods', data)
        })
    }, [props.buyOrder.id, props.buyOrder.type, props.buyOrder.user_id, user_id]);

    

    return (
        <>
        {   showMethodsPay  &&
            <div>
                {/* <div onClick={backScreen}>hhh</div> */}
                <div style={{height: '43vh'}} className='container-list-companies overflow-auto mb-3'>
                    {listMethodsPay.map ((method, index) => {
                        return (
                                <div key={method.id} className='container-company row d-flex align-items-center'
                                    onClick={()=>handleClickMethodPay(index)}
                                >
                                    <div style={{width: '45%'}}>
                                        <div className='text-company'>{method.company_name}</div>
                                        <div className='text-card'>{props.buyOrder.type === 'b' ? method.card_number: ''}</div>
                                    </div>
                                    {
                                        !method.method_pay_id_taker && 
                                        <div className='text-nowrap' style={{width: '50%', color: '#86EFAC', marginRight: '10px'}}
                                            onClick={() => handleClickAddMethod(method.company_id)}
                                        >
                                            {add_details}
                                        </div>
                                    }
                                </div>
                        )
                    })}
                </div>
            </div>
        }

        {   !showMethodsPay &&
            <div className='container-center'>
                <div className='screen-buy-container mt-20'>
                    <div className='title-buy'>{is_buy ? 'Вы продаете ': you_buy} {props.buyOrder.first_name}</div>

                    <div className='container-buy-input mt-20'>
                        <input id='q_buy' className='buy-input text-buy' type='number' placeholder='0' 
                            onChange={handleChangeQuantity} value={quantity_buy}
                        />
                        <span className='text-buy '>{CURRENCY_LIST_SHORT[props.buyOrder.currency_id-1]}</span>
                    </div>

                    <div className='container-center mt-20'>
                        <div className='price-info-buy'>{price_per} 1 {CURRENCY_LIST[props.buyOrder.currency_id-1] + ' '} 
                            {/* {props.buyOrder.currency_id === 1 ? 'BEP20': 'TRC20'} */}
                             = {(props.buyOrder.type_price_id === 1 ? props.buyOrder.price: Math.round(price_market * (props.buyOrder.currency_fiat_id === 1 ? rub_dollar: 1) * props.buyOrder.percent_price)/100)} { props.buyOrder.currency_fiat_id === 1 ? ' RUB': ' USD'}</div>
                    </div>

                    {/* <div className='container-center mt-20'>
                        <div className='price-info-buy'>
                            Ваш баланс: {props.buyOrder.currency_id === 1 ? balance: balance_trx+balance_trx_v} = {props?.buyOrder?.price}
                        </div>
                    </div> */}
                    
                    <div className='container-center mt-20'>
                        <div className='w-100'>
                            <div className='order-row-1' onClick={handleClickSelectMethodPay}>
                                <div className='order-label-2'>
                                    {payment_methods}
                                </div>
                                <div className='order-buy_text'>
                                    {listMethodsPay[indexMethodPay]?.company_name || choose}
                                </div>
                            </div>

                            <div className='order-line-container'>
                                <div className='order-line'></div>
                            </div>

                            {/* <div className='row mb-3' onClick={handleClickSelectMethodPay}>
                                <div className='buy-label'>
                                    Методы оплаты
                                </div>
                                <div className='buy-info'>
                                    {listMethodsPay[indexMethodPay]?.company_name || ''}
                                </div>
                            </div> */}

                            {/* <div className='divider-order'></div> */}

                            {/* <div className='row mt-3 mb-3'>
                                <div className='buy-label'>
                                    Лимит
                                </div>
                                <div className='buy-info text-nowrap'>
                                    { props.buyOrder.limit_order} USDT
                                </div>
                            </div> */}

                            <div className='order-row-1'>
                                
                                <div className='order-label-2'>
                                    {limits}
                                </div>
                                <div className='order-info-3'>
                                    {Math.round(100*props.buyOrder.limit_order/(props.buyOrder.type_price_id === 1 ? props.buyOrder.price: price_market * (props.buyOrder.currency_fiat_id === 1 ? rub_dollar: 1) * props.buyOrder.percent_price/100))/100} {' - '}
                                    { props.buyOrder.quantity} {CURRENCY_LIST[props.buyOrder.currency_id-1]} 
                                    {/* { props.buyOrder.currency_id === 1 ? ' BEP20': ' TRC20'} */}
                                    <br></br>
                                    { props.buyOrder.limit_order}  {' - '}
                                    { Math.round(props.buyOrder.quantity * (props.buyOrder.type_price_id === 1 ? props.buyOrder.price: price_market * (props.buyOrder.currency_fiat_id === 1 ? rub_dollar: 1) * props.buyOrder.percent_price/100))}
                                    { props.buyOrder.currency_fiat_id === 1 ? ' RUB': ' USD'}
                                </div>
                            </div>

                            <div className='order-line-container'>
                                <div className='order-line'></div>
                            </div>

                            {/* <div className='row mt-3'>
                                <div className='buy-label text-nowrap'>
                                    Детали объявления
                                </div> */}
                                {/* <div className='buy-info'>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chevron-right" viewBox="0 0 16 16">
                                        <path fillRule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"/>
                                    </svg>
                                </div> */}
                            {/* </div> */}

                            {/* <div className='order-row-1'>
                                <div className='order-label-2'>
                                    Детали объявления
                                </div>
                                <div className='order-info-3'>
                                    <svg width="5" height="8" viewBox="0 0 5 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path fill-rule="evenodd" clip-rule="evenodd" d="M5 4C5 4.26522 4.89464 4.51957 4.70711 4.70711L1.70711 7.70711C1.31658 8.09763 0.683416 8.09763 0.292892 7.70711C-0.0976318 7.31658 -0.0976317 6.68342 0.292893 6.29289L2.58579 4L0.292893 1.70711C-0.097631 1.31658 -0.0976315 0.683417 0.292893 0.292893C0.683417 -0.0976313 1.31658 -0.0976312 1.70711 0.292893L4.70711 3.29289C4.89464 3.48043 5 3.73478 5 4Z" fill="white"/>
                                    </svg>
                                </div>
                            </div> */}

                            

                        </div>
                    </div>

                    <div className='order-comment mt-20'>
                        <div className='message-buy '>{message_buy}</div>
                        <div className='container-comment-text'>
                            <div className='comment-text'>{props.buyOrder.comment}</div>
                        </div>
                    </div>

                    {/* <div className='m-2 mt-5'>
                        <ButtonNext text='Начать сделку' onClick={handleClickBuy}/>
                    </div> */}
                    <div onClick={handleClickBuy} 
                        className={
                            `button-send-box ${
                                isCorrectQuantity() && isQuantityInLimit() && listMethodsPay[indexMethodPay]?.company_name ? 
                                'button-active-send-bg active-text': 
                                'button-send-bg disable-text'
                            } mt-20`
                        }
                    >
                        {
                            !isCorrectQuantity() ? amount_exceeds_balance: 
                            !isQuantityInLimit() ? amount_not_limit:
                            !listMethodsPay[indexMethodPay]?.company_name ? add_payment_method:
                            start_deal
                        }
                    </div>
                
                </div>
            </div>
        } 
        
        </>
      );
}

