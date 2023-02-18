import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useTelegram } from '../../../hooks/useTelegram';
import { getMethodInfo, getUserMethodsPay, newMethodPay, updateMethodPay } from './settingsPayApi';
import { selectBank, selectCard, selectInfo, selectMethodsPay, selectNameMethod, setBank, setCard, setInfo, setMethodsPay, setNameMethod } from './settingsPaySlice';

import './style.css'


export function SettingsPay() {
    const { user_id, tg } = useTelegram()
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [showNewMethod, setShowNewMethod] = useState(false)
    const [is_new, setIsNew] = useState(true)
    const [methodId, setMethodId] = useState(0)

    const list_methods = useSelector(selectMethodsPay)
    const name_method = useSelector(selectNameMethod)
    const bank = useSelector(selectBank)
    const card = useSelector(selectCard)
    const info = useSelector(selectInfo)

    const handleChangeNameMethod = (e) => {
        dispatch(setNameMethod(e.target.value))
    }

    const handleChangeBank = (e) => {
        dispatch(setBank(e.target.value))
    }

    const handleChangeCard = (e) => {
        dispatch(setCard(e.target.value))
    }

    const handleChangeInfo = (e) => {
        dispatch(setInfo(e.target.value))
    }

    const handleSaveMethod = () => {
        newMethodPay({
            user_id: user_id, 
            name: name_method, 
            bank: bank, 
            card: card, 
            info: info
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
            bank: bank, 
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

    const backScreen = () => {
        if (showNewMethod) {
            setShowNewMethod(false)
        }
        else navigate('/ptp', {replace: true})
    }

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
        <div className='container-settings-pay p-5'>
            {   !showNewMethod &&
                <div>
                    <div className='method-text button-new-method' onClick={() => setShowNewMethod(true)}>Добавить</div>

                    <div className='method-text mt-4 mb-2'>Методы оплаты</div>

                    <div className='container-list-methods'>
                        {list_methods.map ((method) => {
                            return (
                                    <div key={method.id} className='container-method' onClick={() => {handleClickMethod(method.id)}}>
                                        <div className='text-deal'>{method.name}</div>
                                        <div className='text-deal'><span className='label-deal'>Банк: </span> {method.company}</div>
                                    </div>
                            )
                        })}
                    </div>
                </div>
            }

            {   showNewMethod &&
                <div className='container-new-method'>

                    <div>{methodId === 0 ? 'Новый метод оплаты': ''}</div>

                    <label style={{textAlign: 'left', width: '100%'}}>Название</label>
                    <input className='method-input' type='text' onChange={handleChangeNameMethod} value={name_method}/>

                    <label style={{textAlign: 'left', width: '100%'}}>Банк</label>
                    <input className='method-input' type='text'  onChange={handleChangeBank} value={bank}/>

                    <label style={{textAlign: 'left', width: '100%'}}>Номер карты</label>
                    <input className='method-input' type='number' onChange={handleChangeCard} value={card}/>

                    <label style={{textAlign: 'left', width: '100%'}}>Комментарий</label>
                    <input className='method-input' type='text' onChange={handleChangeInfo} value={info}/>

                    <div className='method-text button-new-method mt-3' onClick={is_new ? handleSaveMethod: handleUpdateMethod}>Сохранить</div>
                </div>
            }
            
        </div>
    );
}
