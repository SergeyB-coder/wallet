import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CURRENCY_FIAT_LIST, CURRENCY_LIST, CURRENCY_TYPES, TIME_LIMITS } from '../../const/devdata';
import { Selecter } from '../Common/selecter';
import { selectBalance, selectBalanceTRX } from '../Home/homeSlice';
// import { ButtonNext } from './buttonNext';
// import { ButtonNext } from './buttonNext';
// import { ButtonNext } from './buttonNext';

// import { ButtonNext } from './buttonNext';
import { selectCurrencyFiat, selectCurrencyOrder, selectCurrencyType, selectLimitOrder, selectPercentPrice, selectPrice, selectQuantityOrder, selectTimeLimit, setCurrencyFiat, setCurrencyOrder, setCurrencyType, setLimitOrder, setPercentPrice, setPrice, setQuantityOrder, setTimeLimit } from './ptpSlice';

export function CreateOrder1(props) {
    const dispatch = useDispatch()
    // const setScreen = props.setScreen

    const percent_price = useSelector(selectPercentPrice)
    const quantity_order = useSelector(selectQuantityOrder)
    const limit_order = useSelector(selectLimitOrder)
    const price = useSelector(selectPrice)
    const timeLimit = useSelector(selectTimeLimit)

    const price_market = 10
    const balance = useSelector(selectBalance)
    const balance_trx = useSelector(selectBalanceTRX)
    
    

    const currency_order = useSelector(selectCurrencyOrder)
    const currencyType = useSelector(selectCurrencyType)
    const currencyFiat = useSelector(selectCurrencyFiat)

    function handleSetCurrencyType(index) {
        dispatch(setCurrencyType(index + 1))
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
            <div className='currency-settings-item-col1 text-nowrap'>
                Продажа криптовалюты
            </div>
            <div className='currency-settings-item-col2'>
                <Selecter 
                    list_values={CURRENCY_LIST} 
                    class_name={'select-currency text-nowrap'} 
                    setIndex={handleClickCurrencyItem} 
                    selected_value={currency_order}
                />{chevron}
            </div>
            
        </div>
    
    const currency_fiat = 
        <div className='row button-currency-settings'>
            <div className='currency-settings-item-col1'>
                Фиатная валюта
            </div>
            <div className='currency-settings-item-col2'>
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
                    class_name={'select-currency text-nowrap'} 
                    setIndex={handleChangeCurrencyFiat} 
                    selected_value={currencyFiat}
                />{chevron}
            </div>
        </div>

    const type_price = 
        <div className='row button-currency-settings'>
            <div className='currency-settings-item-col1'>
                Тип цены
            </div>
            <div className='currency-settings-item-col2'>
                <Selecter 
                    list_values={CURRENCY_TYPES} 
                    class_name={'select-currency text-nowrap'} 
                    setIndex={handleSetCurrencyType} 
                    selected_value={currencyType}
                />{chevron}
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
                {currencyFiat === 1 ? 'Руб': '$'}
            </div>
        </div>
                    

    const render_summ_sale = 
        <div className='row button-currency-settings'>
            <div className='currency-settings-item-col1'>
                <input className='bg-input' type='number' placeholder='Сумма' onChange={handleChangeQuantityOrder} value={quantity_order}/>
            </div>
            <div className='currency-settings-item-col2'>
                USDT
            </div>
        </div>

    const render_limit_order = 
        <div className='row button-currency-settings'>
            <div className='currency-settings-item-col1'>
                <input className='bg-input' type='number' placeholder='Сумма' onChange={handleChangeLimitOrder} value={limit_order}/>
            </div>
            <div className='currency-settings-item-col2'>
                {CURRENCY_FIAT_LIST[currencyFiat - 1]}
            </div>
        </div>

    const time_limit = 
        <div className='row button-currency-settings'>
            <div className='currency-settings-item-col1'>
                Оплатить в течение
            </div>
            <div className='currency-settings-item-col2 '>
                <Selecter 
                    list_values={TIME_LIMITS} 
                    class_name={'select-currency text-nowrap'} 
                    setIndex={(idx) => {dispatch(setTimeLimit(idx + 1))}} 
                    selected_value={timeLimit}
                />{chevron}
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

            
            {currencyType === 1 ?
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
            <div className='t-left-align  mini-info'>{`Цена в вашем объявлении: ${price} #`}</div>


            <div className='currency-settings-container mt-4'>
                {render_summ_sale}
            </div>
            <div className='t-left-align  mini-info'>{`Ваш баланс: ${currency_order === 1 ? balance: balance_trx} USDT`}</div>

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
