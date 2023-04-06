import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { svg_address_to, svg_bep, svg_gear, svg_ok, svg_tron } from '../../const/svgs';
import { useTelegram } from '../../hooks/useTelegram';
import { selectAddress, selectAddressTRX, selectBalance, selectBalanceTRX } from '../Home/homeSlice';
import { sendTo } from './sendApi';

import './style.css'
import { QrReader } from './qrscanner';

export function Send (props) {
    const [date, setDate] = useState(new Date())
    const {user_id} = useTelegram()
    const navigate = useNavigate()
    const address = useSelector(selectAddress)
    const address_trx = useSelector(selectAddressTRX)

    const balance = useSelector(selectBalance)
	const balance_trx = useSelector(selectBalanceTRX)

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
    const [isReady, setIsReady] = useState(false);

    function checkIsReady(address_to, q) {
        if (address_to.length > 0 && q.length > 0) setIsReady(true)
        else setIsReady(false)
    }

    const handleClickSelectAddress = () => {
        setShowListAddresses(!showListAddresses)
    }

    const handleChangeQuantity = (e) => {
        // console.log(e.target.value)
        // let inp = document.getElementById('q-send')
        // inp.style.width = (30 + (e.target.value.toString().length + 1) * 15) + 'px'
        checkIsReady(addressTo, e.target.value)
        setQuantity(e.target.value)
    }

    const handleClickAddresItem = () => {
        setQuantity(0)
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
        checkIsReady(e.target.value, quantity)
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
            navigate('/', {replace: true})
            // navigate('/home', {replace: true})
        }
        
    }

    // const handleClickCross = () => {
    //     setShowInputAddressTo(true)
    // }

    const divider = 
        <div className='container-center'>
            <div className='line-2'></div>
        </div>

    
    useEffect(() => {
        // const inp = document.getElementById('q-send')
        
        // inp.style.width = '40px'
        // inp.focus()
        setDate(new Date())
    }, []);

    return (
        <div className='d-flex justify-content-center'>
            <div className='send-container'>
                <div className='container-title mt-20'>
                    <div className='title-send'>
                        {
                            stepSend === 'address' ? 'Отправить': 
                            stepSend === 'confirm' ? 'Подтвердите перевод':
                            stepSend === 'wait' ? 'Ожидайте статус':
                            'Транзакция завершена'
                        }
                    </div>
                    
                    <div className='page-number'>
                        {
                            stepSend === 'address' ? '1/4': 
                            stepSend === 'confirm' ? '2/4':
                            stepSend === 'wait' ? '3/4':
                            '4/4'
                        }
                    </div>
                </div>

                {/* <div className='row d-flex align-items-center justify-content-center'>
                    <input id='q-send' className='send-q-input' type='number'  onChange={handleChangeQuantity} value={quantity}/>
                    <span style={{color: 'white', width: 'fit-content', height: 'fit-content'}}>USDT</span>
                </div> */}

                

                {stepSend === 'address' &&
                    (
                        <>
                            {showQrScanner && <QrReader setAddressTo={setAddressTo} setShowQrScanner={setShowQrScanner}/>}
                            <div className=''>
                                <div className='address-item' onClick={handleClickSelectAddress}>
                                    {/* <div className='address-item-col1'> */}
                                        {/* <div className='title-from mb-2'>From</div> */}
                                        {/* <div className='row p-0 m-0'> */}
                                            {/* <div className='address-circle'></div> */}
                                    <div className='svg-circle'>{fromLabel1 === 'USDT TRC20' ? svg_tron: svg_bep}</div>
                                    <div className='send-text text-nowrap'>{fromLabel1}</div>
                                        {/* </div> */}
                                    {/* </div> */}

                                    <div className='address-item-col2'>
                                        <svg width="8" height="14" viewBox="0 0 8 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path fill-rule="evenodd" clip-rule="evenodd" d="M4 0C4.26522 5.96046e-08 4.51957 0.105357 4.70711 0.292893L7.70711 3.29289C8.09763 3.68342 8.09763 4.31658 7.70711 4.70711C7.31658 5.09763 6.68342 5.09763 6.29289 4.70711L4 2.41421L1.70711 4.70711C1.31658 5.09763 0.683417 5.09763 0.292893 4.70711C-0.0976311 4.31658 -0.097631 3.68342 0.292893 3.29289L3.29289 0.292893C3.48043 0.105357 3.73478 0 4 0ZM0.292893 9.29289C0.683417 8.90237 1.31658 8.90237 1.70711 9.29289L4 11.5858L6.29289 9.29289C6.68342 8.90237 7.31658 8.90237 7.70711 9.29289C8.09763 9.68342 8.09763 10.3166 7.70711 10.7071L4.70711 13.7071C4.31658 14.0976 3.68342 14.0976 3.29289 13.7071L0.292893 10.7071C-0.0976311 10.3166 -0.0976311 9.68342 0.292893 9.29289Z" fill="white"/>
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
                                <div className='send-address'>
                                    <input className='address-to-input' type='text' placeholder='Search, public address (0x) or ENS' onChange={handleChangeAddressTo} value={addressTo}/>:                                    
                                    <div className='address-item-col2'>
                                        <div onClick={()=>setShowQrScanner(true)}>{svg_address_to}</div>
                                        {/* <svg onClick={handleClickCross} xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="white" className="bi bi-x" viewBox="0 0 16 16">
                                            <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
                                        </svg> */}
                                    </div>
                                </div>

                                {/* QUANTITY */}
                                <div className='send-address'>
                                    <input className='address-to-input-2' type='number' placeholder='0 USDT' onChange={handleChangeQuantity} value={quantity}/>
                                        
                                    <div className='address-item-col2'>
                                        <div style={{color: 'var(--text-mini)'}}
                                            onClick={() => {fromLabel1 === 'USDT TRC20' ? setQuantity(balance_trx): setQuantity(balance)}}
                                        >
                                            Max
                                        </div>
                                    </div>
                                    
                                </div>

                                <div className='container-balance'>
                                    <div className='your-balance-text'>
                                        Ваш баланс
                                    </div>
                                    <div className='your-balance-q'>
                                        {fromLabel1 === 'USDT TRC20' ? balance_trx: balance} USDT
                                    </div>
                                </div>

                            </div>
                        </>
                    )
                }
                {stepSend === 'confirm' && (
                    <div className='color-bg-cntr h-162 pt-15 mt-20'>
                        <div className='row-2 p-17 h-29'>
                            <div className='send-text-1'>Актив</div>
                            <div className='send-text-2'>{quantity} USDT</div>
                        </div>

                        {divider}

                        <div className='row-2 p-17 h-29'>
                            <div className='send-text-1'>Получатель</div>
                            <div className='send-text-2'>{addressTo} USDT</div>
                        </div>

                        {divider}

                        <div className='row-2 p-17 h-29'>
                            <div className='send-text-1'>Сетевой сбор</div>
                            <div className='send-text-2'>50 TRX</div>
                        </div>

                        {divider}

                        <div className='row-2 p-17 h-29 mt-6'>
                            <div className='send-text-1'>Итого</div>
                            <div className='send-text-2'>${quantity + 50}</div>
                        </div>
                    </div>
                    // <>
                        
                    //     <div>
                    //         <label style={{color: 'white', fontSize: 34, marginTop: 30}}>{`${quantity} USDT`}</label>
                    //         <br></br>
                    //         <label style={{color: 'var(--btn-bg-color)'}}>{`${quantity} $`}</label>
                    //     </div>

                    //     <div className='confirm-data mt-5 mb-5 py-1'>
                    //         <div className='row m-2 py-2 d-flex justify-content-between'>
                    //             <div className='col-5 txt-l'>
                    //                 Актив
                    //             </div>
                    //             <div className='col-5 txt-r'>
                    //                 {fromLabel1}
                    //             </div>
                    //         </div>

                    //         {divider}

                    //         <div className='row m-2 py-2 d-flex justify-content-between'>
                    //             <div className='col-5 txt-l'>
                    //                 Получатель
                    //             </div>
                    //             <div className='col-5 txt-r'>
                    //                 {addressTo}
                    //             </div>
                    //         </div>

                    //         {divider}

                    //         <div className='row m-2 py-2 d-flex justify-content-between'>
                    //             <div className='col-5 txt-l'>
                    //                 Сетевой сбор
                    //             </div>
                    //             <div className='col-5 txt-r'>
                    //                 50 TRX
                    //             </div>
                    //         </div>

                    //         {divider}

                    //         <div className='row m-2 py-2 d-flex justify-content-between'>
                    //             <div className='col-5 txt-l-w'>
                    //                 Макс Тотал
                    //             </div>
                    //             <div className='col-5 txt-r-w'>
                    //                 {`$ ${quantity}`}
                    //             </div>
                    //         </div>
                    //     </div>
                    // </>
                )}

                {(stepSend === 'wait' || stepSend === 'finish') && (
                    <>
                        <div className='color-bg-cntr h-cntr-deal pt-17 mt-20'>
                            {stepSend === 'wait' ? svg_gear: svg_ok}
                            <div className='wait-text'>
                                Транзакция выполняется
                            </div>
                            <div className='wait-text-1 mt-10'>
                                Ожидаем кода подтверждения
                            </div>
                        </div>

                        <div className='color-bg-cntr h-198 pt-15 mt-20'>
                            <div className='row-2 p-17 h-29'>
                                <div className='send-text-1'>Дата операции</div>
                                <div className='send-text-2'>{date.toLocaleDateString()}</div>
                            </div>

                            {divider}

                            <div className='row-2 p-17 h-29'>
                                <div className='send-text-1'>Актив</div>
                                <div className='send-text-2'>{quantity} USDT</div>
                            </div>

                            {divider}

                            <div className='row-2 p-17 h-29'>
                                <div className='send-text-1'>Получатель</div>
                                <div className='send-text-2'>{addressTo} USDT</div>
                            </div>

                            {divider}

                            <div className='row-2 p-17 h-29'>
                                <div className='send-text-1'>Сетевой сбор</div>
                                <div className='send-text-2'>50 TRX</div>
                            </div>

                            {divider}

                            <div className='row-2 p-17 h-29 mt-6'>
                                <div className='send-text-1'>Итого</div>
                                <div className='send-text-2'>${quantity + 50}</div>
                            </div>
                        </div>

                        {/* <div className='confirm-data mt-5 mb-5'>
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
                        </div> */}
                    </>
                )}


                {/* {!showLoader &&  */}
                    {/* <div className='mx-2'>
                        <ButtonNext onClick={handleClickSend} 
                            style={(stepSend === 'wait' || stepSend === 'finish') ? 'grey': 'green'}
                            text={
                                stepSend === 'address' ? 'Далее': 
                                stepSend === 'confirm' ? 'Отправить':
                                'TRONSCAN'
                            }
                        />
                    </div> */}
                {/* } */}

                {/* {showLoader && <div className="loader"></div>} */}
                <div onClick={handleClickSend} className={`button-send-box ${isReady && stepSend !== 'wait' ? 'button-active-send-bg active-text': 'button-send-bg disable-text'}  mt-20`}>
                    {
                        stepSend === 'confirm' ? 'Подтвердить':
                        stepSend === 'wait' ? 'TRONSCAN':
                        isReady ? 'Отправить': 'Заполните данные'
                    } 
                </div>
            </div>
        </div>
      );
}

