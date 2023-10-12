import React, {useEffect} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTelegram } from '../../../hooks/useTelegram';
import { selectCurrencyFiat, setMethodPay } from '../ptpSlice';
import { getCompaniesPay, getUserMethodsPay } from '../settings_pay/settingsPayApi';
import { selectMethodsPay, setCompaniesPay, setMethodsPay } from '../settings_pay/settingsPaySlice';
// import { ButtonNext } from '../../Common/buttonNext';
import { useState } from 'react';
import { NewMethodPay } from '../settings_pay/NewMethodPay';
import { dictionary } from '../../../const/dictionary';

export function CreateOrder2(props) {
    const {user_id, language_code} = useTelegram()
    const dispatch = useDispatch()

    const add_payment_methods = language_code === 'ru' ? dictionary.add_payment_methods.ru: dictionary.add_payment_methods.en
    const add_payments_method = language_code === 'ru' ? dictionary.add_payments_method.ru: dictionary.add_payments_method.en

    const further = language_code === 'ru' ? dictionary.further.ru: dictionary.further.en
    const choose_payment_method = language_code === 'ru' ? dictionary.choose_payment_method.ru: dictionary.choose_payment_method.en

    const listCheckedMethods = props.listCheckedMethods
    const setListCheckedMethods = props.setListCheckedMethods
    
    const [showNewMethod, setShowNewMethod] = useState(false);

    // const method_pay = useSelector(selectMethodPay)
    const currencyFiat = useSelector(selectCurrencyFiat)

    const list_methods = useSelector(selectMethodsPay)

    const divider = 
        <div className='container-center'>
            <div className='divider-method'></div>
        </div>

    

    function handleClickCheck(index) {        
        let arr = listCheckedMethods.slice()
        arr[index] = !arr[index]

        const initialValue = 0;
        const sumWithInitial = arr.reduce(
            (accumulator, currentValue) => accumulator + currentValue*1,
            initialValue
        );
        
        if (sumWithInitial > 3) return
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
                <div className='method-pay-row'>
                    <div>
                        <div className='method-order-text1'>{method?.company_name}</div>
                        <div className='method-order-text2'>{method?.card_number}</div>
                    </div>
                    <div className=''>
                        <div className={listCheckedMethods[index] ? 'method-switch anim-switch': 'method-switch-off anim-switch-off'}
                            onClick={() => {handleClickCheck(index)}}
                        >
                            <div className={listCheckedMethods[index] ? 'method-switch-circle anim-circle':'method-switch-off-circle anim-circle-b'}></div>
                        </div>
                    </div>
                        
                </div>
                {index !== list_methods.length - 1 && divider}
            </div>
        )
    })







    const handleClickAddMethodPay = () => {
        setShowNewMethod(true)
    }
    

    useEffect(() => {
        getUserMethodsPay({user_id: user_id}, (data) => {
            setListCheckedMethods(Array(data.methods.length).fill(false))
            dispatch(setMethodsPay(data.methods))
            if (data.methods.length > 0) {
                dispatch(setMethodPay(data.methods[0]))
            }
        })
    }, [dispatch, setListCheckedMethods, user_id]);
    
    useEffect(() => {
        getCompaniesPay({fiat_id: currencyFiat}, (data) => {
            // console.log('getCompaniesPay', data)
            dispatch(setCompaniesPay(data.companies_pay))
        })
    }, [currencyFiat, dispatch]);

    return (
        <>

            {   showNewMethod &&
            <div className='container-create-order mt-20'>
                <NewMethodPay 
                    setShowNewMethod={setShowNewMethod} 
                    is_new={true} 
                    setIsNew={(e)=>{}} 
                    methodId={0}
                    setMethodId={()=>{}}
                    selectedCompanyIndex={0}
                />
            </div>
            }


            {!showNewMethod &&

                <div className='container-create-order mt-20'>
                    <div className='container-title'>
                        <div className='title-text'>{add_payment_methods}</div>
                        <div className='page-number'>2/4</div>
                    </div>

                    {/* <div className='currency-settings-container mt-2'>
                        {render_method_pay}
                    </div> */}

                    
                    <div className='methods-pay-container mt-20'>
                        {renderListMethods}
                    </div>

                    {/* <div style={{height: '43vh', borderBottomRightRadius: 0, borderBottomLeftRadius: 0}} className='container-list-companies overflow-auto mb-3'>
                        {companies_pay.map ((company, index) => {
                            return (
                                    <div key={company.id} className='container-company row d-flex align-items-center' onClick={() => {handleClickCompany(index)}}>
                                        <div className='text-company'>{company.name}</div>
                                        {arrow_right}
                                    </div>
                            )
                        })}
                    </div> */}
                    <div className='container-center mt-20'>
                        <div className='btn-add-method-pay'
                            onClick={handleClickAddMethodPay}
                        >
                            <div className='svg-add-method'>
                                <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path fill-rule="evenodd" clip-rule="evenodd" d="M15 30C23.2843 30 30 23.2843 30 15C30 6.71573 23.2843 0 15 0C6.71573 0 0 6.71573 0 15C0 23.2843 6.71573 30 15 30ZM22 17.9251V13.0749H17.2752V8H11.7248V13.0749H7V17.9251H11.7248V23H17.2752V17.9251H22Z" fill="#86EFAC"/>
                                </svg>
                            </div>
                            <div className='btn-add-method-text'>{add_payments_method}</div>
                        </div>
                    </div>
                    
                    
                    {/* <ButtonNext onClick={() => {props.setScreen('createorder3')}}/> */}

                    <div onClick={() => { if (listCheckedMethods.indexOf(true) !== -1) props.setScreen('createorder3') }} 
                        className={`button-send-box ${listCheckedMethods.indexOf(true) !== -1 ? 'button-active-send-bg active-text': 'button-send-bg disable-text'} mt-20`}
                    >
                        {listCheckedMethods.indexOf(true) !== -1 ? further: choose_payment_method}
                    </div>
                </div>
            }
        </>
    );
}
