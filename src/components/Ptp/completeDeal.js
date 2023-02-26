import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { ButtonNext } from '../Common/buttonNext';
import { Chat } from './chat/chat';
import { sendAcceptDeal, sendEndDeal } from './market/marketApi';
import { selectCurrentOrderId, selectDealInfo } from './market/marketSlice';

export function CompleteDeal (props) {
    const handleClose = props.handleClose
    const deal_info = useSelector(selectDealInfo)
    const order_id = useSelector(selectCurrentOrderId)

    const [statusDeal, setStatusDeal] = useState('request')
    const [showLoader, setShowLoader] = useState(false)
    const [showChat, setShowChat] = useState(false)

    const handleClickSale = () => {
        setShowLoader(true)
        sendAcceptDeal({deal_id: deal_info.id, user_buyer_id: deal_info?.user_id}, () => {
            setShowLoader(false)
            setStatusDeal('pay')
        })
    }

    const handleClickEndDeal = () => {
        setShowLoader(true)
        sendEndDeal({deal_id: deal_info.id, order_id: order_id}, () => {
            setShowLoader(false)
            handleClose()
        })
    }

    const handleClickButton = () => {
        if (statusDeal === 'request') {
            handleClickSale()
        }
        else if (statusDeal === 'pay') {
            handleClickEndDeal()
        }
    }

    return (
        <div className='p-2'>  
            <div className='mt-5 deal-item p-3'>
                <div  style={{color: 'var(--text-light-color)'}}>
                    {deal_info?.first_name}
                </div>
            </div>
            <div className='my-2' style={{color: 'var(--text-light-color)'}}>
                Хочет купить
            </div>
            <div className='mb-3' style={{color: 'var(--text-light-color)'}}>
                {deal_info?.quantity} {deal_info.currency}
            </div>

            
            
            {
                showLoader ? 
                <div class="loader"></div>:
                <ButtonNext text={statusDeal === 'request' ? 'Принять запрос': 'Подтвердить оплату'} onClick={handleClickButton}/>
            }

            <div className='open-chat-btn my-3' onClick={() => {setShowChat(!showChat)}}>
                {showChat ? 'Закрыть чат': 'Открыть чат'}
            </div>
                
            {
                showChat &&
                <Chat deal_id={deal_info.id}/>
            }
        </div>
      );
}

