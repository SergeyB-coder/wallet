import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CURRENCY_FIAT_LIST, CURRENCY_LIST, PRICE_TYPES } from '../../../const/devdata';
import { Selecter } from '../../Common/selecter';
import { selectBalance, selectBalanceTRX, selectBalanceTRXv } from '../../Home/homeSlice';
// import { ButtonNext } from '../../Common/buttonNext';
import './style.css'

import { selectCurrencyFiat, selectCurrencyOrder, selectPriceType, selectLimitOrder, selectPercentPrice, selectPrice, selectPriceMarket, selectQuantityOrder, selectTypeOrder, setCurrencyFiat, setCurrencyOrder, setPriceType, setLimitOrder, setPercentPrice, setPrice, setQuantityOrder, setTypeOrder, selectRubDollar, setTimeLimit, selectTimeLimit } from '../ptpSlice';
import { useState } from 'react';

export function CreateOrder1(props) {
    const dispatch = useDispatch()
    // const setScreen = props.setScreen

    
    const quantity_order = useSelector(selectQuantityOrder)
    const limit_order = useSelector(selectLimitOrder)
    const time_limit_order = useSelector(selectTimeLimit)
    const price = useSelector(selectPrice)
    const type_price = useSelector(selectPriceType)
    // const timeLimit = useSelector(selectTimeLimit)

    const percent_price = useSelector(selectPercentPrice)
    const price_market = useSelector(selectPriceMarket)
    const rub_dollar = useSelector(selectRubDollar)

    const balance = useSelector(selectBalance)
    const balance_trx = useSelector(selectBalanceTRX)
    const balance_trx_v = useSelector(selectBalanceTRXv)

    const currency_order = useSelector(selectCurrencyOrder)
    // const priceType = useSelector(selectPriceType)
    const currencyFiat = useSelector(selectCurrencyFiat)
    const typeOrder = useSelector(selectTypeOrder)

    const [currentSelector, setCurrentSelector] = useState('');

    function handlesetPriceType(index) {
        console.log('index', index)
        dispatch(setPriceType(index + 1))
    }
    
    const handleChangeCurrencyFiat = (index) => {
        dispatch(setCurrencyFiat(index + 1))
    }
    
    const handleChangePercPrice = (e) => {
        dispatch(setPercentPrice(e.target.value))
    }

    const handleChangePrice = (e) => {
        dispatch(setPrice(e.target.value))
    }
    
    const handleChangeQuantityOrder = (e) => {
        dispatch(setQuantityOrder(e.target.value))
    }
    
    const handleChangeLimitOrder = (e) => {
        dispatch(setLimitOrder(e.target.value))
    }



    function handleClickCurrencyItem(index) {
        console.log(index)
        dispatch( setCurrencyOrder(index + 1) )
    }

    function getCurrentBalance() {
        if (currency_order === 2) return parseFloat(balance_trx+balance_trx_v)
        else return parseFloat(balance)
    }

    function isInputData () {
        return  (price !== '' && quantity_order !== '' && limit_order !== '') || 
                (type_price === 2 && percent_price !== '' && quantity_order !== '' && limit_order !== '')
    }

    function isCorrectLimit () {
        return limit_order <= quantity_order*(type_order === 1 ? price: price_market*rub_dollar)
    }

    function isCorrectQuantity() {
        return parseFloat(quantity_order || 0) <= getCurrentBalance()
    }

    // const divider = 
    //     <div className='divider-currency'></div>

    // const chevron = 
    //     <span className='ms-2'>
    //         <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chevron-expand" viewBox="0 0 16 16">
    //             <path fillRule="evenodd" d="M3.646 9.146a.5.5 0 0 1 .708 0L8 12.793l3.646-3.647a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 0-.708zm0-2.292a.5.5 0 0 0 .708 0L8 3.207l3.646 3.647a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 0 0 0 .708z"/>
    //         </svg>
    //     </span>
    
    const type_order = 
        <div className='order-settings-container-item'>
            <div className='order-settings-label text-nowrap'>
                Я хочу
            </div>
            <div className='container-buy-sale-type' 
                onClick={() => {

                    dispatch(setTypeOrder(typeOrder === 's' ? 'b': 's'))
                }}
            >
                <div className={`order-type-buy ${typeOrder === 'b' && 'is_select'}`}>
                    Купить
                </div>
                <div className={`order-type-sale ${typeOrder === 's' && 'is_select'}`}>
                    Продать
                </div>
            </div>
        </div>

    const currency_sale = 
        <div className='order-settings-container-item'>
            <div className='order-settings-label'>
                {`${typeOrder === 's' ? 'Продажа': 'Покупка'} криптовалюты`}
            </div>
            <div className='order-settings-item-col2 position-relative'>
                <svg width="9" height="8" viewBox="0 0 9 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="4.21594" cy="4" r="4" fill="#34D399"/>
                </svg>

                <Selecter 
                    list_values={CURRENCY_LIST} 
                    class_name={'order-currency-selecter text-nowrap'} 
                    setIndex={handleClickCurrencyItem} 
                    selected_value={currency_order}
                    is_show={currentSelector === 'currency'}
                    setSelecter={()=>{setCurrentSelector('currency')}}
                />
                <svg style={{marginLeft: '49.2px'}} width="9" height="14" viewBox="0 0 9 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M4.41858 0C4.6838 5.96046e-08 4.93815 0.105357 5.12569 0.292893L8.12569 3.29289C8.51621 3.68342 8.51621 4.31658 8.12569 4.70711C7.73516 5.09763 7.102 5.09763 6.71147 4.70711L4.41858 2.41421L2.12569 4.70711C1.73516 5.09763 1.102 5.09763 0.711472 4.70711C0.320948 4.31658 0.320948 3.68342 0.711472 3.29289L3.71147 0.292893C3.89901 0.105357 4.15336 0 4.41858 0ZM0.711472 9.29289C1.102 8.90237 1.73516 8.90237 2.12569 9.29289L4.41858 11.5858L6.71147 9.29289C7.102 8.90237 7.73516 8.90237 8.12569 9.29289C8.51621 9.68342 8.51621 10.3166 8.12569 10.7071L5.12569 13.7071C4.73516 14.0976 4.102 14.0976 3.71147 13.7071L0.711472 10.7071C0.320948 10.3166 0.320948 9.68342 0.711472 9.29289Z" fill="white"/>
                </svg>

            </div>
            
        </div>
    
    const currency_fiat = 
        <div className='order-settings-container-item'>
            <div className='order-settings-label'>
                Фиатная валюта
            </div>
            <div className='order-settings-item-col2 position-relative'>
                {/* <select className="select-currency" aria-label="Default select example" onChange={handleChangeCurrencyFiat}>
                    {
                        CURRENCY_FIAT_LIST.map((currency, index) => {
                            return (
                                <option key={index} className="select-currency" value={(index + 1).toString()}>{currency}</option>
                            )
                        })
                    }
                </select>{chevron} */}
                <Selecter 
                    list_values={CURRENCY_FIAT_LIST} 
                    class_name={'order-currency-selecter text-nowrap'} 
                    setIndex={handleChangeCurrencyFiat} 
                    selected_value={currencyFiat}
                    is_show={currentSelector === 'fiat'}
                    setSelecter={()=>setCurrentSelector('fiat')}
                />
                <svg width="9" height="14" viewBox="0 0 9 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M4.41858 0C4.6838 5.96046e-08 4.93815 0.105357 5.12569 0.292893L8.12569 3.29289C8.51621 3.68342 8.51621 4.31658 8.12569 4.70711C7.73516 5.09763 7.102 5.09763 6.71147 4.70711L4.41858 2.41421L2.12569 4.70711C1.73516 5.09763 1.102 5.09763 0.711472 4.70711C0.320948 4.31658 0.320948 3.68342 0.711472 3.29289L3.71147 0.292893C3.89901 0.105357 4.15336 0 4.41858 0ZM0.711472 9.29289C1.102 8.90237 1.73516 8.90237 2.12569 9.29289L4.41858 11.5858L6.71147 9.29289C7.102 8.90237 7.73516 8.90237 8.12569 9.29289C8.51621 9.68342 8.51621 10.3166 8.12569 10.7071L5.12569 13.7071C4.73516 14.0976 4.102 14.0976 3.71147 13.7071L0.711472 10.7071C0.320948 10.3166 0.320948 9.68342 0.711472 9.29289Z" fill="white"/>
                </svg>
            </div>
        </div>

    const render_type_price = 
        <div className='order-settings-container-item'>
            <div className='order-settings-label'>
                Тип цены
            </div>
            <div className='order-settings-item-col2 position-relative'>
                <Selecter 
                    list_values={PRICE_TYPES} 
                    class_name={'order-currency-selecter text-nowrap'} 
                    setIndex={handlesetPriceType} 
                    selected_value={type_price}
                    is_show={true}
                    setSelecter={()=>{}}
                />
                <svg width="9" height="14" viewBox="0 0 9 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M4.41858 0C4.6838 5.96046e-08 4.93815 0.105357 5.12569 0.292893L8.12569 3.29289C8.51621 3.68342 8.51621 4.31658 8.12569 4.70711C7.73516 5.09763 7.102 5.09763 6.71147 4.70711L4.41858 2.41421L2.12569 4.70711C1.73516 5.09763 1.102 5.09763 0.711472 4.70711C0.320948 4.31658 0.320948 3.68342 0.711472 3.29289L3.71147 0.292893C3.89901 0.105357 4.15336 0 4.41858 0ZM0.711472 9.29289C1.102 8.90237 1.73516 8.90237 2.12569 9.29289L4.41858 11.5858L6.71147 9.29289C7.102 8.90237 7.73516 8.90237 8.12569 9.29289C8.51621 9.68342 8.51621 10.3166 8.12569 10.7071L5.12569 13.7071C4.73516 14.0976 4.102 14.0976 3.71147 13.7071L0.711472 10.7071C0.320948 10.3166 0.320948 9.68342 0.711472 9.29289Z" fill="white"/>
                </svg>
            </div>
            
        </div>

    const render_perc_price = 
        // <div className='row button-currency-settings'>
        //     <div className='currency-settings-item-col1'>
        //         <input className='bg-input' type='number' placeholder='30 ~ 170' onChange={handleChangePercPrice} value={percent_price}/>
        //     </div>
        //     <div className='currency-settings-item-col2'>
        //         %
        //     </div>
        // </div>
        <div>
            <div className='title-text mt-20'>Плавающая цена</div>
            {/* <div className='currency-settings-container mt-1'>
                {render_fix_price}
            </div> */}
            <div className='send-address'>
                <input className='address-to-input-2' type='number' placeholder='30 ~ 170' 
                onChange={handleChangePercPrice} value={percent_price}
            />
                    
                <div className='address-item-col2'>
                    <div style={{color: 'var(--text-mini)'}}>
                        %
                    </div>
                </div>
                
            </div>

            <div className='container-balance'>
                <div className='your-balance-text'>
                    Цена на рынке
                </div>
                <div className='your-balance-q'>
                    {Math.round((price_market * (currencyFiat === 1 ? rub_dollar: 1))*1000)/1000} {CURRENCY_FIAT_LIST[currencyFiat - 1]}
                </div>
            </div>
            <div className='container-balance'>
                <div className='your-balance-text'>
                    Ваша цена
                </div>
                <div className='your-balance-q'>
                    {Math.round((price_market * (currencyFiat === 1 ? rub_dollar: 1))*10*percent_price)/1000} {CURRENCY_FIAT_LIST[currencyFiat - 1]}
                </div>
            </div>
        </div>

    const render_fix_price =
        <div>
            <div className='title-text mt-20'>Фиксированная цена</div>
            {/* <div className='currency-settings-container mt-1'>
                {render_fix_price}
            </div> */}
            <div className='send-address'>
                <input className='address-to-input-2' type='number' placeholder='0' onChange={handleChangePrice} value={price}/>
                    
                <div className='address-item-col2'>
                    <div style={{color: 'var(--text-mini)'}}>
                        {currencyFiat === 1 ? 'Руб': '$'}
                    </div>
                </div>
                
            </div>

            <div className='container-balance'>
                <div className='your-balance-text'>
                    Цена на рынке
                </div>
                <div className='your-balance-q'>
                    {Math.round((price_market * (currencyFiat === 1 ? rub_dollar: 1))*1000)/1000} {CURRENCY_FIAT_LIST[currencyFiat - 1]}
                </div>
            </div>
        </div>  
                    

    const render_summ_sale = 
        // <div className='row button-currency-settings'>
        //     <div className='currency-settings-item-col1'>
        //         <input 
        //             style={parseFloat(quantity_order) > parseFloat(balance) && typeOrder === 's' ? {color: '#DF2E38'}: {}} 
        //             className='bg-input' type='number' placeholder='Сумма' 
        //             onChange={handleChangeQuantityOrder} value={quantity_order}/>
        //     </div>
        //     <div className='currency-settings-item-col2'>
        //         USDT
        //     </div>
        // </div>
        <div>
            <div className='send-address'>
                <input className={isCorrectQuantity() ? 'address-to-input-2': 'address-to-input-2 not-valid'} type='number' placeholder='0 USDT' onChange={handleChangeQuantityOrder} value={quantity_order}/>
                    
                <div className='address-item-col2'>
                    <div style={{color: 'var(--text-mini)'}}>
                        USDT
                    </div>
                </div>
                
            </div>

            <div className='container-balance'>
                <div className='your-balance-text'>
                    Ваш баланс
                </div>
                <div className='your-balance-q'>
                    {currency_order === 1 ? balance: balance_trx + balance_trx_v} USDT
                </div>
            </div>
        </div>  

    const render_limit_order_min = 
            <div className='limit-order-container'>
                <input className={`${isCorrectLimit() ? 'limit-input': 'limit-input-bad'} w-order`} type='number' placeholder='Мин.' onChange={handleChangeLimitOrder} value={limit_order}/>
                
                <div className='currency-fiat-label'>
                    {CURRENCY_FIAT_LIST[currencyFiat - 1]}
                </div>
            </div>

    const render_limit_order_max = 
            <div className='limit-order-container'>
                    <input className='address-to-input-2 w-order' type='number' placeholder='Макс.' onChange={handleChangeLimitOrder} 
                        value={ Math.round((parseFloat(quantity_order) * (type_price === 1 ? price: percent_price*price_market*(currencyFiat === 1 ? rub_dollar: 1)/100))*1000)/1000 }
                    />
                <div className='currency-fiat-label'>
                    {CURRENCY_FIAT_LIST[currencyFiat - 1]}
                </div>
            </div>
        

    const time_limit = 
        <div className='row d-flex justify-content-between p-0 mx-0 mt-10'>
            {/* <div className='currency-settings-item-col1 text-nowrap'>
                Оплатить в течение
            </div>
            <div className='currency-settings-item-col2 '>
                <Selecter 
                    list_values={TIME_LIMITS} 
                    class_name={'select-currency text-nowrap'} 
                    setIndex={(idx) => {dispatch(setTimeLimit(idx + 1))}} 
                    selected_value={timeLimit}
                />{chevron}
            </div> */}
            <div className={`order-rect w-time-limit-2 order-text-2 ${time_limit_order === 1 && 'is-select-1'}`} 
                onClick={ () => dispatch(setTimeLimit(1))} 
            >
                15 мин
            </div>
            <div className={`order-rect w-time-limit-1 order-text-2 ${time_limit_order === 2 && 'is-select-1'}`}
                onClick={ () => dispatch(setTimeLimit(2))}>
                1 час
            </div>
            <div className={`order-rect w-time-limit order-text-2 text-nowrap ${time_limit_order === 3 && 'is-select-1'}`}
                onClick={ () => dispatch(setTimeLimit(3))}>
                6 часов
            </div>
        </div>
    

    return (
        <div className='container-create-order mt-20'>
            <div className='container-title'>
                <div className='title-text'>Создать объявление</div>
                <div className='page-number'>1/4</div>
            </div>

            <div className='order-settings-container mt-20'>
                {type_order}
                {currency_sale}
                {currency_fiat}
                {render_type_price}
            </div>

            
            {type_price === 1 ?
                (
                    <>
                        
                        {render_fix_price}  
                    </>  
                ):
                (
                        
                    <>
                        {render_perc_price}
                    </>
                )
            }

            {/* <div className='t-left-align  mini-info'>{`Цена на маркете: ${Math.round((price_market * (currencyFiat === 1 ? rub_dollar: 1))*1000)/1000}`} {CURRENCY_FIAT_LIST[currencyFiat - 1]}</div>
            <div className='t-left-align  mini-info'>{`Цена в вашем объявлении: ${type_price === 1 ? price: Math.round(price_market*(currencyFiat === 1 ? rub_dollar: 1)*percent_price*1000/100)/1000}`}  {CURRENCY_FIAT_LIST[currencyFiat - 1]}</div> */}


            <div>
                {render_summ_sale}
            </div>

            {/* <div className='t-left-align  mini-info'>{`Ваш баланс: ${currency_order === 1 ? balance: balance_trx + balance_trx_v} USDT`}</div> */}

            <div className='title-text mt-20'>Лимит сделки</div>
            <div className='row d-flex justify-content-between p-0 mx-0 mt-20'>
                    {render_limit_order_min}
                    {render_limit_order_max}
            </div>
            
            <div className='title-text mt-20'>Оплатить в течение</div>
            {time_limit}
            
            {/* <ButtonNext onClick={() => {props.setScreen('createorder2')}}/> */}

            <div 
                onClick={() => {
                    if (isCorrectQuantity() && isCorrectLimit() && isInputData()) props.setScreen('createorder2')
                }} 
                className={`button-send-box ${isCorrectQuantity() && isCorrectLimit() && isInputData() ? 'button-active-send-bg active-text': 'button-send-bg disable-text'} mt-20`}
            >
                {
                    !isCorrectQuantity() ? 'Сумма превышает баланс': 
                    !isCorrectLimit() ? 'Неверный лимит':
                    !isInputData() ? 'Введите данные':
                    'Далее'
                     
                }
            </div>
        </div>
    );
}
