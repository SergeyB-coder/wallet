import React, {useEffect} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTelegram } from '../../../hooks/useTelegram';
import { setMethodPay } from '../ptpSlice';
import { getCompaniesPay, getUserMethodsPay, newMethodPay } from '../settings_pay/settingsPayApi';
import { selectCard, selectCompaniesPay, selectMethodsPay, setCard, setCompaniesPay, setMethodsPay } from '../settings_pay/settingsPaySlice';
// import { ButtonNext } from '../../Common/buttonNext';
import { useState } from 'react';

export function CreateOrder2(props) {
    const {user_id} = useTelegram()
    const dispatch = useDispatch()

    const listCheckedMethods = props.listCheckedMethods
    const setListCheckedMethods = props.setListCheckedMethods
    
    const [showNewMethod, setShowNewMethod] = useState(false);
    const [indexSelectedCompany, setIndexSelectedCompany] = useState(0)

    // const method_pay = useSelector(selectMethodPay)
    const companies_pay = useSelector(selectCompaniesPay)

    const list_methods = useSelector(selectMethodsPay)
    const card = useSelector(selectCard)

    const divider = 
        <div className='divider-currency m-m-10'></div>

    const arrow_right = 
        <div className='trade-menu-arrow-col'>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chevron-right" viewBox="0 0 16 16">
                <path fillRule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"/>
            </svg>
        </div>

    // const render_method_pay = 
    // <div className='row button-currency-settings'>
    //     <div className='currency-settings-item-col1'>
    //         <div>
    //             <div className='method-order-text1'>{method_pay?.name}</div>
    //             <div className='method-order-text2'>{method_pay?.card_number}</div>
    //         </div>
    //     </div>
    //     <div className='method-pay-col2'>
    //         <div className='form-check form-switch'>
    //             <input className="form-check-input" type="checkbox" />
    //         </div>
    //     </div>
            
    // </div>

    function handleClickCompany(index) {
        setIndexSelectedCompany(index)
        setShowNewMethod(true)
    }

    function handleClickCheck(index) {
        let arr = listCheckedMethods.slice()
        arr[index] = !arr[index]
        setListCheckedMethods(arr)
    }

    const renderListMethods = list_methods.map((method, index) => {
        return (
            <div key={index} >
                {/* <div className='row button-trade-menu' onClick={()=>dispatch(setMethodPay(method))}>
                    <div className='method-name-col'>
                        {method.name}
                    </div>
                    {arrow_right}
                </div> */}
                <div className='row button-currency-settings'>
                    <div className='currency-settings-item-col1'>
                        <div>
                            <div className='method-order-text1'>{method?.company_name}</div>
                            <div className='method-order-text2'>{method?.card_number}</div>
                        </div>
                    </div>
                    <div className='method-pay-col2'>
                        <div className={listCheckedMethods[index] ? 'method-switch': 'method-switch-off'}
                            onClick={() => {handleClickCheck(index)}}
                        >
                            <div className={listCheckedMethods[index] ? 'method-switch-circle':'method-switch-off-circle'}></div>
                        </div>
                    </div>
                        
                </div>
                {index !== list_methods.length - 1 && divider}
            </div>
        )
    })

    const handleChangeCard = (e) => {
        dispatch(setCard(e.target.value))
    }

    const handleGetUserMethodsPay = () => {
        getUserMethodsPay({user_id: user_id}, (data) => {
            dispatch(setMethodsPay(data.methods))
        })
    }

    const handleSaveMethod = () => {
        console.log('handleSaveMethod')
        newMethodPay({
            user_id: user_id, 
            name: '', 
            // bank: bank, 
            bank: '',
            card: card, 
            info: '',
            company_pay_id: companies_pay[indexSelectedCompany].id

        }, (data) => {

            console.log(data)
            setShowNewMethod(false)
            handleGetUserMethodsPay()
        })
    }
    

    useEffect(() => {
        getUserMethodsPay({user_id: user_id}, (data) => {
            setListCheckedMethods(Array(data.methods.length).fill(true))
            dispatch(setMethodsPay(data.methods))
            if (data.methods.length > 0) {
                dispatch(setMethodPay(data.methods[0]))
            }
        })
    }, [dispatch, setListCheckedMethods, user_id]);
    
    useEffect(() => {
        getCompaniesPay({}, (data) => {
            console.log('getCompaniesPay', data)
            dispatch(setCompaniesPay(data.companies_pay))
        })
    }, [dispatch]);

    return (
        <>
        {   showNewMethod ?
            <div>
                <div className='container-new-method'>
                            <div className='method-pay-title'>Добавить метод оплаты</div>

                            <div className='container-method-info mt-2 p-3'>
                                <div className='method-pay-label mt-3'>Метод</div>
                                <div className='method-input mt-2'>
                                    <div className='method_pay-text' onClick={() => setShowNewMethod(false)}>{companies_pay[indexSelectedCompany].name || ' '}</div>
                                </div>
                                <input className='method-input mt-2 mb-4' onChange={handleChangeCard} value={card} placeholder='Аккаунт, карта/телефон'/>
                            </div>

                            <div className='method-text-button button-new-method mt-3' onClick={handleSaveMethod}>Сохранить</div>
                       
                </div>
            </div>:
            <div>
                <div className='row  mt-3'>
                    <div className='col-9 t-left-align text-dark-color'>Добавить методы оплаты</div>
                    <div className='col-2 text-dark-color'>2/4</div>
                </div>

                {/* <div className='currency-settings-container mt-2'>
                    {render_method_pay}
                </div> */}

                
                <div className='trade-menu-container mt-5 mb-5'>
                    {renderListMethods}
                </div>

                <div style={{height: '43vh', borderBottomRightRadius: 0, borderBottomLeftRadius: 0}} className='container-list-companies overflow-auto mb-3'>
                    {companies_pay.map ((company, index) => {
                        return (
                                <div key={company.id} className='container-company row d-flex align-items-center' onClick={() => {handleClickCompany(index)}}>
                                    <div className='text-company'>{company.name}</div>
                                    {arrow_right}
                                </div>
                        )
                    })}
                </div>
                
                {/* <ButtonNext onClick={() => {
                    props.setScreen('createorder3')}}/> */}
            </div>
        }
        </>
    );
}
