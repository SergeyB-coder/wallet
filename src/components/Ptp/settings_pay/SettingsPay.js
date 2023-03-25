import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useTelegram } from '../../../hooks/useTelegram';
import { getCompaniesPay, getMethodInfo, getUserMethodsPay, newMethodPay, updateMethodPay } from './settingsPayApi';
import {  selectCard, selectCompaniesPay, selectInfo, selectMethodsPay, selectNameMethod, setBank, setCard, setCompaniesPay, setInfo, setMethodsPay, setNameMethod } from './settingsPaySlice';

import './style.css'


export function SettingsPay() {
    const { user_id, tg } = useTelegram()
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [showNewMethod, setShowNewMethod] = useState(false)
    const [is_new, setIsNew] = useState(true)
    const [methodId, setMethodId] = useState(0)

    const [selectedCompanyIndex, setSelectedCompanyIndex] = useState(0);

    const [showListCompaniesPay, setShowListCompaniesPay] = useState(false);

    const list_methods = useSelector(selectMethodsPay)
    const companies_pay = useSelector(selectCompaniesPay)
    const name_method = useSelector(selectNameMethod)
    // const bank = useSelector(selectBank)
    const card = useSelector(selectCard)
    const info = useSelector(selectInfo)

    const arrow_right = 
        <div className='trade-menu-arrow-col'>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chevron-right" viewBox="0 0 16 16">
                <path fillRule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"/>
            </svg>
        </div>

    // const handleChangeNameMethod = (e) => {
    //     dispatch(setNameMethod(e.target.value))
    // }

    // const handleChangeBank = (e) => {
    //     dispatch(setBank(e.target.value))
    // }

    const handleChangeCard = (e) => {
        dispatch(setCard(e.target.value))
    }

    // const handleChangeInfo = (e) => {
    //     dispatch(setInfo(e.target.value))
    // }

    const handleSaveMethod = () => {
        console.log('handleSaveMethod')
        newMethodPay({
            user_id: user_id, 
            name: name_method, 
            // bank: bank, 
            bank: '',
            card: card, 
            info: info,
            company_pay_id: companies_pay[selectedCompanyIndex].id

        }, (data) => {

            console.log(data)
            setShowNewMethod(false)
            handleGetUserMethodsPay()
        })
    }

    const handleUpdateMethod = () => {
        updateMethodPay({
            method_id: methodId, 
            name: name_method, 
            // bank: bank, 
            bank: '',
            card: card, 
            info: info
        }, (data) => {

            console.log(data)
            setShowNewMethod(false)
            handleGetUserMethodsPay()
            setIsNew(true)
            setMethodId(0)
        })
    }

    const handleGetUserMethodsPay = () => {
        getUserMethodsPay({user_id: user_id}, (data) => {
            dispatch(setMethodsPay(data.methods))
        })
    }

    function handleClickMethod (method_id) {
        setMethodId(method_id)
        setIsNew(false)
        getMethodInfo({method_id: method_id}, (data) => {
            dispatch(setNameMethod(data.method_info.name))
            dispatch(setBank(data.method_info.company))
            dispatch(setCard(data.method_info.card_number))
            dispatch(setInfo(data.method_info.info))
        })
        setShowNewMethod(true)
    }

    function handleClickCompany(index) {
        setSelectedCompanyIndex(index)
        setShowListCompaniesPay(false)
    }

    const backScreen = () => {
        if (showNewMethod) {
            setShowNewMethod(false)
        }
        else navigate('/myorders', {replace: true})
    }

    const handleSelectMethodClick = () => {
        setShowListCompaniesPay(true)
    }

    useEffect(() => {
        getCompaniesPay({}, (data) => {
            console.log('getCompaniesPay', data)
            dispatch(setCompaniesPay(data.companies_pay))
        })
    }, [dispatch]);

    useEffect(() => {
        getUserMethodsPay({user_id: user_id}, (data) => {
            dispatch(setMethodsPay(data.methods))
        })
    }, [dispatch, user_id]);

    useEffect(() => {
        tg.onEvent('backButtonClicked', backScreen)
            return () => {tg.offEvent('backButtonClicked', backScreen)}
    }, )

    return (
        <div className='container-settings-pay p-4'>
            {   !showNewMethod &&
                <div>
                    <div className='method-text-button button-new-method' onClick={() => setShowNewMethod(true)}>Добавить</div>

                    <div className='method-text mt-4 mb-2'>Методы оплаты</div>

                    <div className='container-list-methods'>
                        {list_methods.map ((method) => {
                            return (
                                    <div key={method.id} className='container-method' onClick={() => {handleClickMethod(method.id)}}>
                                        <div className='text-deal'>{method.company_name}</div>
                                        <div className='text-deal'><span className='label-deal'>Карта: </span> {method.card_number}</div>
                                    </div>
                            )
                        })}
                    </div>
                </div>
            }

            {   showNewMethod &&
                <div className='container-new-method'>
                    {
                        showListCompaniesPay ?
                        <>
                            <div className='container-list-companies'>
                                {companies_pay.map ((company, index) => {
                                    return (
                                            <div key={company.id} className='container-company row d-flex align-items-center' onClick={() => {handleClickCompany(index)}}>
                                                <div className='text-company'>{company.name}</div>
                                                {arrow_right}
                                            </div>
                                    )
                                })}
                            </div>
                        </>:
                        <>
                            <div className='method-pay-title'>{methodId === 0 ? 'Добавить метод оплаты': ''}</div>

                            <div className='container-method-info mt-2 p-3'>
                                <div className='method-pay-label mt-3'>Метод</div>
                                <div className='method-input mt-2'>
                                    <div className='method_pay-text' onClick={handleSelectMethodClick}>{companies_pay[selectedCompanyIndex].name || ' '}</div>
                                </div>
                                <input className='method-input mt-2 mb-4' onChange={handleChangeCard} value={card} placeholder='Аккаунт, карта/телефон'/>
                            </div>

                            {/* <label style={{textAlign: 'left', width: '100%'}}>Название</label>
                            <input className='method-input' type='text' onChange={handleChangeNameMethod} value={name_method}/>

                            <label style={{textAlign: 'left', width: '100%'}}>Банк</label>
                            <input className='method-input' type='text'  onChange={handleChangeBank} value={bank}/>

                            <label style={{textAlign: 'left', width: '100%'}}>Номер карты</label>
                            <input className='method-input' type='number' onChange={handleChangeCard} value={card}/>

                            <label style={{textAlign: 'left', width: '100%'}}>Комментарий</label>
                            <input className='method-input' type='text' onChange={handleChangeInfo} value={info}/> */}

                            <div className='method-text-button button-new-method mt-3' onClick={is_new ? handleSaveMethod: handleUpdateMethod}>Сохранить</div>
                        </>
                    }
                </div>
            }
            
        </div>
    );
}
