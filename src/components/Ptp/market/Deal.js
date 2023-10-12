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
import { CURRENCY_LIST } from '../../../const/devdata';
import { dictionary } from '../../../const/dictionary';

export function Deal () {
    const {tg, user_id, init_data, language_code } = useTelegram()
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

    //labels
    const personal_area = language_code === 'ru' ? dictionary.p2p.personal_area.ru: dictionary.p2p.personal_area.en
    const deal = language_code === 'ru' ? dictionary.market.deal.ru: dictionary.market.deal.en
    const you_buying = language_code === 'ru' ? dictionary.market.you_buying.ru: dictionary.market.you_buying.en
    const you_sell = language_code === 'ru' ? dictionary.market.you_sell.ru: dictionary.market.you_sell.en
    const sells = language_code === 'ru' ? dictionary.market.sells.ru: dictionary.market.sells.en
    const chat_buyer = language_code === 'ru' ? dictionary.market.chat_buyer.ru: dictionary.market.chat_buyer.en
    const chat_seller = language_code === 'ru' ? dictionary.market.chat_seller.ru: dictionary.market.chat_seller.en
    const attention = language_code === 'ru' ? dictionary.market.attention.ru: dictionary.market.attention.en
    const you_must_send = language_code === 'ru' ? dictionary.market.you_must_send.ru: dictionary.market.you_must_send.en
    const within_15_minutes = language_code === 'ru' ? dictionary.market.within_15_minutes.ru: dictionary.market.within_15_minutes.en
    const transfer_payment_within = language_code === 'ru' ? dictionary.market.transfer_payment_within.ru: dictionary.market.transfer_payment_within.en
    const confirm_payment = language_code === 'ru' ? dictionary.market.confirm_payment.ru: dictionary.market.confirm_payment.en
    const status_label = language_code === 'ru' ? dictionary.market.status.ru: dictionary.market.status.en
    const buyer_confirmed_payment = language_code === 'ru' ? dictionary.market.buyer_confirmed_payment.ru: dictionary.market.buyer_confirmed_payment.en
    const make_sure_money = language_code === 'ru' ? dictionary.market.make_sure_money.ru: dictionary.market.make_sure_money.en
    const payment_methods = language_code === 'ru' ? dictionary.market.payment_methods.ru: dictionary.market.payment_methods.en
    const transaction_progress = language_code === 'ru' ? dictionary.market.transaction_progress.ru: dictionary.market.transaction_progress.en
    const confirm_pay_label = language_code === 'ru' ? dictionary.market.confirm_pay.ru: dictionary.market.confirm_pay.en
    const deal_canceled = language_code === 'ru' ? dictionary.market.deal_canceled.ru: dictionary.market.deal_canceled.en
    const appeal = language_code === 'ru' ? dictionary.market.appeal.ru: dictionary.market.appeal.en
    const you_have_active_appeal = language_code === 'ru' ? dictionary.market.you_have_active_appeal.ru: dictionary.market.you_have_active_appeal.en
    const waiting_confirmation = language_code === 'ru' ? dictionary.market.waiting_confirmation.ru: dictionary.market.waiting_confirmation.en
    const from_seller = language_code === 'ru' ? dictionary.market.from_seller.ru: dictionary.market.from_seller.en
    const deal_completed = language_code === 'ru' ? dictionary.market.deal_completed.ru: dictionary.market.deal_completed.en
    const waiting_confirm_seller = language_code === 'ru' ? dictionary.market.waiting_confirm_seller.ru: dictionary.market.waiting_confirm_seller.en
    const update_status = language_code === 'ru' ? dictionary.market.update_status.ru: dictionary.market.update_status.en
    const you_credited = language_code === 'ru' ? dictionary.market.you_credited.ru: dictionary.market.you_credited.en
    const price_label = language_code === 'ru' ? dictionary.market.price.ru: dictionary.market.price.en
    const price_per = language_code === 'ru' ? dictionary.market.price_per.ru: dictionary.market.price_per.en
    const sum_label = language_code === 'ru' ? dictionary.market.sum.ru: dictionary.market.sum.en
    const wants_buy_you = language_code === 'ru' ? dictionary.market.wants_buy_you.ru: dictionary.market.wants_buy_you.en
    const buys = language_code === 'ru' ? dictionary.market.buys.ru: dictionary.market.buys.en
    const payment_label = language_code === 'ru' ? dictionary.market.payment.ru: dictionary.market.payment.en
    const you_sold = language_code === 'ru' ? dictionary.market.you_sold.ru: dictionary.market.you_sold.en
    const seller_confirmed = language_code === 'ru' ? dictionary.market.seller_confirmed.ru: dictionary.market.seller_confirmed.en
    const wants_sell = language_code === 'ru' ? dictionary.market.wants_sell.ru: dictionary.market.wants_sell.en
    const time_accept = language_code === 'ru' ? dictionary.market.time_accept.ru: dictionary.market.time_accept.en
    const refuse = language_code === 'ru' ? dictionary.market.refuse.ru: dictionary.market.refuse.en
    const accept_request = language_code === 'ru' ? dictionary.market.accept_request.ru: dictionary.market.accept_request.en
    const purchase_amount = language_code === 'ru' ? dictionary.market.purchase_amount.ru: dictionary.market.purchase_amount.en
    const from_buyer = language_code === 'ru' ? dictionary.market.from_buyer.ru: dictionary.market.from_buyer.en
    const account_card_phone = language_code === 'ru' ? dictionary.market.account_card_phone.ru: dictionary.market.account_card_phone.en
    const full_name = language_code === 'ru' ? dictionary.market.full_name.ru: dictionary.market.full_name.en

    // const [timer, setTimer] = useState(60);
    // let t = 60

    const str_type_deal = deal_screen_info?.type_order === 'b' ? you_sell: you_buying

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
    <div className='title-buy-2 mt-20'>{deal_screen_info?.quantity} {CURRENCY_LIST[deal_screen_info?.currency-1]}</div>

    const deal_pay = 
    <>
        {quantity_deal}
        <div className='title-buy-mini mt-13'># {deal_screen_info?.deal_id}</div>
        <div className='cntr-left'>
            <div className='open-chat-btn mt-13' onClick={()=>{navigate(`/chat/${deal_screen_info.deal_id}`, {replace: true})}}>
                {!error && (deal_screen_info?.type_order === 's' ? chat_buyer: chat_seller)}
            </div>
        </div>

        <div className='container-left'>
            <div className='line-green'></div>
        </div>

        <div className='order-row-1 mt-18'>
            <div className='deal-label-1'>
                {status_label}
            </div>
            <div className='order-info-3'>
                <div className='deal-text-1'>{seller_confirmed}</div>  
            </div>
        </div>

        <div className='order-line-container'>
            <div className='deal-line'></div>
        </div>
            
        <div className='order-row-1'>
            <div className='alert-text'>{attention}</div>
            <div className='allert-text-2 w-182 mr-17'>
                    {you_must_send}{' '} 
                    {renderSumm} 
                    {deal_screen_info?.fiat === 1 ? ' RUB ': ' USD '} 
                    {within_15_minutes}
                    
            </div>
        </div>

        <div className='container-center mt-20 color-bg-cntr'>
            <div className='w-100'>
                <div className='deal-row-1 mt-12'>
                    <div className='order-label-2'>
                        {payment_methods}
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
                        {account_card_phone}
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
                    <div className='deal-text-3 mt-17'>{transfer_payment_within}</div>
                    <div className='timer-text h-34' 
                        style={{display: 'flex', alignItems: 'flex-end', justifyContent: 'center'}}
                    >
                        {showTimer && <Timer time={timeDeal}/>}
                    </div>
            </div>
        </div>

        <div onClick={hanldeConfirm} className='button-send-box button-active-send-bg active-text mt-20'>
            {confirm_payment}
        </div>
    </>

    const confirm_pay =
    <>
        {quantity_deal}
        <div className='title-buy-mini mt-13'># {deal_screen_info?.deal_id}</div>
        <div className='cntr-left'>
            <div className='open-chat-btn mt-13' onClick={()=>{navigate(`/chat/${deal_screen_info.deal_id}`, {replace: true})}}>
                {chat_buyer}
            </div>
        </div>

        <div className='container-left'>
            <div className='line-green'></div>
        </div>

        <div className='order-row-1 mt-18'>
            <div className='deal-label-1'>
                {status_label}
            </div>
            <div className='order-info-3'>
                <div className='deal-text-1'>{buyer_confirmed_payment}</div>  
            </div>
        </div>

        <div className='order-line-container'>
            <div className='deal-line'></div>
        </div>
            
        <div className='order-row-1'>
            <div className='alert-text'>{attention}</div>
            <div className='allert-text-2 w-182 mr-17'>
                {make_sure_money}
            </div>
        </div>

        <div className='container-center mt-20 color-bg-cntr'>
            <div className='w-100'>
                <div className='deal-row-1 mt-12'>
                    <div className='order-label-2'>
                        {payment_methods}
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
                        {account_card_phone}
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
                        {full_name}
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
            {waitTransaction ? transaction_progress: confirm_pay_label}
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
            </div>  
            <div className='wait-text-1 mt-20'>
                {deal_canceled}
            </div> 
        </div>
        
        <div className='cntr-between mt-20'>
            <div onClick={handleAppilate} className='button-send-box button-send-bg deal-end-text-1 w-161'>
                {appeal}
            </div>
            <div onClick={()=>navigate('/person', {replace: true})} className='button-send-box button-active-send-bg active-text w-161'>
                {personal_area}
            </div>
        </div>
        {showErrorAppilate && <div className='text_error_appilate'>{you_have_active_appeal}</div>}
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
                                <div className='title-buy-label mt-20'>{deal} № {deal_screen_info?.deal_id}</div>
                                {/* <div className='title-buy'>{str_type_deal} {deal_screen_info?.saler}</div> */}
                                <div className='title-buy mt-20'>{str_type_deal}</div>
                                {quantity_deal}

                                {/* <div className='saler-buyer mt-20'>{str_type_deal.charAt(3).toUpperCase() + str_type_deal.slice(4, str_type_deal.length-1)} {deal_screen_info?.saler}</div> */}
                                <div className='saler-buyer mt-20'>{sells} {deal_screen_info?.saler}</div>

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
                                    <div className='wait-text'>{waiting_confirmation}
                                    </div>  
                                    <div className='wait-text-1 mt-20'>
                                        {  
                                            deal_screen_info?.status === 'end' ? 
                                            deal_completed: 
                                            from_seller
                                        }  
                                    </div> 
                                </div>

                                <div>
                                    <div className='deal-row-1 mt-12'>
                                        <div className='order-label-2'>
                                            {payment_methods}
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
                                            {price_label}
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
                                            {purchase_amount}
                                        </div>
                                        <div className='order-info-3'>
                                            {renderSumm}
                                            {deal_screen_info?.fiat === 1 ? ' RUB': ' USD'}
                                        </div>
                                    </div>

                                </div>
                                <div className='container-center mt-20 color-bg-cntr h-82'>
            <div className='w-100'>
                    <div className='deal-text-3 mt-17'>{waiting_confirm_seller}</div>
                    <div className='timer-text h-34' 
                        style={{display: 'flex', alignItems: 'flex-end', justifyContent: 'center'}}
                     > 
                        {showTimer && <Timer time={timeDeal}/>}
                    </div>
            </div>
        </div>
                                <div onClick={()=>handleGetDealInfo()} className='button-send-box button-active-send-bg active-text mt-20'>
                                    {update_status}
                                </div>
                            </>
                        }

                        {   (deal_screen_info?.status === 'end') &&
                            <>
                                <div className='title-buy-label mt-20'>{deal} № {deal_screen_info?.deal_id}</div>
                                {/* <div className='title-buy'>{str_type_deal} {deal_screen_info?.saler}</div> */}
                                <div className='title-buy mt-20'>{str_type_deal}</div>
                                {quantity_deal}

                                {/* <div className='saler-buyer mt-20'>{str_type_deal.charAt(3).toUpperCase() + str_type_deal.slice(4, str_type_deal.length-1)} {deal_screen_info?.saler}</div> */}
                                <div className='saler-buyer mt-20'>{sells} {deal_screen_info?.saler}</div>

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
                                        {you_credited} {deal_screen_info?.quantity} USDT
                                    </div>  
                                    <div className='wait-text-1 mt-20'>
                                        {deal_completed}
                                    </div> 
                                </div>

                                <div>
                                    <div className='deal-row-1 mt-12'>
                                        <div className='order-label-2'>
                                            {payment_methods}
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
                                            {price_label}
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
                                            {purchase_amount}
                                        </div>
                                        <div className='order-info-3'>
                                            {renderSumm} {deal_screen_info?.fiat === 1 ? 'RUB': 'USD'}
                                        </div>
                                    </div>

                                </div>
                                
                                <div className='cntr-between mt-20'>
                                    <div onClick={handleAppilate} className='button-send-box button-send-bg deal-end-text-1 w-161'>
                                        {appeal}
                                    </div>
                                    <div onClick={()=>navigate('/person', {replace: true})} className='button-send-box button-active-send-bg active-text w-161'>
                                        {personal_area}
                                    </div>
                                </div>
                                {showErrorAppilate && <div className='text_error_appilate'>{you_have_active_appeal}</div>}
                            </>
                        }
                    </>
                }
{/* YOU MAKER SALE-ORDER */}
                {  deal_screen_info?.type_order === 's' && deal_screen_info.maker_id.toString() === user_id.toString() &&

                    <>

                        {   deal_screen_info?.status === 'pay' &&
                            <>
                                <div className='title-buy-label mt-20'>{deal} № {deal_screen_info?.deal_id}</div>
                                {/* <div className='title-buy'>{str_type_deal} {deal_screen_info?.saler}</div> */}
                                <div className='title-buy mt-20'>{you_sell}</div>
                                {quantity_deal}

                                {/* <div className='saler-buyer mt-20'>{str_type_deal.charAt(3).toUpperCase() + str_type_deal.slice(4, str_type_deal.length-1)} {deal_screen_info?.saler}</div> */}
                                <div className='saler-buyer mt-20'>{buys} {deal_screen_info?.buyer}</div>

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
                                    <div className='wait-text'>{waiting_confirmation} {deal_screen_info?.status === 'pay' && {payment_label}}
                                    </div>  
                                    <div className='wait-text-1 mt-20'>
                                        {from_buyer}
                                    </div> 
                                </div>

                                <div>
                                    <div className='deal-row-1 mt-12'>
                                        <div className='order-label-2'>
                                            {payment_methods}
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
                                            {price_label}
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
                                            {purchase_amount}
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
                                    {update_status}
                                </div>
                            </>
                        }

                        {   deal_screen_info?.status === 'confirm' &&
                            confirm_pay
                        }

                        {   deal_screen_info?.status === 'request' &&
                            <>  
                                <div className='container-title mt-20'>
                                    <div className='title-text'><span className='title-text-g'>{deal_screen_info.buyer}</span> {wants_buy_you}</div>
                                </div>
                                {quantity_deal}
                                <div className='container-center mt-20'>
                                    <div className='price-info-buy'>
                                        {price_per} 1 {CURRENCY_LIST[deal_screen_info.currency - 1]} = {renderPrice}
                                    </div>
                                </div>

                                <div className='container-center mt-20'>
                                    <div className='w-100'>
                                        <div className='order-row-1'>
                                            <div className='order-label-2'>
                                                {payment_methods}
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
                                                {sum_label}
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
                                        {chat_buyer}
                                    </div>
                                </div>

                                <div className='cntr-center'>
                                    <div className='line-green'></div>
                                </div>

                                <div className='container-center mt-20 color-bg-cntr h-82'>
                                    <div className='w-100'>
                                            <div className='deal-text-3 mt-17'>{time_accept}</div>
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
                                        {refuse}
                                    </div>

                                    <div className='btn-accept-deal' 
                                        onClick={handleClickAccept}
                                    >
                                        {accept_request}
                                    </div>
                                </div>
                            </>
                        }

                        {   (deal_screen_info?.status === 'end') &&
                            <>
                                <div className='title-buy-label mt-20'>{deal} № {deal_screen_info?.deal_id}</div>

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
                                        {you_sold} {deal_screen_info?.quantity} USDT
                                    </div>  
                                    <div className='wait-text-1 mt-20'>
                                        {deal_completed}
                                    </div> 
                                </div>

                                <div>
                                    <div className='deal-row-1 mt-12'>
                                        <div className='order-label-2'>
                                            {payment_methods}
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
                                            {price_label}
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
                                            {purchase_amount}
                                        </div>
                                        <div className='order-info-3'>
                                            {renderSumm} 
                                            {deal_screen_info?.fiat === 1 ? 'RUB': 'USD'}
                                        </div>
                                    </div>

                                </div>
                                
                                <div className='cntr-between mt-20'>
                                    <div onClick={handleAppilate} className='button-send-box button-send-bg deal-end-text-1 w-161'>
                                        {appeal}
                                    </div>
                                    <div onClick={()=>navigate('/person', {replace: true})} className='button-send-box button-active-send-bg active-text w-161'>
                                        {personal_area}
                                    </div>
                                </div>
                                {showErrorAppilate && <div className='text_error_appilate'>{you_have_active_appeal}</div>}
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
                                    <div className='title-text'><span className='title-text-g'>{}</span>{deal_screen_info.buyer} {wants_sell}</div>
                                </div>
                                {quantity_deal}
                                <div className='container-center mt-20'>
                                    <div className='price-info-buy'>
                                        {price_per} USDT {deal_screen_info.currency === 1 ? 'BEP20': 'TRC20'} = 
                                        {renderPrice}
                                    </div>
                                </div>

                                <div className='container-center mt-20'>
                                    <div className='w-100'>
                                        <div className='order-row-1'>
                                            <div className='order-label-2'>
                                                {payment_methods}
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
                                                {sum_label}
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
                                        {chat_buyer}
                                    </div>
                                </div>

                                <div className='cntr-center'>
                                    <div className='line-green'></div>
                                </div>

                                <div className='container-center mt-20 color-bg-cntr h-82'>
                                    <div className='w-100'>
                                            <div className='deal-text-3 mt-17'>{transfer_payment_within}</div>
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
                                        {refuse}
                                    </div>

                                    <div className='btn-accept-deal' 
                                        onClick={handleClickAccept}
                                    >
                                        {accept_request}
                                    </div>
                                </div>
                            </>
                        }

                        {   deal_screen_info?.status === 'pay' &&
                            deal_pay
                        }

                        {   deal_screen_info?.status === 'confirm' &&
                            <>
                                <div className='title-buy-label mt-20'>{deal} № {deal_screen_info?.deal_id}</div>
                                {/* <div className='title-buy'>{str_type_deal} {deal_screen_info?.saler}</div> */}
                                <div className='title-buy mt-20'>{you_buying}</div>
                                {quantity_deal}

                                {/* <div className='saler-buyer mt-20'>{str_type_deal.charAt(3).toUpperCase() + str_type_deal.slice(4, str_type_deal.length-1)} {deal_screen_info?.saler}</div> */}
                                <div className='saler-buyer mt-20'>{sells} {deal_screen_info?.buyer}</div>

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
                                    <div className='wait-text'>{waiting_confirmation}
                                    </div>  
                                    <div className='wait-text-1 mt-20'>
                                        {  
                                            deal_screen_info?.status === 'end' ? 
                                            deal_completed: 
                                            from_seller
                                        }  
                                    </div> 
                                </div>

                                <div>
                                    <div className='deal-row-1 mt-12'>
                                        <div className='order-label-2'>
                                            {payment_methods}
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
                                            {price_label}
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
                                            {purchase_amount}
                                        </div>
                                        <div className='order-info-3'>
                                            {renderSumm} 
                                            {deal_screen_info?.fiat === 1 ? 'RUB': 'USD'}
                                        </div>
                                    </div>

                                </div>

                                <div onClick={()=>handleGetDealInfo()} className='button-send-box button-active-send-bg active-text mt-20'>
                                    {update_status}
                                </div>
                            </>
                        }

                        {   (deal_screen_info?.status === 'end') &&
                            <>
                                <div className='title-buy-label mt-20'>{deal} № {deal_screen_info?.deal_id}</div>

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
                                        {you_credited} {deal_screen_info?.quantity} USDT
                                    </div>  
                                    <div className='wait-text-1 mt-20'>
                                        {deal_completed}
                                    </div> 
                                </div>

                                <div>
                                    <div className='deal-row-1 mt-12'>
                                        <div className='order-label-2'>
                                            {payment_methods}
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
                                            {price_label}
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
                                            {purchase_amount}
                                        </div>
                                        <div className='order-info-3'>
                                            {renderSumm} 
                                            {deal_screen_info?.fiat === 1 ? 'RUB': 'USD'}
                                        </div>
                                    </div>

                                </div>
                                
                                <div className='cntr-between mt-20'>
                                    <div onClick={handleAppilate} className='button-send-box button-send-bg deal-end-text-1 w-161'>
                                        {appeal}
                                    </div>
                                    <div onClick={()=>navigate('/person', {replace: true})} className='button-send-box button-active-send-bg active-text w-161'>
                                        {personal_area}
                                    </div>
                                </div>
                                {showErrorAppilate && <div className='text_error_appilate'>{you_have_active_appeal}</div>}
                            </>
                        }
                    </>
                }   

{/* YOU TAKER BUY_ORDER */}
                {  deal_screen_info?.type_order === 'b' && deal_screen_info.maker_id.toString() !== user_id.toString() &&

                    <>


                        {   (deal_screen_info?.status === 'request' || deal_screen_info?.status === 'pay' ) &&
                            <>
                                <div className='title-buy-label mt-20'>{deal} № {deal_screen_info?.deal_id}</div>
                                {/* <div className='title-buy'>{str_type_deal} {deal_screen_info?.saler}</div> */}
                                <div className='title-buy mt-20'>{str_type_deal}</div>
                                {quantity_deal}

                                {/* <div className='saler-buyer mt-20'>{str_type_deal.charAt(3).toUpperCase() + str_type_deal.slice(4, str_type_deal.length-1)} {deal_screen_info?.saler}</div> */}
                                <div className='saler-buyer mt-20'>{buys} {deal_screen_info?.saler}</div>

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
                                    <div className='wait-text'>{waiting_confirmation} {deal_screen_info?.status === 'pay' && payment_label}
                                    </div>  
                                    <div className='wait-text-1 mt-20'>
                                        {from_buyer}
                                    </div> 
                                </div>

                                <div>
                                    <div className='deal-row-1 mt-12'>
                                        <div className='order-label-2'>
                                            {payment_methods}
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
                                            {price_label}
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
                                            {purchase_amount}
                                        </div>
                                        <div className='order-info-3'>
                                            {renderSumm} 
                                            {deal_screen_info?.fiat === 1 ? 'RUB': 'USD'}
                                        </div>
                                    </div>

                                </div>

                                <div onClick={()=>handleGetDealInfo()} className='button-send-box button-active-send-bg active-text mt-20'>
                                    {update_status}
                                </div>
                            </>
                        }

                        {   deal_screen_info?.status === 'confirm' &&
                            confirm_pay
                        }

                        {   (deal_screen_info?.status === 'end') &&
                            <>
                                <div className='title-buy-label mt-20'>{deal} № {deal_screen_info?.deal_id}</div>

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
                                        {you_sold} {deal_screen_info?.quantity} USDT
                                    </div>  
                                    <div className='wait-text-1 mt-20'>
                                        {deal_completed}
                                    </div> 
                                </div>

                                <div>
                                    <div className='deal-row-1 mt-12'>
                                        <div className='order-label-2'>
                                            {payment_methods}
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
                                            {price_label}
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
                                            {purchase_amount}
                                        </div>
                                        <div className='order-info-3'>
                                            {renderSumm} 
                                            {deal_screen_info?.fiat === 1 ? ' RUB': ' USD'}
                                        </div>
                                    </div>

                                </div>
                                
                                <div className='cntr-between mt-20'>
                                    <div onClick={handleAppilate} className='button-send-box button-send-bg deal-end-text-1 w-161'>
                                        {appeal}
                                    </div>
                                    <div onClick={()=>navigate('/person', {replace: true})} className='button-send-box button-active-send-bg active-text w-161'>
                                        {personal_area}
                                    </div>
                                </div>
                                {showErrorAppilate && <div className='text_error_appilate'>{you_have_active_appeal}</div>}
                            </>
                        }
                    </>
                }   

               
            </div>
        </div>
      );
}



