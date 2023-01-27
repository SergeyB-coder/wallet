import React, { useEffect } from 'react';

import { useTelegram } from '../../hooks/useTelegram';
import { ButtonNext } from './buttonNext';

export function CreateOrder2() {
    const {tg} = useTelegram()

    const bank = 'Raiffeisen Bank'
    const card = 'Raiffeisen Bank - 12345'
    const list_methods = ['Payeer', 'AdvCash', 'Webmoney']

    const divider = 
        <div className='divider-currency m-m-10'></div>

    const arrow_right = 
        <div className='trade-menu-arrow-col'>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-right" viewBox="0 0 16 16">
                <path fill-rule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"/>
            </svg>
        </div>

    const renderListMethods = list_methods.map((method, index) => {
        return (
            <>
                <div className='row button-trade-menu'>
                    <div className='method-name-col'>
                        {method}
                    </div>
                    {arrow_right}
                </div>
                {index !== list_methods.length - 1 && divider}
            </>
        )
    })

    const method_pay = 
        <div className='row button-currency-settings'>
            <div className='currency-settings-item-col1'>
                <div>
                    <div className='method-pay-text'>{bank}</div>
                    <div className='method-pay-text'>{card}</div>
                </div>
            </div>
            <div className='method-pay-col2'>
                <div className='form-check form-switch'>
                    <input className="form-check-input" type="checkbox" />
                </div>
            </div>
                
        </div>

    useEffect(() => {
        tg.BackButton.show()
        tg.MainButton.setText('Далее')
    }, );

    return (
        <div>
            <div className='row  mt-3'>
                <div className='col-9 t-left-align'>Добавить методы оплаты</div>
                <div className='col-2'>2/4</div>
            </div>

            <div className='currency-settings-container mt-1'>
                {method_pay}
            </div>

            
            <div className='trade-menu-container mt-5'>
                {renderListMethods}
            </div>
            
            <ButtonNext/>
        </div>
    );
}
