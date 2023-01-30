import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getOrders } from './marketApi';
import { selectOrders, setOrders } from './marketSlice';

import './style.css'
// import { useSelector, useDispatch } from 'react-redux';
// window.Telegram.WebApp

export function Market(props) {
    const dispatch = useDispatch()

    const orders = useSelector(selectOrders)


    
    useEffect(() => {
        getOrders({user_id: ''}, (data) => {
            dispatch(setOrders(data.orders))
        })
    }, [dispatch]);
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
