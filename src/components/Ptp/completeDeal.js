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

    const {tg, first_name} = useTelegram()

    const navigate = useNavigate()
    const deal_info = useSelector(selectDealInfo)
    const order_id = useSelector(selectCurrentOrderId)

    const [showLoader, setShowLoader] = useState(false)
    const [error, setError] = useState('')

    const handleClickSale = () => {
        setShowLoader(true)
        // sendAcceptDeal({deal_id: deal_info.deal_id, user_buyer_id: deal_info?.user_id, }, () => {
        sendAcceptDeal({deal: deal_info}, () => {
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
        sendEndDeal(
            {
                deal_id: deal_info.deal_id, 
                order_id: order_id, 
                user_to_id: deal_info.id_to ? deal_info.id_to: deal_info.buyer_id,
                user_from: first_name
            }, (data) => {
            setShowLoader(false)
            if (data.error) {
                setError(data.error)
            }
            else {
                setError('Сделка совершена')
            }
            // handleClose()
        })
    }

    const handleClickButton = () => {
        if (deal_info.status === 'request') {
            handleClickSale()
        }
        else if (deal_info.status === 'confirm' && !error) {
            handleClickEndDeal()
        }
        else if (error) {
            navigate('/home', {replace: true})
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
        <div className='p-3'>  
            <div className='mt-5 deal-item p-3'>
                <div  style={{color: 'var(--text-light-color)'}}>
                    {`${deal_info.user_to ? deal_info.user_to: deal_info.buyer} покупает у вас `}
                </div>
            </div>
            <div className='mb-3' style={{color: 'var(--text-light-color)'}}>
                {deal_info?.quantity} {deal_info.currency === '1' ? 'USDT BEP20': 'USDT TRC20'}
            </div>

            <div className='row mt-3 mb-3'>
                    <div className='sale-label-l'>
                        Цена
                    </div>
                    <div className='sale-label-r text-nowrap'>
                        {deal_info?.price} {deal_info?.fiat === '1' ? 'RUB': 'USD'}
                    </div>
                </div>

                <div className='row mt-3 mb-3'>
                    <div className='sale-label-l'>
                        Сумма покупки
                    </div>
                    <div className='sale-label-r text-nowrap'>
                        {deal_info?.price * deal_info?.quantity} {deal_info?.fiat === '1' ? 'RUB': 'USD'}
                    </div>
                </div>

                <div className='row mb-3 mt-3'>
                        <div className='sale-label-l'>
                            Методы оплаты
                        </div>
                        <div className='sale-label-r'>
                            {deal_info.company}
                        </div>
                </div>
            
            
            {error !== 'Транзакция выполнена' &&
                showLoader ? 
                <div className="loader"></div>:
                <>
                    {deal_info.status !== 'pay' &&
                        <ButtonNext 
                            text={
                                deal_info.status === 'request' ? 'Принять запрос': 
                                error ? 'Проверить баланс':
                                'Подтвердить платеж'} 
                            onClick={handleClickButton}
                        />
                    }
                </>
            }

            {deal_info.status === 'pay' && <div className='mini-info'>Ожидание оплаты</div>}

            {!error && deal_info.status === 'confirm' && <div className='mini-info mt-2'>Получатель подтвердил оплату</div>}

            <div className='open-chat-btn my-3' onClick={()=>{navigate(`/chat/${deal_info.deal_id}`, {replace: true})}}>
                {!error && 'Открыть чат'}
            </div>

            {error && <label style={{color: 'var(--text-mini)'}}>{error}</label>}
        </div>
      );
}

