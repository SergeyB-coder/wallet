import React, {useEffect} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useTelegram } from '../../hooks/useTelegram';
import { getUserDeals } from '../Home/homeApi';
import { selectUserDeals, setUserDeals } from '../Home/homeSlice';
// import { setDealInfo } from './market/marketSlice';
// import { CompleteDeal } from './completeDeal';
// import { OrderItem } from './market/orderItem';
import './style.css'

export function Ptp (props) {
    const {tg} = useTelegram()
    const {user_id} = useTelegram()
    const dispatch = useDispatch()
    const navigate = useNavigate()

    // const [content, setContent] = useState('orders') // orders, deals, complete_deal

    const handleClickCreateOrder = () => {
        navigate('/createorder', {replace: true})
    }

    const handleClickMarket = () => {
        navigate('/market', {replace: true})
    }

    const handleClickPerson = () => {
        navigate('/person', {replace: true})
    }

    // const handleClickSettingsPay = () => {
    //     navigate('/settingspay', {replace: true})
    // }

    // const handleClickMyOrders = () => {
    //     navigate('/myorders', {replace: true})
    // }

    const backScreen = () => {
        navigate('/', {replace: true})
        // navigate('/home', {replace: true})
    }

    const user_deals = useSelector(selectUserDeals)

	function handleClickDeal(deal) {
		console.log(deal.id_to, user_id)
        // if (deal.id_to.toString() === user_id.toString()) {
        //     navigate(`/deal/${deal.deal_id}`, {replace: true, state: {deal: deal}})
        // }
        // else {
        //     dispatch(setDealInfo(deal))
        //     navigate('/completedeal', {replace: true, state: {deal: deal}})
        // }

        navigate(`/deal/${deal.deal_id}`, {replace: true})
		
	}

	const renderlistLastDeals = user_deals.slice(0, 3).map((deal, index) => {
		return (
				<div key={index} className='container-deal' onClick={() => {handleClickDeal(deal)}}>
					<div className='deal-col-1'>
						{/* <div className='text-deal'><span className='label-deal'>From:</span> {deal.user_from}</div>
						<div className='text-deal'><span className='label-deal'>To:</span> {deal.user_to}</div> */}
                        <div className='text-deal-date'> {deal?.datetime?.slice(0, 10)}</div>
						<div className='text-deal-request-from text-nowrap'>{`Запрос от ${deal.user_to}`}</div>
					</div>
					<div className='deal-col-2'>
						<div className='text-deal-quantity mr-17'>{deal.quantity} USDT</div>
                        <div className='text-deal-q-fiat'>${deal.quantity}</div>
						{/* <div className='text-deal text-nowrap'><span className='label-deal'>Статус: </span> 
							{
								deal.status === 'request' ? 'Запрос':
								deal.status === 'pay' ? 'Ожидание оплаты':
                                deal.status === 'cancel' ? 'Отменена':
								'Завершена'
							}
						</div> */}
					</div>
				</div>
		)
	})

        
    
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
                Создать объявление
            </div>
            <div className='trade-menu-text-col-2'>
                
            </div>
        </div>

    const faq = 
        <div className='row button-trade-menu'>
            <div className='trade-menu-text-col' onClick={() => {}}>
                FAQ
            </div>
            <div className='trade-menu-text-col-2'>
                
            </div>
        </div>

    const support = 
        <div className='row button-trade-menu'>
            <div className='trade-menu-text-col' onClick={() => {}}>
                Поддержка
            </div>
            <div className='trade-menu-text-col-2'>
                
            </div>
        </div>


    const menu_market = 
        <div className='row button-trade-menu'>
            {/* <div className='trade-menu-user-col'>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-person-fill" viewBox="0 0 16 16">
                    <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3Zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"/>
                </svg>
            </div> */}
            <div className='trade-menu-text-col' onClick={handleClickMarket}>
                Маркет
            </div>
            {/* {arrow_right} */}
            <div className='trade-menu-text-col-2'>
                Без комиссии
            </div>
        </div>

    const person = 
        <div className='row button-trade-menu'>
            {/* <div className='trade-menu-user-col'>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-person-fill" viewBox="0 0 16 16">
                    <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3Zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"/>
                </svg>
            </div> */}
            <div className='trade-menu-text-col' onClick={handleClickPerson}>
                Личный кабинет
            </div>
            {/* {arrow_right} */}
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
		getUserDeals({user_id: user_id}, (data) => {
			dispatch(setUserDeals(data.deals))
		})
	}, [dispatch, user_id]);

    useEffect(() => {
        tg.MainButton.hide()
        tg.BackButton.show()
    }, [tg.BackButton, tg.MainButton]);

    useEffect(() => {
        tg.onEvent('backButtonClicked', backScreen)
            return () => {tg.offEvent('backButtonClicked', backScreen)}
        }, )
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
                    < div className='title-last-deals'>Последние сделки</div>
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