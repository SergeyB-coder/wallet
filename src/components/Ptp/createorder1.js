import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CURRENCY_LIST } from '../../const/devdata';
import { Selecter } from '../Common/selecter';
// import { ButtonNext } from './buttonNext';

// import { ButtonNext } from './buttonNext';
import { selectCurrencyType, selectLimitOrder, selectPercentPrice, selectPrice, selectQuantityOrder, setCurrencyFiat, setCurrencyOrder, setCurrencyType, setLimitOrder, setPercentPrice, setPrice, setQuantityOrder } from './ptpSlice';

export function CreateOrder1(props) {
    const dispatch = useDispatch()
    // const setScreen = props.setScreen

    const percent_price = useSelector(selectPercentPrice)
    const quantity_order = useSelector(selectQuantityOrder)
    const limit_order = useSelector(selectLimitOrder)
    const price = useSelector(selectPrice)

    const price_market = 10
    const price_order = 11
    const balance = 3
    
    const CURRENCY_FIAT_LIST = [
        'RUB',
        'USD'
    ]

    const CURRENCY_TYPES = [
        'Фиксированная',
        'Плавающая'
    ]

    const [currencyBalance, setCurrencyBalance] = useState(CURRENCY_LIST[0])
    const [showListCurrency, setShowListCurrency] = useState(false)
    const currencyType = useSelector(selectCurrencyType)

    function handleSetCurrencyType(t) {
        dispatch(setCurrencyType(t))
    }
    
    const handleChangeCurrencyFiat = (e) => {
        dispatch(setCurrencyFiat(e.target.value))
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

    const handleClickCurrencyBalance = () => {
        setShowListCurrency(!showListCurrency)
    }

    function handleClickCurrencyItem(index) {
        console.log(index)
        setCurrencyBalance(CURRENCY_LIST[index])
        dispatch( setCurrencyOrder(index + 1) )
        setShowListCurrency(false)
    }

    const divider = 
        <div className='divider-currency'></div>

    const chevron = 
        <span className='ms-2'>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chevron-expand" viewBox="0 0 16 16">
                <path fillRule="evenodd" d="M3.646 9.146a.5.5 0 0 1 .708 0L8 12.793l3.646-3.647a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 0-.708zm0-2.292a.5.5 0 0 0 .708 0L8 3.207l3.646 3.647a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 0 0 0 .708z"/>
            </svg>
        </span>

    const currency_sale = 
        <div className='row button-currency-settings'>
            <div className='currency-settings-item-col1'>
                Продажа криптовалюты
            </div>
            <div className='currency-settings-item-col2'>
                {/* <select className="select-currency" onChange={handleChangeCurrency}> */}
                    {/* <option className="select-currency" value="1">USDT TRC20</option>
                    <option className="select-currency" value="2">USDT BEP20</option> */}
                    {/* {
                        CURRENCY_LIST.map((currency, index) => {
                            return (
                                <option key={index} className="select-currency" value={index + 1}>{currency}</option>
                            )
                        })
                    }
                </select> */}
                <div style={{position: 'relative'}}>
                        <div style={{color: 'white'}} onClick={handleClickCurrencyBalance}>{currencyBalance}</div>
                        {showListCurrency ? 
                        <div className='currency-list-select'>
                            <div>
                            {CURRENCY_LIST.map((currency, index) => {
                                return (
                                    <div onClick={()=>{handleClickCurrencyItem(index)}} key={index} className="select-currency text-nowrap">{currency}</div>
                                )
                            })}
                            </div>
                        </div>: null}
                    </div>
                {chevron}
            </div>
            
        </div>
    
    const currency_fiat = 
        <div className='row button-currency-settings'>
            <div className='currency-settings-item-col1'>
                Фиатная валюта
            </div>
            <div className='currency-settings-item-col2'>
                <select className="select-currency" aria-label="Default select example" onChange={handleChangeCurrencyFiat}>
                    {
                        CURRENCY_FIAT_LIST.map((currency, index) => {
                            return (
                                <option key={index} className="select-currency" value={(index + 1).toString()}>{currency}</option>
                            )
                        })
                    }
                </select>{chevron}
            </div>
        </div>

    const type_price = 
        <div className='row button-currency-settings'>
            <div className='currency-settings-item-col1'>
                Тип цены
            </div>
            <div className='currency-settings-item-col2'>
                <Selecter list_values={CURRENCY_TYPES} class_name={'select-currency text-nowrap'} setValue={handleSetCurrencyType} selected_value={currencyType}/>{chevron}
            </div>
            
        </div>

    const render_perc_price = 
        <div className='row button-currency-settings'>
            <div className='currency-settings-item-col1'>
                <input className='bg-input' type='number' placeholder='30 ~ 170' onChange={handleChangePercPrice} value={percent_price}/>
            </div>
            <div className='currency-settings-item-col2'>
                %
            </div>
        </div>

    const render_fix_price =
        <div className='row button-currency-settings'>
            <div className='currency-settings-item-col1'>
                <input className='bg-input' type='number' placeholder='0' onChange={handleChangePrice} value={price}/>
            </div>
            <div className='currency-settings-item-col2'>
                $
            </div>
        </div>
                    

    const render_summ_sale = 
        <div className='row button-currency-settings'>
            <div className='currency-settings-item-col1'>
                <input className='bg-input' type='number' placeholder='Сумма' onChange={handleChangeQuantityOrder} value={quantity_order}/>
            </div>
            <div className='currency-settings-item-col2'>
                TON
            </div>
        </div>

    const render_limit_order = 
        <div className='row button-currency-settings'>
            <div className='currency-settings-item-col1'>
                <input className='bg-input' type='number' placeholder='Сумма' onChange={handleChangeLimitOrder} value={limit_order}/>
            </div>
            <div className='currency-settings-item-col2'>
                USD
            </div>
        </div>

    const time_limit = 
        <div className='row button-currency-settings'>
            <div className='currency-settings-item-col1'>
                Оплатить в течение
            </div>
            <div className='currency-settings-item-col2 '>
                <div className='time-limit'>15 мин</div>
            </div>
        </div>
    

    return (
        <div>
            <div className='row  mt-3 text-dark-color'>
                <div className='col-9 t-left-align'>Объявление на продажу</div>
                <div className='col-2'>1/4</div>
            </div>

            <div className='currency-settings-container mt-1'>
                {currency_sale}
                {divider}
                {currency_fiat}
                {divider}
                {type_price}
            </div>

            
            {currencyType === 'Фиксированная' ?
                (
                    <div>
                        <div className='t-left-align  mt-3 text-dark-color'>Фиксированная цена</div>
                        <div className='currency-settings-container mt-1'>
                            {render_fix_price}
                        </div>
                    </div>    
                ):
                (
                    <>
                        <div className='t-left-align  mt-3 text-dark-color'>Доля от плавающей цены</div>
                        <div className='currency-settings-container mt-1'>
                            {render_perc_price}
                        </div>
                    </>
                )
            }

            <div className='t-left-align  mini-info'>{`Цена на маркете: ${price_market} $`}</div>
            <div className='t-left-align  mini-info'>{`Цена в вашем объявлении: ${price_order} #`}</div>


            <div className='currency-settings-container mt-4'>
                {render_summ_sale}
            </div>
            <div className='t-left-align  mini-info'>{`Ваш баланс: ${balance} TON`}</div>

            <div className='t-left-align  mt-3 text-dark-color'>Лимит сделки</div>
            <div className='currency-settings-container mt-1'>
                {render_limit_order}
            </div>
            <div className='currency-settings-container mt-3 mb-3'>
                {time_limit}
            </div>
            
            {/* <ButtonNext onClick={() => {props.setScreen('createorder2')}}/> */}
        </div>
    );
}
