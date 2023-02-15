import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useTelegram } from '../../hooks/useTelegram';
import { selectAddress, selectAddressTRX } from '../Home/homeSlice';
import { ButtonNext } from '../Ptp/buttonNext';
import { sendTo } from './sendApi';

import './style.css'

export function Send (props) {
    const {user_id} = useTelegram()
    const navigate = useNavigate()
    const address = useSelector(selectAddress)
    const address_trx = useSelector(selectAddressTRX)

    // const [showInputAddressTo, setShowInputAddressTo] = useState(false)
    const [showLoader, setShowLoader] = useState(false)

    const [address1, setAddress1] = useState(address)
    const [address2, setAddress2] = useState(address_trx)

    const [addressTo, setAddressTo] = useState('')
    const [quantity, setQuantity] = useState(0)
    
    const [showListAddresses, setShowListAddresses] = useState(false)

    const handleClickSelectAddress = () => {
        setShowListAddresses(!showListAddresses)
    }

    const handleChangeQuantity = (e) => {
        console.log(e.target.value)
        let inp = document.getElementById('q-send')
        inp.style.width = (30 + (e.target.value.toString().length + 1) * 15) + 'px'
        setQuantity(e.target.value)
    }

    const handleClickAddresItem = () => {
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
        let net = ''
        if (address1 === address) net = 'b'
        else if (address1 === address_trx) net = 't'
        console.log(typeof(quantity), quantity, address1)
        if (!valid()  || net === '') {
            alert('Проверьте данные')
            return
        }
        else {
            setShowLoader(true)
            sendTo({
                net: net,
                user_id: user_id,
                address_from: address1,
                address_to: addressTo,
                quantity: quantity
            }, (data) => {
                // console.log('sendTo', data)
                setShowLoader(false)
                navigate('/home', {replace: true})
            })
        }
    }

    // const handleClickCross = () => {
    //     setShowInputAddressTo(true)
    // }

    
    useEffect(() => {
        const inp = document.getElementById('q-send')
        
        inp.style.width = '40px'
        inp.focus()
    }, []);

    return (
        <div className='send-container'>
            <div className='title-send'>
                Send
            </div>

            <div className='row d-flex align-items-center justify-content-center'>
                <input id='q-send' className='send-q-input' type='number'  onChange={handleChangeQuantity} value={quantity}/>
                <span style={{color: 'white', width: 'fit-content', height: 'fit-content'}}>USDT</span>
            </div>

            <div className='row address-item mt-5'>

                <div className='address-item-col1'>
                    <div className='title-from mb-2'>From</div>
                    <div className='row p-0 m-0'>
                        <div className='address-circle'></div>
                        <div className='address-text text-nowrap'>{`${address1.slice(0, 5)} ... ${address1.slice(-5)}`}</div>
                    </div>
                </div>

                <div className='address-item-col2'>
                    <svg onClick={handleClickSelectAddress} xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="white" class="bi bi-chevron-compact-down" viewBox="0 0 16 16">
                        <path fill-rule="evenodd" d="M1.553 6.776a.5.5 0 0 1 .67-.223L8 9.44l5.776-2.888a.5.5 0 1 1 .448.894l-6 3a.5.5 0 0 1-.448 0l-6-3a.5.5 0 0 1-.223-.67z"/>
                    </svg>
                </div>

            </div>

            {
                showListAddresses ? (
                    <div className='row address-item mt-2' onClick={handleClickAddresItem}>

                        <div className='address-item-col1'>
                            <div className='row p-0 m-0'>
                                <div className='address-circle'></div>
                                <div className='address-text text-nowrap'>{`${address2.slice(0, 5)} ... ${address2.slice(-5)}`}</div>
                            </div>
                        </div>

                        <div className='address-item-col2'>
                            {/* <svg onClick={handleClickSelectAddress} xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="white" class="bi bi-chevron-compact-down" viewBox="0 0 16 16">
                                <path fill-rule="evenodd" d="M1.553 6.776a.5.5 0 0 1 .67-.223L8 9.44l5.776-2.888a.5.5 0 1 1 .448.894l-6 3a.5.5 0 0 1-.448 0l-6-3a.5.5 0 0 1-.223-.67z"/>
                            </svg> */}
                        </div>

                    </div>
                ): null
            }

            {/* TO */}
            <div className='row address-item mt-5 mb-5'>

                <div className='address-item-col1'>
                    <div className='title-from mb-2'>To</div>
                    <div className='row p-0 m-0'>
                        <div className='address-circle'></div>
                        {/* {
                            showInputAddressTo ? */}
                            <input className='address-to-input' type='text' onChange={handleChangeAddressTo} value={addressTo}/>:
                            {/* <div className='address-text text-nowrap'>{`${addressTo.slice(0, 5)} ... ${addressTo.slice(-5)}`}</div>
                        } */}
                    </div>
                </div>

                <div className='address-item-col2'>
                    {/* <svg onClick={handleClickCross} xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="white" class="bi bi-x" viewBox="0 0 16 16">
                        <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
                    </svg> */}
                </div>

            </div>

            {!showLoader && <ButtonNext onClick={handleClickSend} text='Отправить'/>}
            {showLoader && <div class="loader"></div>}

        </div>
      );
}

