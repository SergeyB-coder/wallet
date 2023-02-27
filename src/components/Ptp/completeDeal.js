import React, { useState } from 'react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useTelegram } from '../../hooks/useTelegram';
import { ButtonNext } from '../Common/buttonNext';
import { sendAcceptDeal, sendEndDeal } from './market/marketApi';
import { selectCurrentOrderId, selectDealInfo, setDealInfo } from './market/marketSlice';

export function CompleteDeal (props) {
    const dispatch = useDispatch()

    const {tg} = useTelegram()

    const navigate = useNavigate()
    const deal_info = useSelector(selectDealInfo)
    const order_id = useSelector(selectCurrentOrderId)

    const [showLoader, setShowLoader] = useState(false)
    const [error, setError] = useState('')

    const handleClickSale = () => {
        setShowLoader(true)
        sendAcceptDeal({deal_id: deal_info.deal_id, user_buyer_id: deal_info?.user_id}, () => {
            setShowLoader(false)
            let new_deal = {}
            for (let k in deal_info) {
                new_deal[k] = deal_info[k]
            }
            new_deal.status = 'pay'
            dispatch(setDealInfo(new_deal))
        })
    }

    const handleClickEndDeal = () => {
        setShowLoader(true)
        sendEndDeal({deal_id: deal_info.deal_id, order_id: order_id}, (data) => {
            setShowLoader(false)
            if (data.error) {
                setError(data.error)
            }
            else {
                setError('Транзакция выполнена')
            }
            // handleClose()
        })
    }

    const handleClickButton = () => {
        if (deal_info.status === 'request') {
            handleClickSale()
        }
        else if (deal_info.status === 'pay') {
            handleClickEndDeal()
        }
    }

    const backScreen = (() => {
        navigate('/ptp', {replace: true})
    })

    useEffect(() => {
        tg.BackButton.show()
        tg.onEvent('backButtonClicked', backScreen)
            return () => {tg.offEvent('backButtonClicked', backScreen)}
        }, )

    return (
        <div className='p-2'>  
            <div className='mt-5 deal-item p-3'>
                <div  style={{color: 'var(--text-light-color)'}}>
                    {deal_info?.user_to}
                </div>
            </div>
            <div className='my-2' style={{color: 'var(--text-light-color)'}}>
                Хочет купить
            </div>
            <div className='mb-3' style={{color: 'var(--text-light-color)'}}>
                {deal_info?.quantity} {deal_info.currency}
            </div>

            
            
            {error !== 'Транзакция выполнена' &&
                showLoader ? 
                <div class="loader"></div>:
                <ButtonNext text={deal_info.status === 'request' ? 'Принять запрос': 'Подтвердить оплату'} onClick={handleClickButton}/>
            }

            <div className='open-chat-btn my-3' onClick={()=>{navigate(`/chat/${deal_info.deal_id}`, {replace: true})}}>
                Открыть чат
            </div>

            {error && <label style={{color: 'var(--text-mini)'}}>{error}</label>}
        </div>
      );
}

