import React, {useEffect} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTelegram } from '../../../hooks/useTelegram';
import { selectMethodPay, setMethodPay } from '../ptpSlice';
import { getUserMethodsPay } from '../settings_pay/settingsPayApi';
import { selectMethodsPay, setMethodsPay } from '../settings_pay/settingsPaySlice';
// import { ButtonNext } from '../../Common/buttonNext';

export function CreateOrder2(props) {
    const {user_id} = useTelegram()
    const dispatch = useDispatch()

    const method_pay = useSelector(selectMethodPay)

    const list_methods = useSelector(selectMethodsPay)

    const divider = 
        <div className='divider-currency m-m-10'></div>

    const arrow_right = 
        <div className='trade-menu-arrow-col'>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chevron-right" viewBox="0 0 16 16">
                <path fillRule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"/>
            </svg>
        </div>

    const renderListMethods = list_methods.map((method, index) => {
        return (
            <div key={index} >
                <div className='row button-trade-menu' onClick={()=>dispatch(setMethodPay(method))}>
                    <div className='method-name-col'>
                        {method.name}
                    </div>
                    {arrow_right}
                </div>
                {index !== list_methods.length - 1 && divider}
            </div>
        )
    })

    const render_method_pay = 
        <div className='row button-currency-settings'>
            <div className='currency-settings-item-col1'>
                <div>
                    <div className='method-pay-text'>{method_pay?.name}</div>
                    <div className='method-pay-text'>{method_pay?.card_number}</div>
                </div>
            </div>
            <div className='method-pay-col2'>
                <div className='form-check form-switch'>
                    <input className="form-check-input" type="checkbox" />
                </div>
            </div>
                
        </div>

    useEffect(() => {
        getUserMethodsPay({user_id: user_id}, (data) => {
            dispatch(setMethodsPay(data.methods))
            if (data.methods.length > 0) {
                dispatch(setMethodPay(data.methods[0]))
            }
        })
    }, [dispatch, user_id]);
    

    return (
        <div>
            <div className='row  mt-3'>
                <div className='col-9 t-left-align text-dark-color'>Добавить методы оплаты</div>
                <div className='col-2'>2/4</div>
            </div>

            <div className='currency-settings-container mt-1'>
                {render_method_pay}
            </div>

            
            <div className='trade-menu-container mt-5 mb-5'>
                {renderListMethods}
            </div>
            
            {/* <ButtonNext onClick={() => props.setScreen('createorder4')}/> */}
        </div>
    );
}
