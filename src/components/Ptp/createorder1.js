import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { ButtonNext } from './buttonNext';
import { selectLimitOrder, selectPercentPrice, selectQuantityOrder, setCurrencyFiat, setCurrencyOrder, setLimitOrder, setPercentPrice, setQuantityOrder } from './ptpSlice';

export function CreateOrder1(props) {
    const dispatch = useDispatch()
    const setScreen = props.setScreen

    const percent_price = useSelector(selectPercentPrice)
    const quantity_order = useSelector(selectQuantityOrder)
    const limit_order = useSelector(selectLimitOrder)

    const price_market = 10
    const price_order = 11
    const balance = 3
    const CURRENCY_LIST = [
        'USDT TRC20',
        'USDT BEP20'
    ]
    const CURRENCY_FIAT_LIST = [
        'RUB',
        'USD'
    ]

    const handleChangeCurrency = (e) => {
        dispatch(setCurrencyOrder(e.target.value))
    }
    
    const handleChangeCurrencyFiat = (e) => {
        dispatch(setCurrencyFiat(e.target.value))
    }
    
    const handleChangePercPrice = (e) => {
        dispatch(setPercentPrice(e.target.value))
    }
    
    const handleChangeQuantityOrder = (e) => {
        dispatch(setQuantityOrder(e.target.value))
    }
    
    const handleChangeLimitOrder = (e) => {
        dispatch(setLimitOrder(e.target.value))
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
                <select className="select-currency" onChange={handleChangeCurrency}>
                    {/* <option className="select-currency" value="1">USDT TRC20</option>
                    <option className="select-currency" value="2">USDT BEP20</option> */}
                    {
                        CURRENCY_LIST.map((currency, index) => {
                            return (
                                <option key={index} className="select-currency" value="2">{currency}</option>
                            )
                        })
                    }
                </select>{chevron}
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
                                <option key={index} className="select-currency" value="2">{currency}</option>
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
                Плавающая{chevron}
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
            <div className='currency-settings-item-col2'>
                <div className='time-limit'>15 мин</div>
            </div>
        </div>
    

    return (
        <div>
            <div className='row  mt-3'>
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

            
            <div className='t-left-align  mt-3'>Доля от плавающей цены</div>
            <div className='currency-settings-container mt-1'>
                {render_perc_price}
            </div>
            <div className='t-left-align  mini-info'>{`Цена на маркете: ${price_market} $`}</div>
            <div className='t-left-align  mini-info'>{`Цена в вашем объявлении: ${price_order} #`}</div>


            <div className='currency-settings-container mt-4'>
                {render_summ_sale}
            </div>
            <div className='t-left-align  mini-info'>{`Ваш баланс: ${balance} TON`}</div>

            <div className='t-left-align  mt-3'>Лимит сделки</div>
            <div className='currency-settings-container mt-1'>
                {render_limit_order}
            </div>
            <div className='currency-settings-container mt-3 mb-3'>
                {time_limit}
            </div>
            
            <ButtonNext onClick={() => {setScreen('createorder2')}}/>
        </div>
    );
}
