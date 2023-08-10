import React, { useState } from 'react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useTelegram } from '../../hooks/useTelegram';
import { ButtonNext } from '../Common/buttonNext';
import { sendAcceptDeal, sendCancelDeal, sendConfirm, sendEndDeal } from './market/marketApi';
import { selectDealInfo, setDealInfo } from './market/marketSlice';

import clock_gif from '../../static/animations/clock.gif'
import hands_gif from '../../static/animations/hands.gif'
import { selectNameUser } from '../Home/homeSlice';

export function CompleteDeal (props) {
    const dispatch = useDispatch()

    const {tg, first_name, user_id} = useTelegram()

    const navigate = useNavigate()
    const deal_info = useSelector(selectDealInfo)
    // const order_id = useSelector(selectCurrentOrderId)
    const name_user = useSelector(selectNameUser)

    // const [showLoader, setShowLoader] = useState(false)
    const [showWait, setShowWait] = useState(false)
    const [error, setError] = useState('')
    const [isCancelDeal, setIsCancelDeal] = useState(false)

    const handleClickSale = () => {
        // setShowLoader(true)
        // sendAcceptDeal({deal_id: deal_info.deal_id, user_buyer_id: deal_info?.user_id, }, () => {
        sendAcceptDeal({deal: deal_info}, () => {
            // setShowLoader(false)
            let new_deal = {}
            for (let k in deal_info) {
                new_deal[k] = deal_info[k]
            }
            new_deal.status = 'pay'
            dispatch(setDealInfo(new_deal))
        })
    }

    const handleClickEndDeal = () => {
        // setShowLoader(true)
        sendEndDeal(
            {
                deal_id: deal_info.deal_id, 
                order_id: deal_info.order_id, 
                user_to_id: deal_info.id_to ? deal_info.id_to: deal_info.buyer_id,
                user_from: name_user,
                user_from_id: user_id,
                type_order: deal_info.type_order
            }, (data) => {
            // setShowLoader(false)
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
            navigate('/', {replace: true})
            // navigate('/home', {replace: true})
        }
    }

    const hanldeConfirm = () => {
        sendConfirm(
            {
                deal_id: deal_info.deal_id, 
                saler_id: deal_info.buyer_id,
                sum_deal: deal_info?.price * deal_info?.quantity
            }, 
            (data) => {
                console.log(data)
                // setShowConfirmPay(false)
                setShowWait(true)
            }
        )
    }

    
    const handleClickCancelDeal = () => {
        sendCancelDeal({deal_id: deal_info.deal_id, saler_id: deal_info.buyer_id}, (data) => {
            console.log(data)
        })
        setIsCancelDeal(true)
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
        <div className='container-center'>  
            <div className='w-cntr'>
                {/* <div className='mt-5 deal-item p-3'>
                    <div  style={{color: 'var(--text-light-color)'}}>
                        {deal_info.user_to ? deal_info.user_to: deal_info.buyer} { deal_info.type_order === 's' ? ' покупает у вас': ' продает вам'}
                    </div>
                </div> */}

                <div className='container-title mt-20'>
                    <div className='title-text'><span className='title-text-g'>{deal_info.user_to ? deal_info.user_to: deal_info.buyer}</span> { deal_info.type_order === 's' ? ' хочет купить у вас': 'хочет продать вам'}</div>
                </div>

                <div className='title-buy-2 mt-20'>
                    {deal_info?.quantity} {deal_info.currency === 1 ? 'USDT BEP20': 'USDT TRC20'}
                </div>

                <div className='container-center mt-20'>
                    <div className='price-info-buy'>Цена за 1 USDT {deal_info.currency === 1 ? 'BEP20': 'TRC20'} = {deal_info?.price}</div>
                </div>

                <div className='color-bg-cntr h-cntr-deal w-cntr mt-20'>
                    <div className='container-center'>
                        
                        {
                            deal_info?.status === 'pay' &&
                            <img style={{width: '131.4px', height: '132px'}} src={clock_gif} alt=''/>
                        }
                        {
                            deal_info?.status === 'confirm' &&
                            <img style={{width: '131.4px', height: '132px'}} src={hands_gif} alt=''/>
                        }
                    </div>

                    {   deal_info?.status === 'pay' &&
                        <>
                            <div className='wait-text'>
                                Ожидание оплаты
                            </div>  
                            <div className='wait-text-1 mt-20'>
                                От покупателя
                            </div> 
                        </>
                    }

                    {   deal_info?.status === 'confirm' &&
                        <>
                            <div className='wait-text'>
                                Платеж совершен
                            </div>  
                            <div className='wait-text-1 mt-20'>
                                покупателем
                            </div> 
                        </>
                    }
                </div>

                
                <div className='container-center mt-20'>
                    <div className='w-100'>
                        <div className='order-row-1'>
                            <div className='order-label-2'>
                                Метод оплаты
                            </div>
                            <div className='order-info-3'>
                                {deal_info.company}
                            </div>
                        </div>

                        <div className='order-line-container'>
                            <div className='order-line'></div>
                        </div> 

                        <div className='order-row-1'>
                            <div className='order-label-2'>
                                Сумма
                            </div>
                            <div className='order-info-3'>
                                {deal_info?.price * deal_info?.quantity} {deal_info?.fiat === 1 ? 'RUB': 'USD'}
                            </div>
                        </div>

                        <div className='order-line-container'>
                            <div className='order-line'></div>
                        </div>  
                    </div>
                </div>

                {
                    deal_info?.status === 'confirm' &&
                    <div onClick={hanldeConfirm} className='button-send-box button-active-send-bg active-text mt-20'>
                            Подтвердить платеж
                        </div>
                }

                {
                    deal_info.status === 'request' && !isCancelDeal &&
                    <div className='row-2 mt-20'>
                        <div className='btn-disable-deal' onClick={handleClickCancelDeal}>
                            Отказаться
                        </div>

                        <div className='btn-accept-deal' onClick={handleClickButton}>
                            Принять запрос
                        </div>
                    </div>
                }
                
                {/* {error !== 'Транзакция выполнена' && 
                    showLoader ? 
                    <div className="loader"></div>:
                    <>
                        {deal_info.status !== 'pay' && !isCancelDeal &&
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

                {
                    deal_info.status === 'request' && !isCancelDeal &&
                    <div className='button-cancel-deal mt-3' onClick={handleClickCancelDeal}>
                        Отказаться от сделки
                    </div>
                } */}

                {
                    isCancelDeal && <div className='mini-info'>Сделка отменена</div>
                }

                {deal_info.status === 'pay' && !showWait &&
                    (
                        deal_info.type_order === 's' ?
                        <div className='mini-info'>Ожидание оплаты</div>:
                        <div className='m-4'>
                            <div className='label-deal-fiat'>Переведите фиаты по следующим реквизитам:</div>
                            <div className='label-deal-fiat'>{deal_info.company}</div>
                            <div className='label-deal-fiat mb-3'>{deal_info.card_number}</div>
                            <ButtonNext text='Оплачено' onClick={hanldeConfirm}/>
                        </div>
                        
                    ) 
                }

                {showWait && <div className='mini-info'>Дождитесь подтверждения об оплате</div>}

                {!error && deal_info.status === 'confirm' && <div className='mini-info mt-2'>Получатель подтвердил оплату</div>}

                <div className='open-chat-btn mt-20' onClick={()=>{navigate(`/chat/${deal_info.deal_id}`, {replace: true})}}>
                    {!error && 'Чат с покупателем'}
                </div>
                <div className='container-center'>
                    <div className='line-green'></div>
                </div>

                {error && <label style={{color: 'var(--text-mini)'}}>{error}</label>}
            </div>
        </div>
      );
}

