import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { useTelegram } from '../../../hooks/useTelegram';
import { ButtonNext } from '../../Common/buttonNext';
import { getDealInfo, sendConfirm } from './marketApi';
import { selectDealScreenInfo, setDealInfo, setDealScreenInfo } from './marketSlice';
// import { useDispatch, useSelector } from 'react-redux';
// import { useTelegram } from '../../../hooks/useTelegram';
// import { ButtonNext } from '../buttonNext';
// import { sendBuy } from './marketApi';
// import { selectQuantityBuy, setQuantityBuy } from './marketSlice';

export function Deal () {
    const {tg, user_id} = useTelegram()
    const { deal_id } = useParams();
    const navigate = useNavigate()

    const dispatch = useDispatch()
    const deal_screen_info = useSelector(selectDealScreenInfo)

    const [showConfirmPay, setShowConfirmPay] = useState(false)
    const [showWait, setShowWait] = useState(false)

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
                dispatch(setDealScreenInfo(
                    data.deal
                ))
    
                if (data.deal.status === "pay") {
                    setShowConfirmPay(true)
                }
            }
            
        }) 
    }

    const handleClickRefresh = () => {
         handleGetDealInfo(deal_screen_info.deal_id)
    }

    const hanldeConfirm = () => {
        sendConfirm({deal_id: deal_screen_info.deal_id, saler_id: deal_screen_info.saler_id}, (data) => {
            console.log(data)
            setShowConfirmPay(false)
            setShowWait(true)
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
        <>
            <div className='title-buy-label mt-3'>Сделка № {deal_screen_info?.deal_id}</div>
            <div className='title-buy'>Вы покупаете у {deal_screen_info?.saler}</div>
            

            {/* <label style={{color: 'var(--text-light-color)'}}>Количество:</label> */}
            <div style={{color: 'var(--text-light-color)', fontSize: 20}}>{deal_screen_info?.quantity} USDT {deal_screen_info?.currency === 1 ? 'BEP20': 'TRC20'}</div>

            <div className='screen-buy-container mt-5'>
                <label style={{color: 'var(--btn-bg-color)', fontSize: 15}}>Статус</label><br></br>
                {
                    deal_screen_info?.status === "request" ? 'Ожидание подтверждения продавца': 
                    showWait ? 'Дождитесь подтверждения об оплате': 'Продавец подтвердил зявку'}                
            </div>

            <div className='deal-info-container mt-4 mb-3 mx-3'>

                <div className='row mb-3 mt-3'>
                        <div className='buy-label'>
                            Методы оплаты
                        </div>
                        <div className='buy-info'>
                            {deal_screen_info.company}
                        </div>
                </div>

                <div className='row mt-3 mb-3'>
                    <div className='buy-label'>
                        Цена
                    </div>
                    <div className='buy-info text-nowrap'>
                        {deal_screen_info?.price} {deal_screen_info?.fiat === '1' ? 'RUB': 'USD'}
                    </div>
                </div>

                <div className='row mt-3 mb-3'>
                    <div className='buy-label'>
                        Сумма покупки
                    </div>
                    <div className='buy-info text-nowrap'>
                        {deal_screen_info?.price * deal_screen_info?.quantity} {deal_screen_info?.fiat === '1' ? 'RUB': 'USD'}
                    </div>
                </div>

                <div onClick={handleClickRefresh}>
                    {!showConfirmPay && 'Обновить'}
                </div>

            </div>

            {showConfirmPay &&
                <div className='m-4'>
                    <div className='label-deal-fiat'>Переведите фиаты по следующим реквизитам:</div>
                    <div className='label-deal-fiat'>{deal_screen_info.company}</div>
                    <div className='label-deal-fiat mb-3'>{deal_screen_info.card_number}</div>
                    <ButtonNext text='Оплачено' onClick={hanldeConfirm}/>
                </div>
            }

            {/* <Chat deal_id={deal_screen_info.deal_id}/> */}
            <div onClick={() => {navigate('/chat/0', {replace: true})}} className='simple-btn'>
                Открыть чат
            </div>
        </>
      );
}

