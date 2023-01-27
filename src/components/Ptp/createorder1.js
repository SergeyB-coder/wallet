import React, { useEffect } from 'react';

import { useTelegram } from '../../hooks/useTelegram';

export function CreateOrder1() {
    const {tg} = useTelegram()

    const price_market = 10
    const price_order = 11
    const balance = 3

    const divider = 
        <div className='divider-currency'></div>

    const chevron = 
        <span className='ms-2'>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-expand" viewBox="0 0 16 16">
                <path fill-rule="evenodd" d="M3.646 9.146a.5.5 0 0 1 .708 0L8 12.793l3.646-3.647a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 0-.708zm0-2.292a.5.5 0 0 0 .708 0L8 3.207l3.646 3.647a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 0 0 0 .708z"/>
            </svg>
        </span>

    const currency_sale = 
        <div className='row button-currency-settings'>
            <div className='currency-settings-item-col1'>
                
                Продажа криптовалюты
            </div>
            <div className='currency-settings-item-col2'>
                TON{chevron}
            </div>
            
        </div>
    
    const currency_fiat = 
        <div className='row button-currency-settings'>
            <div className='currency-settings-item-col1'>
                Фиатная валюта
            </div>
            <div className='currency-settings-item-col2'>
                USD{chevron}
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

    const perc_price = 
        <div className='row button-currency-settings'>
            <div className='currency-settings-item-col1'>
                30 ~ 170
            </div>
            <div className='currency-settings-item-col2'>
                %
            </div>
        </div>

    const summ_sale = 
        <div className='row button-currency-settings'>
            <div className='currency-settings-item-col1'>
                Сумма
            </div>
            <div className='currency-settings-item-col2'>
                TON
            </div>
        </div>

    const limit_order = 
        <div className='row button-currency-settings'>
            <div className='currency-settings-item-col1'>
                Мин.
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

    useEffect(() => {
        tg.BackButton.show()
        tg.MainButton.setText('Далее')
    }, );

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
                {perc_price}
            </div>
            <div className='t-left-align  mini-info'>{`Цена на маркете: ${price_market} $`}</div>
            <div className='t-left-align  mini-info'>{`Цена в вашем объявлении: ${price_order} #`}</div>


            <div className='currency-settings-container mt-4'>
                {summ_sale}
            </div>
            <div className='t-left-align  mini-info'>{`Ваш баланс: ${balance} TON`}</div>

            <div className='t-left-align  mt-3'>Лимит сделки</div>
            <div className='currency-settings-container mt-1'>
                {limit_order}
            </div>
            <div className='currency-settings-container mt-1'>
                {time_limit}
            </div>
            

        </div>
    );
}
