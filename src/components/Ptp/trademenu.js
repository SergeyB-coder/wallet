import React from 'react';
import './style.css'

export function TradeMenu (props) {

    const handleClickCreateOrder = () => {
        props.setScreen('createorder1')
    }

    const arrow_right = 
        <div className='trade-menu-arrow-col'>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-right" viewBox="0 0 16 16">
                <path fill-rule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"/>
            </svg>
        </div>


    const create_order = 
        <div className='row button-trade-menu' onClick={handleClickCreateOrder}>
            <div className='trade-menu-plus-col'>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-plus-circle" viewBox="0 0 16 16">
                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                    <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
                </svg>
            </div>
            <div className='trade-menu-text-col'>
                Создать объявление
            </div>
            {arrow_right}
        </div>


    const buy = 
        <div className='row button-trade-menu'>
            <div className='trade-menu-user-col'>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-person-fill" viewBox="0 0 16 16">
                    <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3Zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"/>
                </svg>
            </div>
            <div className='trade-menu-text-col'>
                Купить
            </div>
            {arrow_right}
        </div>

    const settings_pay = 
        <div className='row button-trade-menu'>
            <div className='trade-menu-user-col'>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-wallet-fill" viewBox="0 0 16 16">
                    <path d="M1.5 2A1.5 1.5 0 0 0 0 3.5v2h6a.5.5 0 0 1 .5.5c0 .253.08.644.306.958.207.288.557.542 1.194.542.637 0 .987-.254 1.194-.542.226-.314.306-.705.306-.958a.5.5 0 0 1 .5-.5h6v-2A1.5 1.5 0 0 0 14.5 2h-13z"/>
                    <path d="M16 6.5h-5.551a2.678 2.678 0 0 1-.443 1.042C9.613 8.088 8.963 8.5 8 8.5c-.963 0-1.613-.412-2.006-.958A2.679 2.679 0 0 1 5.551 6.5H0v6A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-6z"/>
                </svg>
            </div>
            <div className='trade-menu-text-col'>
                Настройки оплаты
            </div>
            {arrow_right}
        </div>

    const divider = 
        <div className='divider'></div>

    return (
        <>
            <div className='trade-menu-container'>
                {buy}
                {divider}
                {settings_pay}
                {divider}
                {create_order}
            </div>
        </>
      );
}