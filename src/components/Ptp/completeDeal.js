import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { sendAcceptDeal, sendEndDeal } from './market/marketApi';
import { selectCurrentOrderId, selectDealInfo } from './market/marketSlice';

export function CompleteDeal (props) {
    const setShowCompleteDeal = props.setShowCompleteDeal
    const deal_info = useSelector(selectDealInfo)
    const order_id = useSelector(selectCurrentOrderId)

    const [statusDeal, setStatusDeal] = useState('request')

    const handleClickSale = () => {
            sendAcceptDeal({deal_id: deal_info.id, user_buyer_id: deal_info?.user_id}, () => {
            setStatusDeal('pay')
        })
    }

    
    const handleClickEndDeal = () => {
        sendEndDeal({deal_id: deal_info.id, order_id: order_id}, () => {
            setShowCompleteDeal(false)
        })
    }

    return (
        <>  
            <div className='row mt-5 deal-item p-3'>
                <div className='w-50' style={{textAlign: 'left'}}>
                    {deal_info?.first_name}
                </div>
                {statusDeal === 'request'  ?
                    <div className='w-50' onClick={handleClickSale}>
                        Продать
                    </div>:
                    <div className='w-50' onClick={handleClickEndDeal}>
                        Оплата получена
                    </div>
                }
            </div>
            <div className='row deal-item p-3'>
                <div className='w-50' style={{textAlign: 'left'}}>
                    Хочет купить
                </div>
                <div className='w-50'>
                    {deal_info?.quantity} USDT
                </div>
            </div>
                
        </>
      );
}

