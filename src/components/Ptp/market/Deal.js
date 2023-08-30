import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { useTelegram } from '../../../hooks/useTelegram';
import { getDealInfo, newAppilate, sendAcceptDeal, sendCancelDeal, sendConfirm, setEndDeal } from './marketApi';
import { selectDealScreenInfo, setDealScreenInfo } from './marketSlice';
import clock_gif from '../../../static/animations/clock.gif'
import salute_gif from '../../../static/animations/salute.gif'
import cancel_gif from '../../../static/animations/cancel.gif'

import { useSocket } from '../../../hooks/useSocket';
import { Timer } from '../../Common/timerDeal';
import { selectPriceMarket, selectRubDollar, setPriceMarket, setPriceMarketTRX, setRubDollar } from '../ptpSlice';
import { parsePrice } from '../ptpApi';

export function Deal () {
    const {tg, user_id, init_data} = useTelegram()
    const { deal_id } = useParams();
    const navigate = useNavigate()
    const {socket} = useSocket()

    const dispatch = useDispatch()
    const deal_screen_info = useSelector(selectDealScreenInfo)

    // const [showConfirmPay, setShowConfirmPay] = useState(false)
    // const [showWait, setShowWait] = useState(false)
    // const [showLoader, setShowLoader] = useState(false)
    const [error, setError] = useState('')
    const [showCardCopyCheck, setShowCardCopyCheck] = useState(false);

    const [timeDeal, setTimeDeal] = useState(0);
    const [showTimer, setShowTimer] = useState(false);

    const [timeOut, setTimeOut] = useState(null);
    const [waitTransaction, setWaitTransaction] = useState(false);

    const [isCancelDeal, setIsCancelDeal] = useState(false);

    const [showErrorAppilate, setShowErrorAppilate] = useState(false);

    const price_market = useSelector(selectPriceMarket)
    const rub_dollar = useSelector(selectRubDollar)

    // const [timer, setTimer] = useState(60);
    // let t = 60

    const str_type_deal = deal_screen_info?.type_order === 'b' ? 'Вы продаете': 'Вы покупаете'

    const handleSendMessage = (status) => {
        // console.log('emit', status)
        socket.emit("new_message", {type: 'deal', deal_id: deal_screen_info.deal_id, status: status});
    }

    function handleGetDealInfo() {
        clearTimeout(timeOut)
        // console.log('handleGetDealInfo', deal_id)
        getDealInfo( {deal_id: deal_id === '0' ? deal_screen_info?.deal_id: deal_id}, (data) => {
            // console.log('handleGetDealInfo deal', data, data.delta_time/1000)
            if (!data?.res && data?.info === 'end') {
                setIsCancelDeal(true) 
                dispatch(setDealScreenInfo({type_order: ''}))  
                return
            }
            setTimeDeal(data.deal.time_limit_order*60 - data.delta_time/1000)
            setShowTimer(true)
            dispatch(setDealScreenInfo(data.deal))  

            // if (data.deal.saler_id.toString() === user_id.toString()) {
            //     dispatch(setDealScreenInfo(data.deal))
            //     // navigate('/completedeal', {replace: true})
            // }
            // else {
            //     dispatch(setDealScreenInfo(data.deal))    
            //     if (data.deal.status === "pay") {
            //         // setShowConfirmPay(true)
            //     }
            //     else if (data.deal.status === "request") {
            //         const I = setInterval(()=>{
            //             if (t === 0) clearInterval(I)
            //             t--;
            //             setTimer(t)
            //         }, 1000)
            //     }

                
            // }
            
        }) 
    }

    const handleClickAccept = () => {
        clearTimeout(timeOut)
        sendAcceptDeal({deal_id: deal_screen_info.deal_id, price: getPrice()}, () => {
            handleGetDealInfo()
            handleSendMessage('pay')
        })
        
    }

    
    const handleClickCancelDeal = () => {
        clearTimeout(timeOut)
        sendCancelDeal({deal_id: deal_screen_info.deal_id, buyer_id: deal_screen_info.buyer_id, saler_id: deal_screen_info.saler_id}, () => {
            // handleGetDealInfo()
            navigate('/ptp', {replace: true})
            handleSendMessage('cancel')
        })
        
    }

    const hanldeConfirm = () => {
        setShowTimer(false)
        setTimeDeal(0)
        sendConfirm(
            {
                deal_id: deal_screen_info.deal_id, 
                saler_id: deal_screen_info?.type_order === 's' ? deal_screen_info.maker_id:  deal_screen_info.buyer_id,
                sum_deal: (
                    deal_screen_info?.type_price_id === 1 ?
                    deal_screen_info?.price * deal_screen_info?.quantity:
                    Math.round(deal_screen_info?.percent_price*price_market*(deal_screen_info?.fiat === 1 ? rub_dollar: 1)* deal_screen_info?.quantity)/100
                ),
                
            }, (data) => {
                // console.log(data)
                handleGetDealInfo()
                handleSendMessage('confirm')
            }
        )
        
    }

    const handleEndDeal = () => {
        setWaitTransaction(true)
        // console.log('end deal', deal_screen_info.deal_id)
        setEndDeal(
            {
                deal_id: deal_screen_info.deal_id, 
                init_data: init_data
            }, (data) => {
                setWaitTransaction(false)
                handleGetDealInfo()
                handleSendMessage('enddeal')

                if (data.error) {
                    setError(data.error)
                }
                else {
                    setError('Сделка совершена')
                }
            
            // handleClose()
        })
    }

    const handleSocketOn = (data) => {
        // console.log('message from server', data);
        if (data.status !== deal_screen_info?.status) handleGetDealInfo()
    }   

    const handleClickCopyCard = () => {
        navigator.clipboard.writeText(deal_screen_info?.card_number)
        setShowCardCopyCheck(true)

        setTimeout(() => {setShowCardCopyCheck(false)}, 1000)
    }

    const backScreen = (() => {
        navigate('/ptp', {replace: true})
    })

    const handleAppilate = () => {
        // console.log('handleAppilate')
        newAppilate( {
            deal_id: deal_id,
            user_id: user_id
        }, (data) => {
            // console.log('handleAppilate', data)
            if (data.res) tg.openTelegramLink('https://t.me/WalletExpBot')
            else {
                // console.log('setShowErrorAppilate')
                setShowErrorAppilate(true)
                setTimeout(() => setShowErrorAppilate(false), 2000)
            }
        })
    }

    function getPrice () {
        return (
            deal_screen_info?.type_price_id === 1 ?
            deal_screen_info?.price:
            Math.round(deal_screen_info?.percent_price*price_market*(deal_screen_info?.fiat === 1 ? rub_dollar: 1))/100
        )
    }

    const renderPrice = 
    <>
        {   deal_screen_info?.type_price_id === 1 ?
            deal_screen_info?.price:
            Math.round(deal_screen_info?.percent_price*price_market*(deal_screen_info?.fiat === 1 ? rub_dollar: 1))/100
        }
    </>

    const renderSumm = 
    <>
        {   deal_screen_info?.type_price_id === 1 ?
            deal_screen_info?.price * deal_screen_info?.quantity:
            Math.round(deal_screen_info?.percent_price*price_market*(deal_screen_info?.fiat === 1 ? rub_dollar: 1)* deal_screen_info?.quantity)/100
        }
    </>

    const quantity_deal = 
    <div className='title-buy-2 mt-20'>{deal_screen_info?.quantity} USDT {deal_screen_info?.currency === 1 ? 'BEP20': 'TRC20'}</div>

    const deal_pay = 
    <>
        {quantity_deal}
        <div className='title-buy-mini mt-13'># {deal_screen_info?.deal_id}</div>
        <div className='cntr-left'>
            <div className='open-chat-btn mt-13' onClick={()=>{navigate(`/chat/${deal_screen_info.deal_id}`, {replace: true})}}>
                {!error && (deal_screen_info?.type_order === 's' ? 'Чат с покупателем': 'Чат с продавцом')}
            </div>
        </div>

        <div className='container-left'>
            <div className='line-green'></div>
        </div>

        <div className='order-row-1 mt-18'>
            <div className='deal-label-1'>
                Статус
            </div>
            <div className='order-info-3'>
                <div className='deal-text-1'>Продавец подтвердил зявку</div>  
            </div>
        </div>

        <div className='order-line-container'>
            <div className='deal-line'></div>
        </div>
            
        <div className='order-row-1'>
            <div className='alert-text'>Внимание</div>
            <div className='allert-text-2 w-182 mr-17'>
                    Вы должны отправить{' '} 
                    {renderSumm} 
                    {deal_screen_info?.fiat === 1 ? ' RUB ': ' USD '} 
                    в течение 15 минут
                    
            </div>
        </div>

        <div className='container-center mt-20 color-bg-cntr'>
            <div className='w-100'>
                <div className='deal-row-1 mt-12'>
                    <div className='order-label-2'>
                        Методы оплаты
                    </div>
                    <div className='order-info-3'>
                        {deal_screen_info?.company}
                        <span style={{marginLeft: '9.33px'}}>
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M1.66659 0.333252C0.929919 0.333252 0.333252 0.929919 0.333252 1.66659V10.9999H1.66659V1.66659H10.9999V0.333252H1.66659ZM4.33325 2.99992C3.59659 2.99992 2.99992 3.59659 2.99992 4.33325V12.3333C2.99992 13.0699 3.59659 13.6666 4.33325 13.6666H12.3333C13.0699 13.6666 13.6666 13.0699 13.6666 12.3333V4.33325C13.6666 3.59659 13.0699 2.99992 12.3333 2.99992H4.33325ZM4.33325 4.33325H12.3333V12.3333H4.33325V4.33325Z" fill="#86EFAC"/>
                            </svg>
                        </span>
                    </div>
                </div>

                <div className='order-line-container'>
                    <div className='order-line'></div>
                </div>

                <div className='order-row-1 mb-12'>
                    <div className='deal-label-2 w-130'>
                        Аккаунт, номер карты или телефон
                    </div>
                    {/* <div className='order-info-3'>
                        {deal_screen_info?.card_number}
                        <span style={{marginLeft: '9.33px'}}>
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M1.66659 0.333252C0.929919 0.333252 0.333252 0.929919 0.333252 1.66659V10.9999H1.66659V1.66659H10.9999V0.333252H1.66659ZM4.33325 2.99992C3.59659 2.99992 2.99992 3.59659 2.99992 4.33325V12.3333C2.99992 13.0699 3.59659 13.6666 4.33325 13.6666H12.3333C13.0699 13.6666 13.6666 13.0699 13.6666 12.3333V4.33325C13.6666 3.59659 13.0699 2.99992 12.3333 2.99992H4.33325ZM4.33325 4.33325H12.3333V12.3333H4.33325V4.33325Z" fill="#86EFAC"/>
                            </svg>
                        </span>
                    </div> */}

                    <div className='order-info-3'
                        onClick={handleClickCopyCard}
                    >
                        {deal_screen_info?.card_number}
                        <span style={{marginLeft: '9.33px'}}>
                            {   showCardCopyCheck ?
                                <svg width="15" height="12" viewBox="0 0 15 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M13.2197 0.5L4.75 8.96973L1.53027 5.75L0.469727 6.81055L4.75 11.0908L14.2803 1.56055L13.2197 0.5Z" fill="#86EFAC"/>
                                </svg>:                                
                                <svg width="15" height="15" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M1.66659 0.333252C0.929919 0.333252 0.333252 0.929919 0.333252 1.66659V10.9999H1.66659V1.66659H10.9999V0.333252H1.66659ZM4.33325 2.99992C3.59659 2.99992 2.99992 3.59659 2.99992 4.33325V12.3333C2.99992 13.0699 3.59659 13.6666 4.33325 13.6666H12.3333C13.0699 13.6666 13.6666 13.0699 13.6666 12.3333V4.33325C13.6666 3.59659 13.0699 2.99992 12.3333 2.99992H4.33325ZM4.33325 4.33325H12.3333V12.3333H4.33325V4.33325Z" fill="#86EFAC"/>
                                </svg>
                            }
                        </span>
                    </div>

                </div>

                
            </div>
        </div>

        <div className='container-center mt-20 color-bg-cntr h-82'>
            <div className='w-100'>
                    <div className='deal-text-3 mt-17'>Переведите оплату в течение</div>
                    <div className='timer-text h-34' 
                        style={{display: 'flex', alignItems: 'flex-end', justifyContent: 'center'}}
                    >
                        {showTimer && <Timer time={timeDeal}/>}
                    </div>
            </div>
        </div>

        <div onClick={hanldeConfirm} className='button-send-box button-active-send-bg active-text mt-20'>
            Подтвердить платеж
        </div>
    </>

    const confirm_pay =
    <>
        {quantity_deal}
        <div className='title-buy-mini mt-13'># {deal_screen_info?.deal_id}</div>
        <div className='cntr-left'>
            <div className='open-chat-btn mt-13' onClick={()=>{navigate(`/chat/${deal_screen_info.deal_id}`, {replace: true})}}>
                Чат с покупателем
            </div>
        </div>

        <div className='container-left'>
            <div className='line-green'></div>
        </div>

        <div className='order-row-1 mt-18'>
            <div className='deal-label-1'>
                Статус
            </div>
            <div className='order-info-3'>
                <div className='deal-text-1'>Покупатель подтвердил оплату</div>  
            </div>
        </div>

        <div className='order-line-container'>
            <div className='deal-line'></div>
        </div>
            
        <div className='order-row-1'>
            <div className='alert-text'>Внимание</div>
            <div className='allert-text-2 w-182 mr-17'>
                {
                    `
                    Убедитесь что фиаты поступили прежде чем подтверждать оплату
                    `
                }
            </div>
        </div>

        <div className='container-center mt-20 color-bg-cntr'>
            <div className='w-100'>
                <div className='deal-row-1 mt-12'>
                    <div className='order-label-2'>
                        Методы оплаты
                    </div>
                    <div className='order-info-3'>
                        {deal_screen_info?.company}
                        <span style={{marginLeft: '9.33px'}}>
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M1.66659 0.333252C0.929919 0.333252 0.333252 0.929919 0.333252 1.66659V10.9999H1.66659V1.66659H10.9999V0.333252H1.66659ZM4.33325 2.99992C3.59659 2.99992 2.99992 3.59659 2.99992 4.33325V12.3333C2.99992 13.0699 3.59659 13.6666 4.33325 13.6666H12.3333C13.0699 13.6666 13.6666 13.0699 13.6666 12.3333V4.33325C13.6666 3.59659 13.0699 2.99992 12.3333 2.99992H4.33325ZM4.33325 4.33325H12.3333V12.3333H4.33325V4.33325Z" fill="#86EFAC"/>
                            </svg>
                        </span>
                    </div>
                </div>

                <div className='order-line-container'>
                    <div className='order-line'></div>
                </div>

                <div className='order-row-1 mb-12'>
                    <div className='deal-label-2 w-130'>
                        Аккаунт, номер карты или телефон
                    </div>
                    <div className='order-info-3'
                        onClick={handleClickCopyCard}
                    >
                        {deal_screen_info?.card_number}
                        <span style={{marginLeft: '9.33px'}}>
                            {   showCardCopyCheck ?
                                <svg width="15" height="12" viewBox="0 0 15 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M13.2197 0.5L4.75 8.96973L1.53027 5.75L0.469727 6.81055L4.75 11.0908L14.2803 1.56055L13.2197 0.5Z" fill="#86EFAC"/>
                                </svg>:                                
                                <svg width="15" height="15" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M1.66659 0.333252C0.929919 0.333252 0.333252 0.929919 0.333252 1.66659V10.9999H1.66659V1.66659H10.9999V0.333252H1.66659ZM4.33325 2.99992C3.59659 2.99992 2.99992 3.59659 2.99992 4.33325V12.3333C2.99992 13.0699 3.59659 13.6666 4.33325 13.6666H12.3333C13.0699 13.6666 13.6666 13.0699 13.6666 12.3333V4.33325C13.6666 3.59659 13.0699 2.99992 12.3333 2.99992H4.33325ZM4.33325 4.33325H12.3333V12.3333H4.33325V4.33325Z" fill="#86EFAC"/>
                                </svg>
                            }
                        </span>
                    </div>
                </div>

                <div className='order-line-container'>
                    <div className='order-line'></div>
                </div>

                <div className='order-row-1 mb-12'>
                    <div className='deal-label-2 w-130'>
                        ФИО
                    </div>
                    <div className='order-info-3'
                        onClick={handleClickCopyCard}
                    >
                        {deal_screen_info?.info}
                        <span style={{marginLeft: '9.33px'}}>
                            <svg width="15" height="12" viewBox="0 0 15 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M13.2197 0.5L4.75 8.96973L1.53027 5.75L0.469727 6.81055L4.75 11.0908L14.2803 1.56055L13.2197 0.5Z" fill="#86EFAC"/>
                            </svg>
                        </span>
                    </div>
                </div>

                
            </div>
        </div>

        

        <div onClick={handleEndDeal} className='button-send-box button-active-send-bg active-text mt-20'>
            {waitTransaction ? 'Транзакция выполняется..': 'Подтвердить оплату'}
        </div>
    </>

    const render_cancel_deal = 
    <>
        

        <div className='color-bg-cntr h-cntr-deal w-cntr mt-20'>
            <div className='container-center'>
                {/* {
                    showConfirmPay ? 
                        <img style={{width: '131.4px', height: '132px'}} src={hands_gif} alt=''/>: 
                    deal_screen_info?.status === 'end' ? 
                        <img style={{width: '131.4px', height: '132px'}} src={salute_gif} alt=''/>:
                        <img style={{width: '131.4px', height: '132px'}} src={clock_gif} alt=''/>
                } */}
                <img style={{width: '131.4px', height: '132px'}} src={cancel_gif} alt=''/>:
            </div>
            <div className='wait-text'>
                {/* Вам начислено {deal_screen_info?.quantity} USDT */}
            </div>  
            <div className='wait-text-1 mt-20'>
                Сделка отменена
            </div> 
        </div>
        
        <div className='cntr-between mt-20'>
            <div onClick={handleAppilate} className='button-send-box button-send-bg deal-end-text-1 w-161'>
                Апелляция
            </div>
            <div onClick={()=>navigate('/person', {replace: true})} className='button-send-box button-active-send-bg active-text w-161'>
                Личный кабинет
            </div>
        </div>
        {showErrorAppilate && <div className='text_error_appilate'>У вас есть действующая апелляция</div>}
    </>

    

    useEffect(() => {
        parsePrice({}, (data) => {
            dispatch(setPriceMarket(data.price_market))
            dispatch(setPriceMarketTRX(data.price_market_trx))
            dispatch(setRubDollar(data.rub_dollar))            
        })
    }, [dispatch]);

    useEffect(() => {
        if (showTimer && timeDeal > 0) {
            // console.log('timeDeal', timeDeal)
            const time_out = setTimeout(() => {if (showTimer) setTimeDeal(timeDeal - 1)}, 1000)
            clearTimeout(timeOut)
            setTimeOut(time_out)
        }
        else {
            setShowTimer(false)
            setTimeDeal(0)
            clearTimeout(timeOut)
            handleGetDealInfo()
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [showTimer, timeDeal]);

    useEffect(() => {
        // console.log(9)
        socket.on(deal_id !== '0' ? `deal${deal_id}`: `{deal${deal_screen_info.deal_id}}`, handleSocketOn);
        return () => {
            socket.off(deal_id !== '0' ? `deal${deal_id}`: `{deal${deal_screen_info.deal_id}}`);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
            // console.log('uef')
            handleGetDealInfo()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[]);

    useEffect(() => {
        tg.onEvent('backButtonClicked', backScreen)
            return () => {tg.offEvent('backButtonClicked', backScreen)}
        }, )

    return (
        <div className='container-center'>
            <div style={{width: '335px'}}>

            {isCancelDeal && render_cancel_deal}

{/* YOU TAKER SALE-ORDER */}
                {  deal_screen_info?.type_order === 's' && deal_screen_info.maker_id.toString() !== user_id.toString() &&

                    <>
                        {   deal_screen_info?.status === 'pay' &&
                            deal_pay
                        }

                        {   (deal_screen_info?.status === 'request' || deal_screen_info?.status === 'confirm') &&
                            <>
                                <div className='title-buy-label mt-20'>Сделка № {deal_screen_info?.deal_id}</div>
                                {/* <div className='title-buy'>{str_type_deal} {deal_screen_info?.saler}</div> */}
                                <div className='title-buy mt-20'>{str_type_deal}</div>
                                {quantity_deal}

                                {/* <div className='saler-buyer mt-20'>{str_type_deal.charAt(3).toUpperCase() + str_type_deal.slice(4, str_type_deal.length-1)} {deal_screen_info?.saler}</div> */}
                                <div className='saler-buyer mt-20'>Продает {deal_screen_info?.saler}</div>

                                <div className='color-bg-cntr h-cntr-deal w-cntr mt-20'>
                                    <div className='container-center'>
                                        {/* {
                                            showConfirmPay ? 
                                                <img style={{width: '131.4px', height: '132px'}} src={hands_gif} alt=''/>: 
                                            deal_screen_info?.status === 'end' ? 
                                                <img style={{width: '131.4px', height: '132px'}} src={salute_gif} alt=''/>:
                                                <img style={{width: '131.4px', height: '132px'}} src={clock_gif} alt=''/>
                                        } */}
                                        <img style={{width: '131.4px', height: '132px'}} src={clock_gif} alt=''/>
                                    </div>
                                    <div className='wait-text'>Ожиданием подтверждения
                                    </div>  
                                    <div className='wait-text-1 mt-20'>
                                        {  
                                            deal_screen_info?.status === 'end' ? 
                                            'Сделка совершена': 
                                            'от продавца'
                                        }  
                                    </div> 
                                </div>

                                <div>
                                    <div className='deal-row-1 mt-12'>
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
                                            {/* {deal_screen_info?.price}  */}
                                            {renderPrice}
                                            {deal_screen_info?.fiat === 1 ? ' RUB': ' USD'}
                                        </div>
                                    </div>

                                    <div className='order-line-container'>
                                        <div className='order-line'></div>
                                    </div>

                                    <div className='order-row-1'>
                                        <div className='order-label-2'>
                                            Cумма покупки
                                        </div>
                                        <div className='order-info-3'>
                                            {renderSumm}
                                            {deal_screen_info?.fiat === 1 ? ' RUB': ' USD'}
                                        </div>
                                    </div>

                                </div>
                                <div className='container-center mt-20 color-bg-cntr h-82'>
            <div className='w-100'>
                    <div className='deal-text-3 mt-17'>Ожидание подтверждения оплаты от продавца</div>
                    <div className='timer-text h-34' 
                        style={{display: 'flex', alignItems: 'flex-end', justifyContent: 'center'}}
                    >
                        {showTimer && <Timer time={timeDeal}/>}
                    </div>
            </div>
        </div>
                                <div onClick={()=>handleGetDealInfo()} className='button-send-box button-active-send-bg active-text mt-20'>
                                    Обновить статус
                                </div>
                            </>
                        }

                        {   (deal_screen_info?.status === 'end') &&
                            <>
                                <div className='title-buy-label mt-20'>Сделка № {deal_screen_info?.deal_id}</div>
                                {/* <div className='title-buy'>{str_type_deal} {deal_screen_info?.saler}</div> */}
                                <div className='title-buy mt-20'>{str_type_deal}</div>
                                {quantity_deal}

                                {/* <div className='saler-buyer mt-20'>{str_type_deal.charAt(3).toUpperCase() + str_type_deal.slice(4, str_type_deal.length-1)} {deal_screen_info?.saler}</div> */}
                                <div className='saler-buyer mt-20'>Продает {deal_screen_info?.saler}</div>

                                <div className='color-bg-cntr h-cntr-deal w-cntr mt-20'>
                                    <div className='container-center'>
                                        {/* {
                                            showConfirmPay ? 
                                                <img style={{width: '131.4px', height: '132px'}} src={hands_gif} alt=''/>: 
                                            deal_screen_info?.status === 'end' ? 
                                                <img style={{width: '131.4px', height: '132px'}} src={salute_gif} alt=''/>:
                                                <img style={{width: '131.4px', height: '132px'}} src={clock_gif} alt=''/>
                                        } */}
                                        <img style={{width: '131.4px', height: '132px'}} src={salute_gif} alt=''/>:
                                    </div>
                                    <div className='wait-text'>
                                        Вам начислено {deal_screen_info?.quantity} USDT
                                    </div>  
                                    <div className='wait-text-1 mt-20'>
                                        Сделка совершена
                                    </div> 
                                </div>

                                <div>
                                    <div className='deal-row-1 mt-12'>
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
                                            {renderPrice}
                                            
                                            {deal_screen_info?.fiat === 1 ? 'RUB': 'USD'}
                                        </div>
                                    </div>

                                    <div className='order-line-container'>
                                        <div className='order-line'></div>
                                    </div>

                                    <div className='order-row-1'>
                                        <div className='order-label-2'>
                                            Cумма покупки
                                        </div>
                                        <div className='order-info-3'>
                                            {renderSumm} {deal_screen_info?.fiat === 1 ? 'RUB': 'USD'}
                                        </div>
                                    </div>

                                </div>
                                
                                <div className='cntr-between mt-20'>
                                    <div onClick={handleAppilate} className='button-send-box button-send-bg deal-end-text-1 w-161'>
                                        Апелляция
                                    </div>
                                    <div onClick={()=>navigate('/person', {replace: true})} className='button-send-box button-active-send-bg active-text w-161'>
                                        Личный кабинет
                                    </div>
                                </div>
                                {showErrorAppilate && <div className='text_error_appilate'>У вас есть действующая апелляция</div>}
                            </>
                        }
                    </>
                }
{/* YOU MAKER SALE-ORDER */}
                {  deal_screen_info?.type_order === 's' && deal_screen_info.maker_id.toString() === user_id.toString() &&

                    <>

                        {   deal_screen_info?.status === 'pay' &&
                            <>
                                <div className='title-buy-label mt-20'>Сделка № {deal_screen_info?.deal_id}</div>
                                {/* <div className='title-buy'>{str_type_deal} {deal_screen_info?.saler}</div> */}
                                <div className='title-buy mt-20'>Вы продаете</div>
                                {quantity_deal}

                                {/* <div className='saler-buyer mt-20'>{str_type_deal.charAt(3).toUpperCase() + str_type_deal.slice(4, str_type_deal.length-1)} {deal_screen_info?.saler}</div> */}
                                <div className='saler-buyer mt-20'>Покупает {deal_screen_info?.buyer}</div>

                                <div className='color-bg-cntr h-cntr-deal w-cntr mt-20'>
                                    <div className='container-center'>
                                        {/* {
                                            showConfirmPay ? 
                                                <img style={{width: '131.4px', height: '132px'}} src={hands_gif} alt=''/>: 
                                            deal_screen_info?.status === 'end' ? 
                                                <img style={{width: '131.4px', height: '132px'}} src={salute_gif} alt=''/>:
                                                <img style={{width: '131.4px', height: '132px'}} src={clock_gif} alt=''/>
                                        } */}
                                        <img style={{width: '131.4px', height: '132px'}} src={clock_gif} alt=''/>
                                    </div>
                                    <div className='wait-text'>Ожиданием подтверждения {deal_screen_info?.status === 'pay' && 'оплаты'}
                                    </div>  
                                    <div className='wait-text-1 mt-20'>
                                        от покупателя
                                    </div> 
                                </div>

                                <div>
                                    <div className='deal-row-1 mt-12'>
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
                                            {/* {deal_screen_info?.price}  */}
                                            {renderPrice}
                                            
                                            {deal_screen_info?.fiat === 1 ? ' RUB': ' USD'}
                                        </div>
                                    </div>

                                    <div className='order-line-container'>
                                        <div className='order-line'></div>
                                    </div>

                                    <div className='order-row-1'>
                                        <div className='order-label-2'>
                                            Cумма покупки
                                        </div>
                                        <div className='order-info-3'>
                                            {/* {Math.round(deal_screen_info?.price * deal_screen_info?.quantity*1000)/1000}  */}

                                            {renderSumm}
                                            {deal_screen_info?.fiat === 1 ? ' RUB': ' USD'}
                                        </div>
                                    </div>

                                </div>

                                <div className='container-center mt-20 color-bg-cntr h-82'>
                                    <div className='w-100'>
                                            <div className='deal-text-3 mt-17'></div>
                                            <div className='timer-text h-34' 
                                                style={{display: 'flex', alignItems: 'flex-end', justifyContent: 'center'}}
                                            >
                                                {showTimer && <Timer time={timeDeal}/>}
                                            </div>
                                    </div>
                                </div>

                                <div onClick={()=>handleGetDealInfo()} className='button-send-box button-active-send-bg active-text mt-20'>
                                    Обновить статус
                                </div>
                            </>
                        }

                        {   deal_screen_info?.status === 'confirm' &&
                            confirm_pay
                        }

                        {   deal_screen_info?.status === 'request' &&
                            <>  
                                <div className='container-title mt-20'>
                                    <div className='title-text'><span className='title-text-g'>{deal_screen_info.buyer}</span> хочет купить у вас</div>
                                </div>
                                {quantity_deal}
                                <div className='container-center mt-20'>
                                    <div className='price-info-buy'>
                                        Цена за 1 USDT {deal_screen_info.currency === 1 ? 'BEP20': 'TRC20'} = {renderPrice}
                                    </div>
                                </div>

                                <div className='container-center mt-20'>
                                    <div className='w-100'>
                                        <div className='order-row-1'>
                                            <div className='order-label-2'>
                                                Метод оплаты
                                            </div>
                                            <div className='order-info-3'>
                                                {deal_screen_info.company}
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
                                                
                                                {   deal_screen_info.type_price_id === 1 ?
                                                    deal_screen_info?.price * deal_screen_info?.quantity:
                                                    Math.round(deal_screen_info.percent_price*price_market*(deal_screen_info.fiat === 1 ? rub_dollar: 1))/100
                                                } {deal_screen_info?.fiat === 1 ? 'RUB': 'USD'}
                                            </div>
                                        </div>

                                        <div className='order-line-container'>
                                            <div className='order-line'></div>
                                        </div>  
                                    </div>
                                </div>


                                <div className='cntr-center'>
                                    <div className='open-chat-btn mt-13' onClick={()=>{navigate(`/chat/${deal_screen_info.deal_id}`, {replace: true})}}>
                                        Чат с покупателем
                                    </div>
                                </div>

                                <div className='cntr-center'>
                                    <div className='line-green'></div>
                                </div>

                                <div className='container-center mt-20 color-bg-cntr h-82'>
                                    <div className='w-100'>
                                            <div className='deal-text-3 mt-17'>Время на принятие запроса</div>
                                            <div className='timer-text h-34' 
                                                style={{display: 'flex', alignItems: 'flex-end', justifyContent: 'center'}}
                                            >
                                                {showTimer && <Timer time={timeDeal}/>}
                                            </div>
                                    </div>
                                </div>

                                <div className='row-2 mt-20'>
                                    <div className='btn-disable-deal' 
                                        onClick={handleClickCancelDeal}
                                    >
                                        Отказаться
                                    </div>

                                    <div className='btn-accept-deal' 
                                        onClick={handleClickAccept}
                                    >
                                        Принять запрос
                                    </div>
                                </div>
                            </>
                        }

                        {   (deal_screen_info?.status === 'end') &&
                            <>
                                <div className='title-buy-label mt-20'>Сделка № {deal_screen_info?.deal_id}</div>
                                {/* <div className='title-buy'>{str_type_deal} {deal_screen_info?.saler}</div> */}
                                {/* <div className='title-buy mt-20'>{str_type_deal}</div>
                                {quantity_deal} */}

                                {/* <div className='saler-buyer mt-20'>{str_type_deal.charAt(3).toUpperCase() + str_type_deal.slice(4, str_type_deal.length-1)} {deal_screen_info?.saler}</div> */}
                                {/* <div className='saler-buyer mt-20'>Продает {deal_screen_info?.saler}</div> */}

                                <div className='color-bg-cntr h-cntr-deal w-cntr mt-20'>
                                    <div className='container-center'>
                                        {/* {
                                            showConfirmPay ? 
                                                <img style={{width: '131.4px', height: '132px'}} src={hands_gif} alt=''/>: 
                                            deal_screen_info?.status === 'end' ? 
                                                <img style={{width: '131.4px', height: '132px'}} src={salute_gif} alt=''/>:
                                                <img style={{width: '131.4px', height: '132px'}} src={clock_gif} alt=''/>
                                        } */}
                                        <img style={{width: '131.4px', height: '132px'}} src={salute_gif} alt=''/>:
                                    </div>
                                    <div className='wait-text'>
                                        Вы продали {deal_screen_info?.quantity} USDT
                                    </div>  
                                    <div className='wait-text-1 mt-20'>
                                        Сделка совершена
                                    </div> 
                                </div>

                                <div>
                                    <div className='deal-row-1 mt-12'>
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
                                            {renderPrice} 
                                            {deal_screen_info?.fiat === 1 ? ' RUB': ' USD'}
                                        </div>
                                    </div>

                                    <div className='order-line-container'>
                                        <div className='order-line'></div>
                                    </div>

                                    <div className='order-row-1'>
                                        <div className='order-label-2'>
                                            Cумма покупки
                                        </div>
                                        <div className='order-info-3'>
                                            {renderSumm} 
                                            {deal_screen_info?.fiat === 1 ? 'RUB': 'USD'}
                                        </div>
                                    </div>

                                </div>
                                
                                <div className='cntr-between mt-20'>
                                    <div onClick={handleAppilate} className='button-send-box button-send-bg deal-end-text-1 w-161'>
                                        Апелляция
                                    </div>
                                    <div onClick={()=>navigate('/person', {replace: true})} className='button-send-box button-active-send-bg active-text w-161'>
                                        Личный кабинет
                                    </div>
                                </div>
                                {showErrorAppilate && <div className='text_error_appilate'>У вас есть действующая апелляция</div>}
                            </>
                        }
                    </>
                }

{/* YOU MAKER BUY-ORDER */}
                {  deal_screen_info?.type_order === 'b' && deal_screen_info.maker_id.toString() === user_id.toString() &&

                    <>


                        {   deal_screen_info?.status === 'request' &&
                            <>  
                                <div className='container-title mt-20'>
                                    <div className='title-text'><span className='title-text-g'>{}</span>{deal_screen_info.buyer} хочет продать вам</div>
                                </div>
                                {quantity_deal}
                                <div className='container-center mt-20'>
                                    <div className='price-info-buy'>
                                        Цена за 1 USDT {deal_screen_info.currency === 1 ? 'BEP20': 'TRC20'} = 
                                        {renderPrice}
                                    </div>
                                </div>

                                <div className='container-center mt-20'>
                                    <div className='w-100'>
                                        <div className='order-row-1'>
                                            <div className='order-label-2'>
                                                Метод оплаты
                                            </div>
                                            <div className='order-info-3'>
                                                {deal_screen_info.company}
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
                                                {renderSumm} 
                                                {deal_screen_info?.fiat === 1 ? 'RUB': 'USD'}
                                            </div>
                                        </div>

                                        <div className='order-line-container'>
                                            <div className='order-line'></div>
                                        </div>  
                                    </div>
                                </div>


                                <div className='cntr-center'>
                                    <div className='open-chat-btn mt-13' onClick={()=>{navigate(`/chat/${deal_screen_info.deal_id}`, {replace: true})}}>
                                        Чат с покупателем
                                    </div>
                                </div>

                                <div className='cntr-center'>
                                    <div className='line-green'></div>
                                </div>

                                <div className='container-center mt-20 color-bg-cntr h-82'>
                                    <div className='w-100'>
                                            <div className='deal-text-3 mt-17'>Переведите оплату в течение</div>
                                            <div className='timer-text h-34' 
                                                style={{display: 'flex', alignItems: 'flex-end', justifyContent: 'center'}}
                                            >
                                                {showTimer && <Timer time={timeDeal}/>}
                                            </div>
                                    </div>
                                </div>

                                <div className='row-2 mt-20'>
                                    <div className='btn-disable-deal' 
                                        onClick={handleClickCancelDeal}
                                    >
                                        Отказаться
                                    </div>

                                    <div className='btn-accept-deal' 
                                        onClick={handleClickAccept}
                                    >
                                        Принять запрос
                                    </div>
                                </div>
                            </>
                        }

                        {   deal_screen_info?.status === 'pay' &&
                            deal_pay
                        }

                        {   deal_screen_info?.status === 'confirm' &&
                            <>
                                <div className='title-buy-label mt-20'>Сделка № {deal_screen_info?.deal_id}</div>
                                {/* <div className='title-buy'>{str_type_deal} {deal_screen_info?.saler}</div> */}
                                <div className='title-buy mt-20'>Вы покупаете</div>
                                {quantity_deal}

                                {/* <div className='saler-buyer mt-20'>{str_type_deal.charAt(3).toUpperCase() + str_type_deal.slice(4, str_type_deal.length-1)} {deal_screen_info?.saler}</div> */}
                                <div className='saler-buyer mt-20'>Продает {deal_screen_info?.buyer}</div>

                                <div className='color-bg-cntr h-cntr-deal w-cntr mt-20'>
                                    <div className='container-center'>
                                        {/* {
                                            showConfirmPay ? 
                                                <img style={{width: '131.4px', height: '132px'}} src={hands_gif} alt=''/>: 
                                            deal_screen_info?.status === 'end' ? 
                                                <img style={{width: '131.4px', height: '132px'}} src={salute_gif} alt=''/>:
                                                <img style={{width: '131.4px', height: '132px'}} src={clock_gif} alt=''/>
                                        } */}
                                        <img style={{width: '131.4px', height: '132px'}} src={clock_gif} alt=''/>
                                    </div>
                                    <div className='wait-text'>Ожиданием подтверждения
                                    </div>  
                                    <div className='wait-text-1 mt-20'>
                                        {  
                                            deal_screen_info?.status === 'end' ? 
                                            'Сделка совершена': 
                                            'от продавца'
                                        }  
                                    </div> 
                                </div>

                                <div>
                                    <div className='deal-row-1 mt-12'>
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
                                            {renderPrice} 
                                            {deal_screen_info?.fiat === 1 ? 'RUB': 'USD'}
                                        </div>
                                    </div>

                                    <div className='order-line-container'>
                                        <div className='order-line'></div>
                                    </div>

                                    <div className='order-row-1'>
                                        <div className='order-label-2'>
                                            Cумма покупки
                                        </div>
                                        <div className='order-info-3'>
                                            {renderSumm} 
                                            {deal_screen_info?.fiat === 1 ? 'RUB': 'USD'}
                                        </div>
                                    </div>

                                </div>

                                <div onClick={()=>handleGetDealInfo()} className='button-send-box button-active-send-bg active-text mt-20'>
                                    Обновить статус
                                </div>
                            </>
                        }

                        {   (deal_screen_info?.status === 'end') &&
                            <>
                                <div className='title-buy-label mt-20'>Сделка № {deal_screen_info?.deal_id}</div>
                                {/* <div className='title-buy'>{str_type_deal} {deal_screen_info?.saler}</div> */}
                                {/* <div className='title-buy mt-20'>{str_type_deal}</div>
                                {quantity_deal} */}

                                {/* <div className='saler-buyer mt-20'>{str_type_deal.charAt(3).toUpperCase() + str_type_deal.slice(4, str_type_deal.length-1)} {deal_screen_info?.saler}</div> */}
                                {/* <div className='saler-buyer mt-20'>Продает {deal_screen_info?.saler}</div> */}

                                <div className='color-bg-cntr h-cntr-deal w-cntr mt-20'>
                                    <div className='container-center'>
                                        {/* {
                                            showConfirmPay ? 
                                                <img style={{width: '131.4px', height: '132px'}} src={hands_gif} alt=''/>: 
                                            deal_screen_info?.status === 'end' ? 
                                                <img style={{width: '131.4px', height: '132px'}} src={salute_gif} alt=''/>:
                                                <img style={{width: '131.4px', height: '132px'}} src={clock_gif} alt=''/>
                                        } */}
                                        <img style={{width: '131.4px', height: '132px'}} src={salute_gif} alt=''/>:
                                    </div>
                                    <div className='wait-text'>
                                        Вам начислено {deal_screen_info?.quantity} USDT
                                    </div>  
                                    <div className='wait-text-1 mt-20'>
                                        Сделка совершена
                                    </div> 
                                </div>

                                <div>
                                    <div className='deal-row-1 mt-12'>
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
                                            {renderPrice} 
                                            {deal_screen_info?.fiat === 1 ? ' RUB': ' USD'}
                                        </div>
                                    </div>

                                    <div className='order-line-container'>
                                        <div className='order-line'></div>
                                    </div>

                                    <div className='order-row-1'>
                                        <div className='order-label-2'>
                                            Cумма покупки
                                        </div>
                                        <div className='order-info-3'>
                                            {renderSumm} 
                                            {deal_screen_info?.fiat === 1 ? 'RUB': 'USD'}
                                        </div>
                                    </div>

                                </div>
                                
                                <div className='cntr-between mt-20'>
                                    <div onClick={handleAppilate} className='button-send-box button-send-bg deal-end-text-1 w-161'>
                                        Апелляция
                                    </div>
                                    <div onClick={()=>navigate('/person', {replace: true})} className='button-send-box button-active-send-bg active-text w-161'>
                                        Личный кабинет
                                    </div>
                                </div>
                                {showErrorAppilate && <div className='text_error_appilate'>У вас есть действующая апелляция</div>}
                            </>
                        }
                    </>
                }   

{/* YOU TAKER BUY_ORDER */}
                {  deal_screen_info?.type_order === 'b' && deal_screen_info.maker_id.toString() !== user_id.toString() &&

                    <>


                        {   (deal_screen_info?.status === 'request' || deal_screen_info?.status === 'pay' ) &&
                            <>
                                <div className='title-buy-label mt-20'>Сделка № {deal_screen_info?.deal_id}</div>
                                {/* <div className='title-buy'>{str_type_deal} {deal_screen_info?.saler}</div> */}
                                <div className='title-buy mt-20'>{str_type_deal}</div>
                                {quantity_deal}

                                {/* <div className='saler-buyer mt-20'>{str_type_deal.charAt(3).toUpperCase() + str_type_deal.slice(4, str_type_deal.length-1)} {deal_screen_info?.saler}</div> */}
                                <div className='saler-buyer mt-20'>Покупает {deal_screen_info?.saler}</div>

                                <div className='color-bg-cntr h-cntr-deal w-cntr mt-20'>
                                    <div className='container-center'>
                                        {/* {
                                            showConfirmPay ? 
                                                <img style={{width: '131.4px', height: '132px'}} src={hands_gif} alt=''/>: 
                                            deal_screen_info?.status === 'end' ? 
                                                <img style={{width: '131.4px', height: '132px'}} src={salute_gif} alt=''/>:
                                                <img style={{width: '131.4px', height: '132px'}} src={clock_gif} alt=''/>
                                        } */}
                                        <img style={{width: '131.4px', height: '132px'}} src={clock_gif} alt=''/>
                                    </div>
                                    <div className='wait-text'>Ожиданием подтверждения {deal_screen_info?.status === 'pay' && 'оплаты'}
                                    </div>  
                                    <div className='wait-text-1 mt-20'>
                                        от покупателя
                                    </div> 
                                </div>

                                <div>
                                    <div className='deal-row-1 mt-12'>
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
                                            {renderPrice} 
                                            {deal_screen_info?.fiat === 1 ? 'RUB': 'USD'}
                                        </div>
                                    </div>

                                    <div className='order-line-container'>
                                        <div className='order-line'></div>
                                    </div>

                                    <div className='order-row-1'>
                                        <div className='order-label-2'>
                                            Cумма покупки
                                        </div>
                                        <div className='order-info-3'>
                                            {renderSumm} 
                                            {deal_screen_info?.fiat === 1 ? 'RUB': 'USD'}
                                        </div>
                                    </div>

                                </div>

                                <div onClick={()=>handleGetDealInfo()} className='button-send-box button-active-send-bg active-text mt-20'>
                                    Обновить статус
                                </div>
                            </>
                        }

                        {   deal_screen_info?.status === 'confirm' &&
                            confirm_pay
                        }

                        {   (deal_screen_info?.status === 'end') &&
                            <>
                                <div className='title-buy-label mt-20'>Сделка № {deal_screen_info?.deal_id}</div>
                                {/* <div className='title-buy'>{str_type_deal} {deal_screen_info?.saler}</div> */}
                                {/* <div className='title-buy mt-20'>{str_type_deal}</div>
                                {quantity_deal} */}

                                {/* <div className='saler-buyer mt-20'>{str_type_deal.charAt(3).toUpperCase() + str_type_deal.slice(4, str_type_deal.length-1)} {deal_screen_info?.saler}</div> */}
                                {/* <div className='saler-buyer mt-20'>Продает {deal_screen_info?.saler}</div> */}

                                <div className='color-bg-cntr h-cntr-deal w-cntr mt-20'>
                                    <div className='container-center'>
                                        {/* {
                                            showConfirmPay ? 
                                                <img style={{width: '131.4px', height: '132px'}} src={hands_gif} alt=''/>: 
                                            deal_screen_info?.status === 'end' ? 
                                                <img style={{width: '131.4px', height: '132px'}} src={salute_gif} alt=''/>:
                                                <img style={{width: '131.4px', height: '132px'}} src={clock_gif} alt=''/>
                                        } */}
                                        <img style={{width: '131.4px', height: '132px'}} src={salute_gif} alt=''/>:
                                    </div>
                                    <div className='wait-text'>
                                        Вы продали {deal_screen_info?.quantity} USDT
                                    </div>  
                                    <div className='wait-text-1 mt-20'>
                                        Сделка совершена
                                    </div> 
                                </div>

                                <div>
                                    <div className='deal-row-1 mt-12'>
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
                                            {renderPrice} 
                                            {deal_screen_info?.fiat === 1 ? ' RUB': ' USD'}
                                        </div>
                                    </div>

                                    <div className='order-line-container'>
                                        <div className='order-line'></div>
                                    </div>

                                    <div className='order-row-1'>
                                        <div className='order-label-2'>
                                            Cумма покупки
                                        </div>
                                        <div className='order-info-3'>
                                            {renderSumm} 
                                            {deal_screen_info?.fiat === 1 ? ' RUB': ' USD'}
                                        </div>
                                    </div>

                                </div>
                                
                                <div className='cntr-between mt-20'>
                                    <div onClick={handleAppilate} className='button-send-box button-send-bg deal-end-text-1 w-161'>
                                        Апелляция
                                    </div>
                                    <div onClick={()=>navigate('/person', {replace: true})} className='button-send-box button-active-send-bg active-text w-161'>
                                        Личный кабинет
                                    </div>
                                </div>
                                {showErrorAppilate && <div className='text_error_appilate'>У вас есть действующая апелляция</div>}
                            </>
                        }
                    </>
                }   

               
            </div>
        </div>
      );
}

// const handleClickEndDeal = () => {
    //     setShowLoader(true)
    //     // console.log('deal_screen_info', deal_screen_info)
    //     sendEndDeal(
    //         {
    //             deal_id: deal_screen_info.deal_id, 
    //             order_id: deal_screen_info.order_id, 
    //             user_to_id: deal_screen_info.type_order === 's' ?
    //                 (deal_screen_info.id_to ? deal_screen_info.id_to: deal_screen_info.buyer_id):
    //                 (deal_screen_info.id_from ? deal_screen_info.id_from: deal_screen_info.saler_id),
    //             user_from: first_name,
    //             user_from_id: user_id,
    //             type_order: deal_screen_info.type_order
    //         }, (data) => {
    //         handleGetDealInfo()
    //         setShowLoader(false)
    //         if (data.error) {
    //             setError(data.error)
    //         }
    //         else {
    //             setError('Сделка совершена')
    //         }
            
    //         // handleClose()
    //     })
    // }

