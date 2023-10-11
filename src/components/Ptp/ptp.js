import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useTelegram } from '../../hooks/useTelegram';
import { getUserDeals } from '../Home/homeApi';
import { selectUserDeals, setUserDeals } from '../Home/homeSlice';
// import { setDealInfo } from './market/marketSlice';
// import { CompleteDeal } from './completeDeal';
// import { OrderItem } from './market/orderItem';
import './style.css'
import { dateConvert } from '../Common/funcs';
import { parsePrice } from './ptpApi';
import { selectPriceMarket, selectRubDollar, setPriceMarket, setPriceMarketTRX, setRubDollar } from './ptpSlice';
import { getOrders } from './market/marketApi';
import { setOrders, setQuantityOrders } from './market/marketSlice';
import { dictionary } from '../../const/dictionary';

export function Ptp(props) {
    const { tg } = useTelegram()
    const { user_id, language_code } = useTelegram()
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const price_market = useSelector(selectPriceMarket)
    const rub_dollar = useSelector(selectRubDollar)

    //labels
    const create_ad = language_code === 'ru' ? dictionary.p2p.create_ad.ru: dictionary.p2p.create_ad.en
    const support_label = language_code === 'ru' ? dictionary.p2p.support.ru: dictionary.p2p.support.en
    const market_label = language_code === 'ru' ? dictionary.p2p.market.ru: dictionary.p2p.market.en
    const no_commission = language_code === 'ru' ? dictionary.p2p.no_commission.ru: dictionary.p2p.no_commission.en
    const personal_area = language_code === 'ru' ? dictionary.p2p.personal_area.ru: dictionary.p2p.personal_area.en
    const latest_deals = language_code === 'ru' ? dictionary.p2p.latest_deals.ru: dictionary.p2p.latest_deals.en
    const purchase = language_code === 'ru' ? dictionary.p2p.purchase.ru: dictionary.p2p.purchase.en
    const sale = language_code === 'ru' ? dictionary.p2p.sale.ru: dictionary.p2p.sale.en
    const request = language_code === 'ru' ? dictionary.p2p.request.ru: dictionary.p2p.request.en
    const waiting_payment = language_code === 'ru' ? dictionary.p2p.waiting_payment.ru: dictionary.p2p.waiting_payment.en
    const canceled = language_code === 'ru' ? dictionary.p2p.canceled.ru: dictionary.p2p.canceled.en
    const completed = language_code === 'ru' ? dictionary.p2p.completed.ru: dictionary.p2p.completed.en
    

    const handleClickCreateOrder = () => {
        navigate('/createorder', { replace: true })
    }

    const handleClickMarket = () => {
        navigate('/market', { replace: true })
    }

    const handleClickPerson = () => {
        navigate('/person', { replace: true })
    }

    // const handleClickSettingsPay = () => {
    //     navigate('/settingspay', {replace: true})
    // }

    // const handleClickMyOrders = () => {
    //     navigate('/myorders', {replace: true})
    // }

    const backScreen = () => {
        navigate('/', { replace: true })
        // navigate('/home', {replace: true})
    }

    const user_deals = useSelector(selectUserDeals)

    function handleClickDeal(deal) {
        // console.log(deal.id_to, user_id)
        // if (deal.id_to.toString() === user_id.toString()) {
        //     navigate(`/deal/${deal.deal_id}`, {replace: true, state: {deal: deal}})
        // }
        // else {
        //     dispatch(setDealInfo(deal))
        //     navigate('/completedeal', {replace: true, state: {deal: deal}})
        // }

        navigate(`/deal/${deal.deal_id}`, { replace: true })

    }

    const renderlistLastDeals = user_deals.slice(0, 3).map((deal, index) => {
        return (

            <div key={index} className={`row-2 a-c ${deal.type_order === 'b' ? 'color-bg-deal' : 'color-bg-deal-r'} h-77 p-17 mt-20`} onClick={() => { handleClickDeal(deal) }}>
                <div className='h-100'>
                    <div className='deal-text mt-18'>{dateConvert(deal?.datetime)}</div>
                    <div className={true ? 'deal-text-2 color-deal-text mt-10' : 'mt-10 deal-text-2 color-deal-r-text'}>
                        { 
                            (deal.type_order === 'b' && deal.id_from.toString() === user_id.toString()) || (deal.type_order === 's' && deal.id_to.toString() === user_id.toString()) ? purchase : sale}
                    </div>
                </div>
                <div className='h-100'>
                    <div className='text-deal-quantity color-q-text'>{deal.quantity} USDT</div>
                    <div className='deal-text-3 text-nowrap'>
                        {
                            deal.status === 'request' ? request :
                                deal.status === 'pay' ? waiting_payment :
                                    deal.status === 'cancel' ? canceled :
                                    completed
                        }
                    </div>
                </div>
            </div>

        )
    })

    // eslint-disable-next-line react-hooks/exhaustive-deps
    function getSortedOrders(orders) {
        let arr = orders.slice()
        let price1 = 0
        let price2 = 0
        for (let i = 0; i < arr.length - 1; i++) {
            for (let j = i + 1; j < arr.length; j++) {
                price1 = (arr[i].type_price_id !== 2 ? arr[i].price / (arr[i].currency_fiat_id === 1 ? rub_dollar : 1) : price_market * arr[i].percent_price / 100)
                price2 = (arr[j].type_price_id !== 2 ? arr[j].price / (arr[j].currency_fiat_id === 1 ? rub_dollar : 1) : price_market * arr[j].percent_price / 100)


                if (price2 < price1) {
                    const obj = arr[i]
                    arr[i] = arr[j]
                    arr[j] = obj
                }

            }
        }
        return arr
    }

    // function handleClickOrder(order_id) {
    //     dispatch(setCurrentOrderId(order_id))
    //     setContent('deals')
    //     getOrderDeals({order_id: order_id}, (data) => {
    //         dispatch(setOrderDeals(data.deals))
    //     })
    // }

    // const handleClickDeal = (deal) => {
    //     dispatch(setDealInfo(deal))
    //     setContent('complete_deal')
    // }

    // const arrow_right = 
    //     <div className='trade-menu-arrow-col'>
    //         <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chevron-right" viewBox="0 0 16 16">
    //             <path fillRule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"/>
    //         </svg>
    //     </div>


    const create_order =
        <div className='row button-trade-menu'>
            <div className='trade-menu-text-col' onClick={handleClickCreateOrder}>
                {create_ad}
            </div>
            <div className='trade-menu-text-col-2'>

            </div>
        </div>

    const faq =
        <div className='row button-trade-menu'>
            <div className='trade-menu-text-col' onClick={() => { window.open('https://t.me/fastex_wallet/19', "_blank") }}>
                FAQ
            </div>
            <div className='trade-menu-text-col-2'>

            </div>
        </div>

    const support =
        <div className='row button-trade-menu'>
            <div className='trade-menu-text-col' onClick={() => { window.open('https://t.me/fastex_sup', '_blank')}}>
                {support_label}
            </div>
            <div className='trade-menu-text-col-2'>

            </div>
        </div>


    const menu_market =
        <div className='row button-trade-menu' onClick={handleClickMarket}>
            {/* <div className='trade-menu-user-col'>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-person-fill" viewBox="0 0 16 16">
                    <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3Zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"/>
                </svg>
            </div> */}
            <div  className='trade-menu-text-col' >
                {market_label}
            </div>
            {/* {arrow_right} */}
            <div className='trade-menu-text-col-2'>
                {no_commission}
            </div>
        </div>

    const person =
        <div className='row button-trade-menu'>
            <div className='trade-menu-text-col' onClick={handleClickPerson}>
                {personal_area}
            </div>
            <div className='trade-menu-text-col-2'>

            </div>
        </div>

    // const menu_my_orders = 
    //     <div className='row button-trade-menu'>
    //         <div className='trade-menu-user-col'>
    //             <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-wallet-fill" viewBox="0 0 16 16">
    //                 <path d="M1.5 2A1.5 1.5 0 0 0 0 3.5v2h6a.5.5 0 0 1 .5.5c0 .253.08.644.306.958.207.288.557.542 1.194.542.637 0 .987-.254 1.194-.542.226-.314.306-.705.306-.958a.5.5 0 0 1 .5-.5h6v-2A1.5 1.5 0 0 0 14.5 2h-13z"/>
    //                 <path d="M16 6.5h-5.551a2.678 2.678 0 0 1-.443 1.042C9.613 8.088 8.963 8.5 8 8.5c-.963 0-1.613-.412-2.006-.958A2.679 2.679 0 0 1 5.551 6.5H0v6A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-6z"/>
    //             </svg>
    //         </div>
    //         {/* <div className='trade-menu-text-col' onClick={handleClickSettingsPay}> */}
    //         <div className='trade-menu-text-col' onClick={handleClickMyOrders}>
    //             Мои объявления
    //         </div>
    //         {arrow_right}
    //     </div>

    const divider =
        <div className='divider'></div>





    useEffect(() => {
        getUserDeals({ user_id: user_id }, (data) => {
            dispatch(setUserDeals(data.deals))
        })
    }, [dispatch, user_id]);

    useEffect(() => {
        tg.MainButton.hide()
        tg.BackButton.show()
    }, [tg.BackButton, tg.MainButton]);

    useEffect(() => {
        tg.onEvent('backButtonClicked', backScreen)
        return () => { tg.offEvent('backButtonClicked', backScreen) }
    },)


    useEffect(() => {
        parsePrice({}, (data) => {
            dispatch(setPriceMarket(data.price_market))
            dispatch(setPriceMarketTRX(data.price_market_trx))
            dispatch(setRubDollar(data.rub_dollar))
            getOrders({ user_id: '' }, (data) => {
                const sorted_orders = getSortedOrders(data.orders)
                dispatch(setOrders(sorted_orders))
                dispatch(setQuantityOrders(data.orders.length))
            })
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch, getSortedOrders]);
    return (
        <>

            <div className='d-flex justify-content-center'>
                <div className='trade-menu-container mt-20'>
                    {menu_market}
                    <div className='d-flex justify-content-center'>{divider}</div>
                    {person}
                    <div className='d-flex justify-content-center'>{divider}</div>
                    {create_order}
                    <div className='d-flex justify-content-center'>{divider}</div>
                    {faq}
                    <div className='d-flex justify-content-center'>{divider}</div>
                    {support}
                </div>
            </div>
            <div className='d-flex justify-content-center'>
                <div className='container-menu'>
                    < div className='title-last-deals'>{latest_deals}</div>
                </div>
            </div>

            <div className='d-flex justify-content-center'>
                <div className='container-menu'>
                    {renderlistLastDeals}
                </div>
            </div>
        </>
    );
}