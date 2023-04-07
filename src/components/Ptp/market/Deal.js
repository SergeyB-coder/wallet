import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { useTelegram } from '../../../hooks/useTelegram';
// import { ButtonNext } from '../../Common/buttonNext';
import { getDealInfo, sendConfirm, sendEndDeal } from './marketApi';
import { selectDealScreenInfo, setDealInfo, setDealScreenInfo } from './marketSlice';
import { svg_hands, svg_salute } from '../../../const/svgs';
// import { useDispatch, useSelector } from 'react-redux';
// import { useTelegram } from '../../../hooks/useTelegram';
// import { ButtonNext } from '../buttonNext';
// import { sendBuy } from './marketApi';
// import { selectQuantityBuy, setQuantityBuy } from './marketSlice';
import clock_gif from '../../../static/animations/clock.gif'
export function Deal () {
    const {tg, user_id, first_name} = useTelegram()
    const { deal_id } = useParams();
    const navigate = useNavigate()

    const dispatch = useDispatch()
    const deal_screen_info = useSelector(selectDealScreenInfo)

    const [showConfirmPay, setShowConfirmPay] = useState(false)
    const [showWait, setShowWait] = useState(false)
    const [showLoader, setShowLoader] = useState(false)
    const [error, setError] = useState('')

    const [timer, setTimer] = useState(60);
    let t = 60

    const str_type_deal = deal_screen_info?.type_order === 'b' ? 'Вы продаете': 'Вы покупаете'

    
    // eslint-disable-next-line react-hooks/exhaustive-deps
    function handleGetDealInfo() {
        console.log('handleGetDealInfo', deal_id)
        getDealInfo( {deal_id: deal_id === '0' ? deal_screen_info?.deal_id: deal_id}, (data) => {
            console.log('handleGetDealInfo deal', data)
            if (data.deal.saler_id.toString() === user_id.toString()) {
                dispatch(setDealInfo(data.deal))
                navigate('/completedeal', {replace: true})
            }
            else {
                dispatch(setDealScreenInfo(data.deal))    
                if (data.deal.status === "pay") {
                    setShowConfirmPay(true)
                }
                else if (data.deal.status === "request") {
                    const I = setInterval(()=>{
                        if (t === 0) clearInterval(I)
                        t--;
                        setTimer(t)
                    }, 1000)
                }

                
            }
            
        }) 
    }

    // const handleClickRefresh = () => {
    //      handleGetDealInfo(deal_screen_info.deal_id)
    // }

    const hanldeConfirm = () => {
        sendConfirm({deal_id: deal_screen_info.deal_id, saler_id: deal_screen_info.saler_id}, (data) => {
            console.log(data)
            setShowConfirmPay(false)
            setShowWait(true)
        })
    }

    const handleClickEndDeal = () => {
        setShowLoader(true)
        console.log('deal_screen_info', deal_screen_info)
        sendEndDeal(
            {
                deal_id: deal_screen_info.deal_id, 
                order_id: deal_screen_info.order_id, 
                user_to_id: deal_screen_info.type_order === 's' ?
                    (deal_screen_info.id_to ? deal_screen_info.id_to: deal_screen_info.buyer_id):
                    (deal_screen_info.id_from ? deal_screen_info.id_from: deal_screen_info.saler_id),
                user_from: first_name,
                user_from_id: user_id,
                type_order: deal_screen_info.type_order
            }, (data) => {
            handleGetDealInfo()
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

    const backScreen = (() => {
        navigate('/ptp', {replace: true})
    })

    useEffect(() => {
            handleGetDealInfo()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        tg.onEvent('backButtonClicked', backScreen)
            return () => {tg.offEvent('backButtonClicked', backScreen)}
        }, )

    return (
        <div className='container-center'>
            <div style={{width: '335px'}}>
                <div className='title-buy-label mt-20'>Сделка № {deal_screen_info?.deal_id}</div>
                {/* <div className='title-buy'>{str_type_deal} {deal_screen_info?.saler}</div> */}
                <div className='title-buy mt-20'>{str_type_deal}</div>
                

                {/* <label style={{color: 'var(--text-light-color)'}}>Количество:</label> */}
                <div className='title-buy-2'>{deal_screen_info?.quantity} USDT {deal_screen_info?.currency === 1 ? 'BEP20': 'TRC20'}</div>

                <div className='saler-buyer mt-20'>{str_type_deal.charAt(3).toUpperCase() + str_type_deal.slice(4, str_type_deal.length-1)} {deal_screen_info?.saler}</div>

                <div className='color-bg-cntr h-cntr-deal w-cntr mt-20'>
                    {/* <label style={{color: 'var(--btn-bg-color)', fontSize: 15}}>Статус</label><br></br> */}
                    
                    <div className='container-center'>
                        {
                            showConfirmPay && deal_screen_info?.type_order === 's' ? svg_hands: 
                            deal_screen_info?.status === 'end' ? svg_salute:
                            <img style={{width: '131.4px', height: '132px'}} src={clock_gif} alt=''/>
                        }
                    </div>

                    <div className='wait-text'>
                        {   deal_screen_info?.type_order === 's' ?
                            (
                                deal_screen_info?.status === "request" ? 'Ожиданием подтверждения': 
                                showWait ? 'Дождитесь подтверждения об оплате': 
                                deal_screen_info?.status === 'end' ? `Вам начислено ${deal_screen_info?.quantity} USDT`:
                                'Продавец подтвердил зявку'
                            ):
                            (
                                deal_screen_info?.status === "request" ? 'Ожидание подтверждения покупателя': 
                                deal_screen_info?.status === 'pay' ? 'Ожидание оплаты':
                                deal_screen_info?.status === 'confirm' ? 'Получатель подтвердил оплату':
                                deal_screen_info?.status === 'end' ? 'Сделка совершена':
                                ''
                            )
                        }   
                    </div>      
                    <div className='wait-text-1 mt-20'>
                        {  
                            deal_screen_info?.status === 'end' ? 'Сделка совершена': 
                            
                            deal_screen_info?.type_order === 's' ? 'от продавца': 
                            
                            'от покупателя'
                        }  
                    </div>       
                </div>

                {/* <div className='deal-info-container mt-4 mb-3 mx-3'>

                    <div className='row mb-3 mt-3'>
                            <div className='buy-label'>
                                Методы оплаты
                            </div>
                            <div className='buy-info'>
                                {deal_screen_info?.company}
                            </div>
                    </div>

                    <div className='row mt-3 mb-3'>
                        <div className='buy-label'>
                            Цена
                        </div>
                        <div className='buy-info text-nowrap'>
                            {deal_screen_info?.price} {deal_screen_info?.fiat === 1 ? 'RUB': 'USD'}
                        </div>
                    </div>

                    <div className='row mt-3 mb-3'>
                        <div className='buy-label'>
                            Сумма покупки
                        </div>
                        <div className='buy-info text-nowrap'>
                            {Math.round(deal_screen_info?.price * deal_screen_info?.quantity*1000)/1000} {deal_screen_info?.fiat === 1 ? 'RUB': 'USD'}
                        </div>
                    </div>

                    <div onClick={handleClickRefresh}>
                        {!showConfirmPay && 'Обновить'}
                    </div>

                </div> */}

                <div className='container-center mt-20'>
                        <div className='w-100'>
                            <div className='order-row-1'>
                                <div className='order-label-2'>
                                    Методы оплаты
                                </div>
                                <div className='order-info-3'>
                                    {deal_screen_info?.company}
                                </div>
                            </div>

                            <div className='order-line-container'>
                                <div className='order-line'></div>
                            </div>

                            <div className='order-row-1'>
                                <div className='order-label-2'>
                                    Цена
                                </div>
                                <div className='order-info-3'>
                                    {deal_screen_info?.price} {deal_screen_info?.fiat === 1 ? 'RUB': 'USD'}
                                </div>
                            </div>

                            <div className='order-line-container'>
                                <div className='order-line'></div>
                            </div>

                            {/* <div className='row mt-3'>
                                <div className='buy-label text-nowrap'>
                                    Детали объявления
                                </div> */}
                                {/* <div className='buy-info'>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chevron-right" viewBox="0 0 16 16">
                                        <path fillRule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"/>
                                    </svg>
                                </div> */}
                            {/* </div> */}

                            <div className='order-row-1'>
                                <div className='order-label-2'>
                                    Сумма покупки
                                </div>
                                <div className='order-info-3'>
                                    {Math.round(deal_screen_info?.price * deal_screen_info?.quantity*1000)/1000} {deal_screen_info?.fiat === 1 ? 'RUB': 'USD'}
                                </div>
                            </div>
                        </div>
                </div>

                {showConfirmPay && deal_screen_info?.type_order === 's' &&
                    // <div className='m-4'>
                    //     <div className='label-deal-fiat'>Переведите фиаты по следующим реквизитам:</div>
                    //     <div className='label-deal-fiat'>{deal_screen_info.company}</div>
                    //     <div className='label-deal-fiat mb-3'>{deal_screen_info.card_number}</div>
                        /* <ButtonNext text='Оплачено' onClick={hanldeConfirm}/> */
                        <div onClick={hanldeConfirm} className='button-send-box button-active-send-bg active-text mt-20'>
                            Подтвердить сделку
                        </div>
                    // </div>
                }

                {error !== 'Транзакция выполнена' &&
                    showLoader ? 
                    <div className="loader"></div>:
                    <div className='m-3'>
                        {deal_screen_info?.status === 'confirm' && deal_screen_info?.type_order === 'b' &&
                            // <ButtonNext 
                            //     text={'Подтвердить платеж'} 
                            //     onClick={handleClickEndDeal}
                            // />
                            <div onClick={handleClickEndDeal} className='button-send-box button-active-send-bg active-text mt-20'>
                                Подтвердить сделку
                            </div>
                        }
                    </div>
                }

                {/* <Chat deal_id={deal_screen_info.deal_id}/> */}
                {/* <div onClick={() => {navigate('/chat/0', {replace: true})}} className='simple-btn'>
                    Открыть чат
                </div> */}

                {deal_screen_info?.status === "request" &&
                    <div className="button-send-box button-send-bg disable-text">
                        {timer} секунд
                    </div>
                }
            </div>
            
            
        </div>
      );
}

