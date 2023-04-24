import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useTelegram } from '../../../hooks/useTelegram';
import { getCompaniesPay, getMethodInfo, getUserMethodsPay } from './settingsPayApi';
import {   selectMethodsPay, setBank, setCard, setCompaniesPay, setInfo, setMethodsPay, setNameMethod } from './settingsPaySlice';

import './style.css'
import { NewMethodPay } from './NewMethodPay';


export function SettingsPay() {
    const { user_id, tg } = useTelegram()
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [showNewMethod, setShowNewMethod] = useState(false)
    const [is_new, setIsNew] = useState(true)
    const [methodId, setMethodId] = useState(0)



    

    

    const list_methods = useSelector(selectMethodsPay)

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



    const backScreen = () => {
        if (showNewMethod) {
            setShowNewMethod(false)
        }
        else navigate('/person', {replace: true})
    }





    useEffect(() => {
        getCompaniesPay({fiat_id: 1}, (data) => {
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
        tg.MainButton.hide()
        tg.BackButton.show()
    }, [tg.BackButton, tg.MainButton]);

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
                <NewMethodPay 
                    setShowNewMethod={setShowNewMethod} 
                    is_new={is_new} 
                    setIsNew={setIsNew} 
                    methodId={methodId}
                    setMethodId={setMethodId}
                />
            }
            
        </div>
    );
}
