import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { svg_address_to, svg_bep, svg_ok, svg_tron, svg_wait } from '../../const/svgs';
import { useTelegram } from '../../hooks/useTelegram';
import { selectAddress, selectAddressTRX } from '../Home/homeSlice';
import { ButtonNext } from '../Common/buttonNext';
import { sendTo } from './sendApi';

import './style.css'
import { QrReader, QrScanner } from './qrscanner';

export function Send (props) {
    const [date, setDate] = useState(new Date())
    const {user_id} = useTelegram()
    const navigate = useNavigate()
    const address = useSelector(selectAddress)
    const address_trx = useSelector(selectAddressTRX)

    const [stepSend, setStepSend] = useState('address') // address, confirm, wait, finish 
    // const [showLoader, setShowLoader] = useState(false)

    const [address1, setAddress1] = useState(address)
    const [address2, setAddress2] = useState(address_trx)

    const [fromLabel1, setFromLabel1] = useState('USDT BEP20')
    const [fromLabel2, setFromLabel2] = useState('USDT TRC20')

    const [addressTo, setAddressTo] = useState('')
    const [quantity, setQuantity] = useState('')
    
    const [showListAddresses, setShowListAddresses] = useState(false)
    const [showQrScanner, setShowQrScanner] = useState(false);

    const handleClickSelectAddress = () => {
        setShowListAddresses(!showListAddresses)
    }

    const handleChangeQuantity = (e) => {
        // console.log(e.target.value)
        // let inp = document.getElementById('q-send')
        // inp.style.width = (30 + (e.target.value.toString().length + 1) * 15) + 'px'
        setQuantity(e.target.value)
    }

    const handleClickAddresItem = () => {
        const from1 = fromLabel2
        const from2 = fromLabel1
        setFromLabel1(from1)
        setFromLabel2(from2)
        const a1 = address1
        const a2 = address2
        setAddress1(a2)
        setAddress2(a1)
        setShowListAddresses(false)
    }

    
    const handleChangeAddressTo = (e) => {
        setAddressTo(e.target.value)
    }

    function valid() {
        let res = true
        if (quantity === 0) {
            res = false
        }

        if (quantity.toString().length === 0) {
            res = false
        }

        return res
    }

    const handleClickSend = () => {
        if (stepSend === 'address') {
            let net = ''
            if (address1 === address) net = 'b'
            else if (address1 === address_trx) net = 't'
            console.log(typeof(quantity), quantity, address1)

            if (!valid()  || net === '') {
                alert('Проверьте данные')
                return
            }
            else {
                // setShowLoader(true)

                setStepSend('confirm')
            }
        }

        else if (stepSend === 'confirm') {

            setStepSend('wait')

            let net = ''
            if (address1 === address) net = 'b'
            else if (address1 === address_trx) net = 't'
            sendTo({
                net: net,
                user_id: user_id,
                address_from: address1,
                address_to: addressTo,
                quantity: quantity
            }, (data) => {
                // console.log('sendTo', data)
                // setShowLoader(false)
                // navigate('/home', {replace: true})
                setStepSend('finish')
            })
        }

        else if (stepSend === 'finish') {
            navigate('/home', {replace: true})
        }
        
    }

    // const handleClickCross = () => {
    //     setShowInputAddressTo(true)
    // }

    const divider = 
        <div className='send-divider'></div>

    
    useEffect(() => {
        // const inp = document.getElementById('q-send')
        
        // inp.style.width = '40px'
        // inp.focus()
        setDate(new Date())
    }, []);

    return (
        <div className='send-container'>
            <div className='title-send'>
                Отправить
            </div>

            {/* <div className='row d-flex align-items-center justify-content-center'>
                <input id='q-send' className='send-q-input' type='number'  onChange={handleChangeQuantity} value={quantity}/>
                <span style={{color: 'white', width: 'fit-content', height: 'fit-content'}}>USDT</span>
            </div> */}

            

            {stepSend === 'address' &&
                (
                    <>
                        {showQrScanner && <QrReader setAddressTo={setAddressTo}/>}
                        <div className='m-3'>

                        
                            <div className='row address-item mt-5 mx-2' onClick={handleClickSelectAddress}>
                                <div className='address-item-col1'>
                                    {/* <div className='title-from mb-2'>From</div> */}
                                    <div className='row p-0 m-0'>
                                        {/* <div className='address-circle'></div> */}
                                        <div className='svg-circle'>{fromLabel1 === 'USDT TRC20' ? svg_tron: svg_bep}</div>
                                        <div className='send-text text-nowrap'>{fromLabel1}</div>
                                    </div>
                                </div>

                                <div className='address-item-col2'>
                                    <svg  xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="white" className="bi bi-chevron-compact-down" viewBox="0 0 16 16">
                                        <path fillRule="evenodd" d="M1.553 6.776a.5.5 0 0 1 .67-.223L8 9.44l5.776-2.888a.5.5 0 1 1 .448.894l-6 3a.5.5 0 0 1-.448 0l-6-3a.5.5 0 0 1-.223-.67z"/>
                                    </svg>
                                </div>
                            </div>
                            {
                                showListAddresses ? (
                                    <div className='row address-item-2 mt-2' onClick={handleClickAddresItem}>

                                        <div className='address-item-col1'>
                                            <div className='row p-0 m-0'>
                                                {/* <div className='address-circle'></div> */}
                                                <div className='svg-circle'>{fromLabel2 === 'USDT TRC20' ? svg_tron: svg_bep}</div>
                                                <div className='send-text text-nowrap'>{fromLabel2}</div>
                                            </div>
                                        </div>

                                        <div className='address-item-col2'>
                                            {/* <svg onClick={handleClickSelectAddress} xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="white" className="bi bi-chevron-compact-down" viewBox="0 0 16 16">
                                                <path fillRule="evenodd" d="M1.553 6.776a.5.5 0 0 1 .67-.223L8 9.44l5.776-2.888a.5.5 0 1 1 .448.894l-6 3a.5.5 0 0 1-.448 0l-6-3a.5.5 0 0 1-.223-.67z"/>
                                            </svg> */}
                                        </div>

                                    </div>
                                ): null
                            }

                            {/* TO */}
                            <div className='row address-item mt-5 mb-2 p-1'>

                                <div className='address-item-col1'>
                                    {/* <div className='title-from mb-2'>To</div> */}
                                    <div className=' p-0 m-0 d-flex align-items-center'>
                                        {/* <div className='address-circle'></div> */}
                                        {/* {
                                            showInputAddressTo ? */}
                                        <input className='address-to-input' type='text' placeholder='Search, public address (0x) or ENS' onChange={handleChangeAddressTo} value={addressTo}/>:
                                            {/* <div className='send-text text-nowrap'>{`${addressTo.slice(0, 5)} ... ${addressTo.slice(-5)}`}</div>
                                        } */}
                                        
                                    </div>
                                </div>

                                <div className='address-item-col2'>
                                    <div onClick={()=>setShowQrScanner(true)}>{svg_address_to}</div>
                                    {/* <svg onClick={handleClickCross} xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="white" className="bi bi-x" viewBox="0 0 16 16">
                                        <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
                                    </svg> */}
                                </div>

                            </div>

                            {/* QUANTITY */}
                            <div className='row address-item mt-2 mb-5 p-1'>

                                <div className='address-item-col1'>
                                    <div className=' p-0 m-0 d-flex align-items-center'>
                                        <input className='address-to-input' type='number' placeholder='0 USDT' onChange={handleChangeQuantity} value={quantity}/>
                                    </div>
                                </div>

                                <div className='address-item-col2'>
                                    <div style={{color: 'var(--text-mini)'}}>Max</div>
                                </div>

                            </div>

                        </div>
                    </>
                )
            }
            {stepSend === 'confirm' && (
                <>
                    <div>
                        <label style={{color: 'white', fontSize: 34, marginTop: 30}}>{`${quantity} USDT`}</label>
                        <br></br>
                        <label style={{color: 'var(--btn-bg-color)'}}>{`${quantity} $`}</label>
                    </div>

                    <div className='confirm-data mt-5 mb-5 py-1'>
                        <div className='row m-2 py-2 d-flex justify-content-between'>
                            <div className='col-5 txt-l'>
                                Актив
                            </div>
                            <div className='col-5 txt-r'>
                                {fromLabel1}
                            </div>
                        </div>

                        {divider}

                        <div className='row m-2 py-2 d-flex justify-content-between'>
                            <div className='col-5 txt-l'>
                                Получатель
                            </div>
                            <div className='col-5 txt-r'>
                                {addressTo}
                            </div>
                        </div>

                        {divider}

                        <div className='row m-2 py-2 d-flex justify-content-between'>
                            <div className='col-5 txt-l'>
                                Сетевой сбор
                            </div>
                            <div className='col-5 txt-r'>
                                50 TRX
                            </div>
                        </div>

                        {divider}

                        <div className='row m-2 py-2 d-flex justify-content-between'>
                            <div className='col-5 txt-l-w'>
                                Макс Тотал
                            </div>
                            <div className='col-5 txt-r-w'>
                                {`$ ${quantity}`}
                            </div>
                        </div>
                    </div>
                </>
            )}

            {(stepSend === 'wait' || stepSend === 'finish') && (
                <>
                    <div className='trs-wait mt-5'>
                        <div className='row my-2 py-2 d-flex align-items-center'>
                            <div className='trs-wait-logo'>
                                {stepSend === 'wait' ? svg_wait: svg_ok}
                            </div>
                            <div className='trs-text-block'>
                                <label className='trs-text-1'>{(stepSend === 'wait' ? 'Транзакция в процессе': 'Транзакция завершена!')}</label>
                                <br></br>
                                <label className='trs-text-2'>{(stepSend === 'wait' ? 'Ожидаем подтверждений': '')}</label>
                            </div>
                        </div>
                    </div>

                    <div className='confirm-data mt-5 mb-5'>
                        <div className='row m-2 py-2 d-flex justify-content-between'>
                            <div className='col-5 txt-l'>
                                Дата
                            </div>
                            <div className='col-5 txt-r'>
                                {date.toLocaleDateString()}
                            </div>
                        </div>

                        <div className='row m-2 py-2 d-flex justify-content-between'>
                            <div className='col-5 txt-l'>
                                Сетевой сбор
                            </div>
                            <div className='col-5 txt-r'>
                                50 TRX
                            </div>
                        </div>

                        <div className='row m-2 py-2 d-flex justify-content-between'>
                            <div className='col-5 txt-l-w'>
                                Макс Тотал
                            </div>
                            <div className='col-5 txt-r-w'>
                                {`$ ${quantity}`}
                            </div>
                        </div>
                    </div>
                </>
            )}





            

            

            

            {/* {!showLoader &&  */}
                <div className='mx-2'>
                    <ButtonNext onClick={handleClickSend} 
                        style={(stepSend === 'wait' || stepSend === 'finish') ? 'grey': 'green'}
                        text={
                            stepSend === 'address' ? 'Далее': 
                            stepSend === 'confirm' ? 'Отправить':
                            'TRONSCAN'
                        }
                    />
                </div>
            {/* } */}

            {/* {showLoader && <div className="loader"></div>} */}

        </div>
      );
}

