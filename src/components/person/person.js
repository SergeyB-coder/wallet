import React from 'react';
import { useTelegram } from '../../hooks/useTelegram';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useEffect } from 'react';
import { getOrders } from '../Ptp/market/marketApi';
import { svg_share } from '../../const/svgs';
import { getUserQDeals, parsePrice, setActiveOrder } from '../Ptp/ptpApi';
import { useDispatch, useSelector } from 'react-redux';
import { setBackStepCreateOrder } from '../Ptp/market/marketSlice';
import { selectPriceMarket, selectRubDollar, setComment, setCurrencyFiat, setCurrencyOrder, setLimitOrder, setPercentPrice, setPrice, setPriceMarket, setPriceMarketTRX, setPriceType, setQuantityOrder, setRubDollar, setTypeOrder } from '../Ptp/ptpSlice';
import { selectBalance, selectBalanceTRX, selectBalanceTRXv, selectBalanceV, selectNameUser } from '../Home/homeSlice';
// import { setMethodsPay } from '../Ptp/settings_pay/settingsPaySlice';
import './style.css'
import { dictionary } from '../../const/dictionary';
const commission = 0.05
let summ_orders_bep = 0
let summ_orders_trc = 0
export function Person(props) {
    
    const { user_id, tg, language_code } = useTelegram()
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const name_will_id = language_code === 'ru' ? dictionary.name_will_id.ru: dictionary.name_will_id.en
    const completed_transactions = language_code === 'ru' ? dictionary.completed_transactions.ru: dictionary.completed_transactions.en
    const insufficient_balance = language_code === 'ru' ? dictionary.insufficient_balance.ru: dictionary.insufficient_balance.en
    const ads_activated = language_code === 'ru' ? dictionary.ads_activated.ru: dictionary.ads_activated.en
    const ads_deactivated = language_code === 'ru' ? dictionary.ads_deactivated.ru: dictionary.ads_deactivated.en
    const cancel = language_code === 'ru' ? dictionary.cancel.ru: dictionary.cancel.en
    const personal_area = language_code === 'ru' ? dictionary.personal_area.ru: dictionary.personal_area.en
    const setting_payment = language_code === 'ru' ? dictionary.setting_payment.ru: dictionary.setting_payment.en
    const activity_ads = language_code === 'ru' ? dictionary.activity_ads.ru: dictionary.activity_ads.en

    const your_advertisements = language_code === 'ru' ? dictionary.your_advertisements.ru: dictionary.your_advertisements.en
    const create_ad = language_code === 'ru' ? dictionary.create_ad.ru: dictionary.create_ad.en
    const price_per = language_code === 'ru' ? dictionary.price_per.ru: dictionary.price_per.en
    const buy = language_code === 'ru' ? dictionary.buy.ru: dictionary.buy.en

    const sale = language_code === 'ru' ? dictionary.sale.ru: dictionary.sale.en
    const payment_methods = language_code === 'ru' ? dictionary.payment_methods.ru: dictionary.payment_methods.en
    const edit = language_code === 'ru' ? dictionary.edit.ru: dictionary.edit.en

    const stop_label = language_code === 'ru' ? dictionary.stop.ru: dictionary.stop.en
    const launch = language_code === 'ru' ? dictionary.launch.ru: dictionary.launch.en
    const amount_deals = language_code === 'ru' ? dictionary.amount_deals.ru: dictionary.amount_deals.en
    const deals_label = language_code === 'ru' ? dictionary.deals.ru: dictionary.deals.en
    const available = language_code === 'ru' ? dictionary.available.ru: dictionary.available.en
    const limits = language_code === 'ru' ? dictionary.limits.ru: dictionary.limits.en


    const [allOrderActive, setAllOrderActive] = useState(true);
    const [orders, setOrders] = useState([]);
    const [qDeals, setQDeals] = useState(0);
    const [qMDeals, setQMDeals] = useState(0);
    const [qMDealsEnd, setQMDealsEnd] = useState(0);
    const [showPopUp, setShowPopUp] = useState(false);

    const [popUpText, setPopUpText] = useState('');

    const price_market = useSelector(selectPriceMarket)
    const rub_dollar = useSelector(selectRubDollar)

    const name_user = useSelector(selectNameUser)

    const balance = useSelector(selectBalance)
    const balance_v = useSelector(selectBalanceV)
    const balance_trx = useSelector(selectBalanceTRX)
    const balance_trx_v = useSelector(selectBalanceTRXv)

    const handleClickCreateOrder = () => {
        dispatch(setBackStepCreateOrder('person'))
        navigate('/createorder', { replace: true })
    }



    const handleClickSettingsPay = () => {
        navigate('/settingspay', { replace: true })
    }



    const backScreen = () => {
        navigate('/ptp', { replace: true })
        // navigate('/home', {replace: true})
    }

    function handleClickEditOrder(index) {
        dispatch(setPercentPrice(orders[index].percent_price))
        dispatch(setQuantityOrder(orders[index].quantity))
        dispatch(setLimitOrder(orders[index].limit_order))
        dispatch(setCurrencyFiat(orders[index].currency_fiat_id))
        dispatch(setCurrencyOrder(orders[index].currency_order))
        dispatch(setPrice(orders[index].price))
        // dispatch(setMethodPay(orders[index].method_pay))

        // const method_pay = useSelector(selectMethodPay)

        dispatch(setTypeOrder(orders[index].type))
        dispatch(setPriceType(orders[index].type_price_id))
        dispatch(setComment(orders[index].comment))
        // dispatch(setMethodsPay(orders[index].meth))
        navigate('/createorder', { replace: true })

    }

    const handleClickAllOrderActive = () => {
        // console.log('handleClickAllOrderActive', summ_orders_bep, summ_orders_trc, balance, balance_v, balance_trx, balance_trx_v)

        if ((summ_orders_bep > balance+balance_v || summ_orders_trc > balance_trx+balance_trx_v) && !allOrderActive) {
            setPopUpText(insufficient_balance)
            setShowPopUp(true)

            setTimeout(() => { setShowPopUp(false) }, 2000)
        }
        else {
            setActiveOrder({ user_id: user_id, value: !allOrderActive }, (data) => {
                // console.log(data)
                getOrders({ user_id: user_id }, (data) => {
                    // console.log('getOrders person', data)
                    setOrders(data.orders)
                })
            })

            setPopUpText(allOrderActive ? ads_deactivated: ads_activated)
            setShowPopUp(true)

            setTimeout(() => { setShowPopUp(false) }, 2000)

            setAllOrderActive(!allOrderActive)
        }
    }

    function handleClickRunOrder(index) {
        setActiveOrder({ order_id: orders[index].id, value: true }, (data) => {
            // console.log(data)
            getOrders({ user_id: user_id }, (data) => {
                // console.log('getOrders person', data)
                setOrders(data.orders)
            })
        })
    }


    function handleClickStopOrder(index) {
        setActiveOrder({ order_id: orders[index].id, value: false }, (data) => {
            // console.log(data)
            getOrders({ user_id: user_id }, (data) => {
                // console.log('getOrders person', data)
                setOrders(data.orders)
            })
        })
    }

    function setSumms (orders) {
        summ_orders_bep = orders.reduce( 
            ( accumulator, current_value) => accumulator + current_value.price*current_value.quantity*(current_value.currency_id === 1), 0)
        
        summ_orders_trc = orders.reduce( 
            ( accumulator, current_value) => accumulator + current_value.price*current_value.quantity*(current_value.currency_id === 2), 0)
    }

    const pop_up =
        <div className='pop_up'>
            <div className='pop_up_text' >{popUpText}</div>
            <div className='pop_up_text_cancel'>{cancel}</div>
        </div>

    useEffect(() => {
        parsePrice({}, (data) => {
            dispatch(setPriceMarket(data.price_market))
            dispatch(setPriceMarketTRX(data.price_market_trx))
            dispatch(setRubDollar(data.rub_dollar))
        })
    }, [dispatch]);

    useEffect(() => {
        getUserQDeals({ user_id: user_id }, (data) => {
            if (data.res) {
                setQDeals((data.q_deals.q_taker || 0) + (data.q_deals.q_maker || 0))
                setQMDeals(data.q_deals.q_maker || 0)
                setQMDealsEnd(data.q_deals.q_maker_end || 0)
            }
        })
    }, [user_id]);

    useEffect(() => {

        getOrders({ user_id: user_id }, (data) => {
            // console.log('getOrders person', data)
            setOrders(data.orders)

            setSumms(data.orders)
            const initialValue = 0;
            // console.log('summ_orders', summ_orders_bep, summ_orders_trc)
            const quantity_active_orders = data.orders.reduce(
                (accumulator, currentValue) => accumulator + currentValue.active*1,
                initialValue
            );

            // console.log('quantity_active_orders', quantity_active_orders)
            if (quantity_active_orders === 0) {
                setAllOrderActive(false)
            }
        })
    }, [user_id]);

    useEffect(() => {
        tg.MainButton.hide()
        tg.BackButton.show()
    }, [tg.BackButton, tg.MainButton]);

    useEffect(() => {
        tg.onEvent('backButtonClicked', backScreen)
        return () => { tg.offEvent('backButtonClicked', backScreen) }
    },)

    return (
        <div className='container-center'>
            {showPopUp && pop_up}
            <div className='w-cntr'>
                <div className='container-title mt-20'>
                    <div className='title-text'>{personal_area}</div>
                </div>

                <div className='h-cntr-person color-bg-cntr-person pt-26 mt-20'>
                    <div className='name-text'>{name_user}</div>

                    <div className='container-center'>
                        <div className='mini-text w-227'>
                            {name_will_id}
                        </div>
                    </div>
                </div>

                <div className='row-2 mt-10'>
                    <div className='cntr-2 color-bg-cntr-person'>
                        <div className='num-text'>
                            {qDeals}
                        </div>
                        <div className='mini-text'>
                            {amount_deals}
                        </div>
                    </div>
                    <div className='cntr-2 color-bg-cntr-person'>
                        <div className='num-text'>
                            {(qMDeals !== 0 && Math.round(qMDealsEnd*100/qMDeals)) || 0}%
                        </div>
                        <div className='mini-text'>
                            {completed_transactions}
                        </div>
                    </div>
                </div>

                <div className='h-118 color-bg-cntr-person pt-9 mt-10'>

                    <div className='row-2 p-17 a-c h-47' onClick={handleClickSettingsPay}>
                        <div className='item-text'>
                            {setting_payment}
                        </div>
                        <div>
                            <svg width="5" height="9" viewBox="0 0 5 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M5 4.5C5 4.76522 4.89464 5.01957 4.70711 5.20711L1.70711 8.20711C1.31658 8.59763 0.683416 8.59763 0.292892 8.20711C-0.0976318 7.81658 -0.0976317 7.18342 0.292893 6.79289L2.58579 4.5L0.292893 2.20711C-0.097631 1.81658 -0.0976315 1.18342 0.292893 0.792893C0.683417 0.402369 1.31658 0.402369 1.70711 0.792893L4.70711 3.79289C4.89464 3.98043 5 4.23478 5 4.5Z" fill="white" />
                            </svg>
                        </div>
                    </div>

                    <div className='container-center'>
                        <div className='line'></div>
                    </div>

                    <div className='row-2 p-17 a-c h-47'>
                        <div className='item-text'>
                            {activity_ads}
                        </div>
                        {/* <div>
                            <div className={1 ? 'method-switch': 'method-switch-off'}
                                onClick={() => {}}
                            >
                                <div className={1 ? 'method-switch-circle':'method-switch-off-circle'}></div>
                            </div>
                        </div> */}

                        <div className=''>
                            <div className={allOrderActive ? 'method-switch anim-switch' : 'method-switch-off anim-switch-off'}
                                onClick={handleClickAllOrderActive}
                            >
                                <div className={allOrderActive ? 'method-switch-circle anim-circle' : 'method-switch-off-circle anim-circle-b'}></div>
                            </div>
                        </div>
                    </div>

                </div>

                <div className='container-title mt-20'>
                    <div className='title-text'>{your_advertisements}</div>
                </div>

                <div className='container-center mt-20'>
                    <div className='btn-add-method-pay'>
                        <div className='svg-add-method'>
                            <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M15 30C23.2843 30 30 23.2843 30 15C30 6.71573 23.2843 0 15 0C6.71573 0 0 6.71573 0 15C0 23.2843 6.71573 30 15 30ZM22 17.9251V13.0749H17.2752V8H11.7248V13.0749H7V17.9251H11.7248V23H17.2752V17.9251H22Z" fill="#86EFAC" />
                            </svg>
                        </div>
                        <div className='btn-add-method-text' onClick={handleClickCreateOrder}>
                            {create_ad}
                        </div>
                    </div>
                </div>


                {
                    orders.slice(0, 5).map((order, index) => {
                        return (
                            <div
                                // style={
                                //     (indexMethod !== 0 && companies_pay[indexMethod].id !== order.company_pay_id) || listFilterOrders[index] !== 1 || order.type !== typeOrderFilter ? {display: 'none'}: {}
                                // } 
                                className='order-item-user mt-3' key={order.id}
                            >
                                <div className='order-header a-c'>
                                    <div className='order-price'>
                                        <div className='mt-2'>
                                            {order.type_price_id !== 2 ? order.price : Math.round(price_market * (order.currency_fiat_id === 1 ? rub_dollar : 1) * order.percent_price) / 100}
                                            {order.currency_fiat_id === 1 ? 'RUB' : 'USD'}
                                        </div>
                                        <div className={order.type === 's' ? 'order-label' : 'mini-text-r'}>{price_per} 1 {order.currency_id === 1 ? 'USDT BEP20' : 'USDT TRC20'}</div>
                                    </div>

                                    <div className='container-center a-c'>
                                        {svg_share}
                                        <div className={order.type === 'b' ? 'order-sale ml-12' : 'order-buy ml-12'}
                                            onClick={() => { }}
                                        >
                                            {order.type === 's' ? buy : sale}
                                        </div>
                                    </div>
                                </div>
                                {/* {divider} */}

                                <div className='order-row-1'>
                                    <div className='order-user-name'>
                                        {order.first_name}
                                    </div>

                                    <div className='order-info-2'>
                                        <span className='order-info-1'>
                                            3 {deals_label}
                                        </span>
                                        67%
                                    </div>
                                </div>

                                <div className='order-line-container'>
                                    <div className='order-line'></div>
                                </div>

                                <div className='order-row-1'>
                                    <div className='order-label-2'>
                                        {available}
                                    </div>
                                    <div className='order-info-3'>
                                        {order.quantity} USDT
                                    </div>
                                </div>

                                <div className='order-line-container'>
                                    <div className='order-line'></div>
                                </div>

                                <div className='order-row-1'>
                                    <div className='order-label-2'>
                                        {limits}
                                    </div>
                                    <div className='order-info-3'>
                                        {`${Math.round(1000 * order.limit_order / (order.type_price_id === 1 ? order.price : price_market * (order.currency_fiat_id === 1 ? rub_dollar : 1) * order.percent_price / 100)) / 1000} - ${order.quantity - commission} USDT`}<br></br>
                                        {`${order.limit_order} - ${Math.round((order.quantity - commission) * (order.type_price_id === 1 ? order.price : price_market * (order.currency_fiat_id === 1 ? rub_dollar : 1) * order.percent_price / 100) * 1000) / 1000} ${order.currency_fiat_id === 1 ? '₽' : '$'}`}
                                    </div>
                                </div>

                                <div className='order-line-container'>
                                    <div className='order-line'></div>
                                </div>

                                <div className='order-row-1'>
                                    <div className='order-label-2 t-a-l'>
                                        {payment_methods}
                                    </div>
                                    <div className='order-info-3'>
                                        {order.company}
                                    </div>
                                </div>

                                <div style={{ display: 'flex', position: 'absolute', bottom: 0, alignItems: 'flex-end' }}>
                                    <div className='btn-edit'
                                        onClick={() => handleClickEditOrder(index)}
                                    >
                                        {edit}
                                    </div>
                                    {order.active ?
                                        <div className='btn-run'
                                            onClick={() => handleClickStopOrder(index)}
                                        >
                                            {stop_label}
                                        </div> :
                                        <div className='btn-run'
                                            onClick={() => handleClickRunOrder(index)}
                                        >
                                            {launch}
                                        </div>
                                    }
                                </div>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    );
}

