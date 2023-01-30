import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useTelegram } from '../../../hooks/useTelegram';
import { getOrders } from './marketApi';
import { selectOrders, setOrders } from './marketSlice';

import './style.css'


export function Market() {
    const {tg} = useTelegram()
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const orders = useSelector(selectOrders)

    const backScreen = (() => {
        navigate('/', {replace: true})
    })
    
    useEffect(() => {
        getOrders({user_id: ''}, (data) => {
            dispatch(setOrders(data.orders))
        })
    }, [dispatch]);

    useEffect(() => {
        tg.MainButton.hide()
        tg.BackButton.show()
    }, );

    useEffect(() => {
        tg.onEvent('backButtonClicked', backScreen)
            return () => {tg.offEvent('backButtonClicked', backScreen)}
        }, )

    return (
        <div className='market-container'>
            Market

            {orders.map((order) => {
                return (
                    <>
                        <div className='order-item'>
                            <div>{order.quantity}</div>
                            <div>{order.price}</div>
                            <div>{order.datetime}</div>
                        </div>
                        
                    </>
                )
            })}
        </div>
    );
}
