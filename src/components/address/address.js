import React, { useEffect, useState } from 'react';
import './style.css'

import QRCode from 'qrcode'
// import EthereumQRPlugin from 'ethereum-qr-code';
import { useSelector } from 'react-redux';
import { selectAddress, selectAddressTRX } from '../Home/homeSlice';
import { useTelegram } from '../../hooks/useTelegram';
import { useNavigate } from 'react-router-dom';
import { svg_bep, svg_tron } from '../../const/svgs';

// With promises


export function Address (props) {
    // const CURRENCY_LIST = [
    //     'USDT BEP20',
    //     'USDT TRC20'
    // ]
    const {tg} = useTelegram()
    const navigate = useNavigate()
    const address = useSelector(selectAddress)
    const address_trx = useSelector(selectAddressTRX)
    // const [currencyBalance, setCurrencyBalance] = useState(CURRENCY_LIST[0])
    // const [showListCurrency, setShowListCurrency] = useState(false)
    const [showListAddresses, setShowListAddresses] = useState(false)

    const [fromLabel1, setFromLabel1] = useState('USDT BEP20')
    const [fromLabel2, setFromLabel2] = useState('USDT TRC20')
    const [address1, setAddress1] = useState(address)
    const [address2, setAddress2] = useState(address_trx)

    const [showMessage, setShowMessage] = useState(false)
    
      
    // const qr = new EthereumQRPlugin()

    const backScreen = () => {
        navigate('/', {replace: true})
        // navigate('/home', {replace: true})
    }

    

    // const handleClickCurrencyBalance = () => {
    //     setShowListCurrency(!showListCurrency)
    // }

    // function handleClickCurrencyItem(index) {
    //     console.log(index)
    //     setCurrencyBalance(CURRENCY_LIST[index])
    //     setShowListCurrency(false)
    // }

    const handleClickSelectAddress = () => {
        setShowListAddresses(!showListAddresses)
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

        // var e = document.getElementById("q");
        // var child = e.firstElementChild;
        // if (child) e.removeChild(child);
        // qr.toCanvas(
        //     {
        //         to: address,
        //         gas: 21000,
        //     }, {
        //         selector: '#q',
        //     }
        // )
    }

    // useEffect(() => {
    //     var e = document.getElementById("q");
    //     var child = e.firstElementChild;
    //     if (child) e.removeChild(child);
    //     qr.toCanvas(
    //         {
    //             to: address,
    //             gas: 21000,
    //         }, {
    //             selector: '#q',
    //         }
    //     )
    // }, );

    useEffect(() => {
        if (address_trx !== '' && address !== '') {
            QRCode.toCanvas(
                fromLabel1 === 'USDT TRC20' ? address_trx: address, 
                { 
                    color: {
                        dark: '#86EFAC',  // Blue dots
                        light: '#141414' // Transparent background
                    } ,
                    width: 188
                }, 
                function (err, canvas) {
                    if (err) throw err
                
                    var container = document.getElementById('q')
                    var child = container.firstElementChild;
                    if (child) container.removeChild(child);
                    container.appendChild(canvas)
                })
        }
        
      }, [address, address_trx, fromLabel1]);

    useEffect(() => {
        tg.MainButton.hide()
        tg.BackButton.show()
    }, [tg.BackButton, tg.MainButton]);

    useEffect(() => {
        tg.onEvent('backButtonClicked', backScreen)
            return () => {tg.offEvent('backButtonClicked', backScreen)}
        }, )

    return (
        <>
            <div className='address-container mt-20'>
                <div className='widget-container'>
                    
                    <div style={{position: 'relative'}}>
                        <div className='row-2 color-bg-address h-60 a-c p-17' onClick={handleClickSelectAddress}>
                                <div className='row p-0 m-0'>
                                    {/* <div className='address-circle'></div> */}
                                    <div className='svg-circle'>{fromLabel1 === 'USDT TRC20' ? svg_tron: svg_bep}</div>
                                    <div className='send-text text-nowrap'>{fromLabel1}</div>
                                </div>
                                <svg width="8" height="14" viewBox="0 0 8 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path fill-rule="evenodd" clip-rule="evenodd" d="M4 0C4.26522 5.96046e-08 4.51957 0.105357 4.70711 0.292893L7.70711 3.29289C8.09763 3.68342 8.09763 4.31658 7.70711 4.70711C7.31658 5.09763 6.68342 5.09763 6.29289 4.70711L4 2.41421L1.70711 4.70711C1.31658 5.09763 0.683417 5.09763 0.292893 4.70711C-0.0976311 4.31658 -0.097631 3.68342 0.292893 3.29289L3.29289 0.292893C3.48043 0.105357 3.73478 0 4 0ZM0.292893 9.29289C0.683417 8.90237 1.31658 8.90237 1.70711 9.29289L4 11.5858L6.29289 9.29289C6.68342 8.90237 7.31658 8.90237 7.70711 9.29289C8.09763 9.68342 8.09763 10.3166 7.70711 10.7071L4.70711 13.7071C4.31658 14.0976 3.68342 14.0976 3.29289 13.7071L0.292893 10.7071C-0.0976311 10.3166 -0.0976311 9.68342 0.292893 9.29289Z" fill="white"/>
                                </svg>
                        </div>
                        {
                            showListAddresses ? (
                                <div className='row-2 color-bg-address h-60 a-c p-17 pos-abs w-100 color-bg-cntr' onClick={handleClickAddresItem}>

                                    
                                        <div className='row p-0 m-0'>
                                            {/* <div className='address-circle'></div> */}
                                            <div className='svg-circle'>{fromLabel2 === 'USDT TRC20' ? svg_tron: svg_bep}</div>
                                            <div className='send-text text-nowrap'>{fromLabel2}</div>
                                        </div>

                                    <div className='address-item-col2'>
                                        {/* <svg onClick={handleClickSelectAddress} xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="white" className="bi bi-chevron-compact-down" viewBox="0 0 16 16">
                                            <path fillRule="evenodd" d="M1.553 6.776a.5.5 0 0 1 .67-.223L8 9.44l5.776-2.888a.5.5 0 1 1 .448.894l-6 3a.5.5 0 0 1-.448 0l-6-3a.5.5 0 0 1-.223-.67z"/>
                                        </svg> */}
                                    </div>

                                </div>
                            ): null
                        }
                    </div>
                    

                    <div className='mt-4 qr-container' id='q'>
                    </div>

                    <div className='label-address'>
                        Адрес вашего кошелька
                    </div>

                    <div className='address-text'
                        onClick={() => {
                            const copy_address = fromLabel1 !== 'USDT TRC20' ? address: address_trx
                            navigator.clipboard.writeText(copy_address)
                            navigator.vibrate(200)
                            setShowMessage(true)
                            setTimeout(() => {setShowMessage(false)}, 1000)
                        }}
                    >
                        {fromLabel1 !== 'USDT TRC20' ? address: address_trx.trim()}
                    </div>

                    <div className='message-address'>
                        Отправляйте только Tether ({fromLabel1 !== 'USDT TRC20' ? 'BEP20':'TRC20'}) на этот адрес.
                        Отправка любых других монет может привести к их безвозвратной потере.
                    </div>

                    

                    <div className='button-address-container'>

                        {showMessage && <div className='address-copy-message'>Адрес скопирован!</div>}

                        <div className='address-copy-button'
                            onClick={() => {
                                const copy_address = fromLabel1 !== 'USDT TRC20' ? address: address_trx
                                navigator.clipboard.writeText(copy_address)
                                setShowMessage(true)
                                setTimeout(() => {setShowMessage(false)}, 1000)
                            }}
                        >
                            <label className='copy-label'>Скопировать</label>
                        </div>
                        <div className='address-share-button'>
                            <label className='share-label'>Поделиться</label>
                        </div>

                    </div>

                    {/* <div style={{position: 'relative'}}>
                        <div style={{color: 'white'}} onClick={handleClickCurrencyBalance}>{currencyBalance}</div>
                        {showListCurrency ? 
                        <div style={{position: 'absolute', width: '60vw', display: 'flex', justifyContent: 'center'}}>
                            <div>
                            {CURRENCY_LIST.map((currency, index) => {
                                return (
                                    <div onClick={()=>{handleClickCurrencyItem(index)}} key={index} style={{marginTop:3, border: '0.5px solid grey', borderRadius: 5, width: 'fit-content'}} className="select-currency">{currency}</div>
                                )
                            })}
                            </div>
                        </div>: null}
                    </div> */}
                    


                    {/* <button className='address-copy-button' onClick={() => {
                            const copy_address = fromLabel1 !== 'USDT TRC20' ? address: address_trx
                            navigator.clipboard.writeText(copy_address)
                            setShowMessage(true)
                            setTimeout(() => {setShowMessage(false)}, 1000)
                        }}
                    >
                        Копировать адрес
                    </button> */}

                    
                </div>
            </div>
            
        </>
      );
}