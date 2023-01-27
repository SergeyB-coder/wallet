import React, { useEffect } from 'react';
import { ButtonNext } from './buttonNext';

export function CreateOrder4(props) {
    const setScreen = props.setScreen
    const price = 2.48
    const divider = 
        <div className='divider-test-order'></div>

    return (
        <div>
            <div className='row  mt-3'>
                <div className='col-9 t-left-align'>Проверка объявления</div>
                <div className='col-2'>4/4</div>
            </div>
            
            <div className='test-order-container mt-3 mb-5'>
                <div className='row d-flex align-items-center'>
                    <div className='test-order-col1'>
                        <div className='test-order-price'>{`${price} USD`}</div>
                        <div className='test-order-text'>Плавающая цена за 1 TON</div>
                    </div>
                    <div className='test-order-col2'>
                        <div className='test-order-buy'>
                            Купить
                        </div>
                    </div>
                </div>
                
                {divider}

                <div className='row'>
                    <div className='test-order-info-col d-flex flex-column justify-content-start'>
                        <p>Regal Horse</p>
                        <p>Сумма</p>
                        <p>Лимиты</p>
                        <p>Методы оплаты</p>
                        <p className='text-nowrap'>Оплатить в течение</p>
                    </div>
                    <div className='test-order-info-col'>
                        <p>3 TON</p>
                        <p  className='text-nowrap'>2,00198 ~ 2,989 TON</p>
                        <p>5 - 7.36 USD</p>
                        <p>Raiffeisen Bank</p>
                        <p>15 мин</p>
                    </div>

                </div>

            </div>
            <ButtonNext onClick={() => setScreen('createorder4')}/>
        </div>
    );
}
