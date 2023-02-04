import React from 'react';


export function OrderItem (props) {
    const order = props.order
    const onClick = props.onClick

    const divider = 
    <div className='divider'></div>

    return (
        <>
            <div className='order-item' key={order.id}>
                <div className='row mb-3'>
                    <div className='order-price mt-3'>{order.price}
                        <span> {order.currency_fiat_id === '1' ? ' RUB': 'USD'}</span>
                    </div>
                    {/* <div className='order-buy mt-3' onClick={onClick}>Купить</div> */}
                    {order.status === 'request' ? <div className='order-request mt-3' onClick={() => onClick(order.id)}>Запрос</div>: null}
                </div>
                {divider}

                {/* <div className='row mt-3'>
                    <div className='order-user-name'>
                        {order.first_name}
                    </div>
                    <div className='order-info'>
                        Заявок 0
                    </div>
                </div> */}

                <div className='row mt-3'>
                    <div className='order-label'>
                        Доступно
                    </div>
                    <div className='order-info'>
                        {order.quantity} USDT
                    </div>
                </div>

                <div className='row mt-3'>
                    <div className='order-label'>
                        Лимиты
                    </div>
                    <div className='order-info'>
                        {order.limit_order} USDT
                    </div>
                </div>
                
                <div className='row mt-3'>
                    <div className='order-label'>
                        Методы оплаты
                    </div>
                    <div className='order-info'>
                        Raiffeisen
                    </div>
                </div>
            </div>
        </>
    );
}



