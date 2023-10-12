import React, {useEffect} from 'react';
import './style.css'
import { useDispatch, useSelector } from 'react-redux';
import { selectCard, selectCompaniesPay, selectInfo, selectNameMethod, selectSelectdCompanyIndex, setCard, setCompaniesPay, setInfo, setMethodsPay, setNewMethod } from './settingsPaySlice';
import { useState } from 'react';
import { Selecter } from '../../Common/selecter';
import { CURRENCY_FIAT_LIST } from '../../../const/devdata';
import { deleteMethodPay, getCompaniesPay, getUserMethodsPay, newMethodPay, updateMethodPay } from './settingsPayApi';
import { useTelegram } from '../../../hooks/useTelegram';
import { dictionary } from '../../../const/dictionary';

export function NewMethodPay( props ) {
    const setMethodId = props.setMethodId
    const methodId = props.methodId
    const setIsNew = props.setIsNew
    const is_new = props.is_new
    const { user_id, language_code } = useTelegram()
    const dispatch = useDispatch()
    const [showListCompaniesPay, setShowListCompaniesPay] = useState(false);
    const [currencyFiat, setCurrencyFiat] = useState(1)
    
    const [selectedCompanyIndex, setSelectedCompanyIndex] = useState(0);

    const add_payments_method = language_code === 'ru' ? dictionary.add_payments_method.ru: dictionary.add_payments_method.en
    const account_card_phone = language_code === 'ru' ? dictionary.account_card_phone.ru: dictionary.account_card_phone.en
    const save = language_code === 'ru' ? dictionary.save.ru: dictionary.save.en
    const delete_label = language_code === 'ru' ? dictionary.delete.ru: dictionary.delete.en 
    const payment_method = language_code === 'ru' ? dictionary.payment_method.ru: dictionary.payment_method.en
    const full_name = language_code === 'ru' ? dictionary.full_name.ru: dictionary.full_name.en


    const companies_pay = useSelector(selectCompaniesPay)
    const card = useSelector(selectCard)
    const info = useSelector(selectInfo)
    const name_method = useSelector(selectNameMethod)

    const companyIndex = useSelector(selectSelectdCompanyIndex)
    // const currencyFiat = useSelector(selectCurrencyFiat)

    const handleSelectMethodClick = () => {
        // console.log(9)
        setShowListCompaniesPay(true)
    }

    const handleChangeCard = (e) => {
        dispatch(setCard(e.target.value))
    }

    const handleChangeInfo = (e) => {
        dispatch(setInfo(e.target.value))
    }

    const handleGetUserMethodsPay = () => {
        getUserMethodsPay({user_id: user_id}, (data) => {
            dispatch(setMethodsPay(data.methods))
        })
    }

    const handleSaveMethod = () => {
        // console.log('handleSaveMethod')
        newMethodPay({
            user_id: user_id, 
            name: name_method, 
            // bank: bank, 
            bank: '',
            card: card, 
            info: info,
            company_pay_id: companies_pay[selectedCompanyIndex].id,
            fiat_id: currencyFiat 

        }, (data) => {

            // console.log(data)
            dispatch(setNewMethod(false))
            props.setShowNewMethod(false)
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

            // console.log(data)
            dispatch(setNewMethod(false))
            handleGetUserMethodsPay()
            setIsNew(true)
            setMethodId(0)
        })
    }

    
    const handleDeleteMethod = () => {
        deleteMethodPay({
            method_id: methodId
        }, (data) => {

            // console.log(data)
            dispatch(setNewMethod(false))
            handleGetUserMethodsPay()
            setIsNew(true)
            setMethodId(0)
        })
    }

    function handleChangeCurrencyFiat(index) {
        setCurrencyFiat(index+1)
        // console.log('handleChangeCurrencyFiat', index)
        getCompaniesPay({fiat_id: index+1}, (data) => {
            // console.log('getCompaniesPay', data)
            dispatch(setCompaniesPay(data.companies_pay))
        })
    }

    function handleClickCompany(index) {
        setSelectedCompanyIndex(index)
        setShowListCompaniesPay(false)
    }

    const arrow_right = 
        <div className='trade-menu-arrow-col'>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chevron-right" viewBox="0 0 16 16">
                <path fillRule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"/>
            </svg>
        </div>

    useEffect(() => {
        
    }, []);

    useEffect(() => {
        getCompaniesPay({fiat_id: 1}, (data) => {
            // console.log('getCompaniesPay', data)
            dispatch(setCompaniesPay(data.companies_pay))

            if (companyIndex) {
                // console.log('companyIndex', companyIndex, data.companies_pay)
                let ind = data.companies_pay.findIndex(e => e.id === companyIndex)
                setSelectedCompanyIndex(ind)
                // console.log('ind', ind)
            }
        })
    }, [companyIndex, dispatch]);

    return (
        <>
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
                            <div className='method-pay-title'>{methodId === 0 ? add_payments_method: ''}</div>

                            <div className='container-method-info mt-2 p-3'>
                                <div className='method-pay-label mt-3'>{payment_method}</div>
                                <div className='cntr-row mt-10'>
                                    
                                    <div className='method-input'>
                                        <div className='method-pay-text' onClick={handleSelectMethodClick}>{companies_pay[selectedCompanyIndex]?.name || ' '}</div>
                                    </div>

                                    <div className='filter-item-fiat position-relative ml-7'>
                                        <Selecter 
                                            list_values={CURRENCY_FIAT_LIST} 
                                            class_name={'filter-item-fiat text-nowrap'} 
                                            setIndex={handleChangeCurrencyFiat} 
                                            selected_value={currencyFiat}
                                            is_show={true}
                                            setSelecter={()=>{}}
                                        />
                                        <div>
                                            <svg width="8" height="14" viewBox="0 0 8 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path fill-rule="evenodd" clip-rule="evenodd" d="M4 0C4.26522 5.96046e-08 4.51957 0.105357 4.70711 0.292893L7.70711 3.29289C8.09763 3.68342 8.09763 4.31658 7.70711 4.70711C7.31658 5.09763 6.68342 5.09763 6.29289 4.70711L4 2.41421L1.70711 4.70711C1.31658 5.09763 0.683417 5.09763 0.292893 4.70711C-0.0976311 4.31658 -0.097631 3.68342 0.292893 3.29289L3.29289 0.292893C3.48043 0.105357 3.73478 0 4 0ZM0.292893 9.29289C0.683417 8.90237 1.31658 8.90237 1.70711 9.29289L4 11.5858L6.29289 9.29289C6.68342 8.90237 7.31658 8.90237 7.70711 9.29289C8.09763 9.68342 8.09763 10.3166 7.70711 10.7071L4.70711 13.7071C4.31658 14.0976 3.68342 14.0976 3.29289 13.7071L0.292893 10.7071C-0.0976311 10.3166 -0.0976311 9.68342 0.292893 9.29289Z" fill="white"/>
                                            </svg>
                                        </div>
                                    </div>

                                </div>
                                
                                <input className='method-input mt-2 ' onChange={handleChangeCard} value={card} placeholder={account_card_phone}/>
                                <input className='method-input mt-2 mb-4' onChange={handleChangeInfo} value={info} placeholder={full_name}/>
                            </div>

                            <div className='method-text-button button-new-method mt-3' 
                                onClick={is_new ? handleSaveMethod: handleUpdateMethod}
                            >
                                {save}
                            </div>
                            {!is_new &&
                                <div className='method-text-button button-new-method mt-3' 
                                    onClick={handleDeleteMethod}
                                >
                                    {delete_label}
                                </div>
                            }
                        </>
                    }
                </div>
        </>
    );
}

