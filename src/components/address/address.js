import React, { useEffect, useState } from 'react';
import './style.css'

import QRCode from 'qrcode'
import { useSelector } from 'react-redux';
import { selectAddress, selectAddressBTC, selectAddressTRX } from '../Home/homeSlice';
import { useTelegram } from '../../hooks/useTelegram';
import { useNavigate } from 'react-router-dom';
import { ListAddreses } from './listAddresses';


import { list_svg_logos, list_token_names } from "../../const/devdata";


export function Address (props) {
    const {tg} = useTelegram()
    const navigate = useNavigate()
    const address = useSelector(selectAddress)
    const address_trx = useSelector(selectAddressTRX)
    const address_btc = useSelector(selectAddressBTC)
    const [showListAddresses, setShowListAddresses] = useState(false)
    const [selectedTokenIndex, setSelectedTokenIndex] = useState(0);
    const [fromLabel1] = useState('USDT BEP20')

    const [showMessage, setShowMessage] = useState(false)
    
      
    // const qr = new EthereumQRPlugin()

    const backScreen = () => {
        navigate('/', {replace: true})
        // navigate('/home', {replace: true})
    }

    

    

    const handleClickSelectAddress = () => {
        setShowListAddresses(!showListAddresses)
    }

    

    useEffect(() => {
        if (address_trx !== '' && address !== '' && address_btc !== '') {
            QRCode.toCanvas(
                selectedTokenIndex === 0 ? address: 
                selectedTokenIndex === 1 ? address_trx: address_btc, 
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
        
      }, [address, address_btc, address_trx, fromLabel1, selectedTokenIndex]);

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
                                    <div className='svg-circle'>{list_svg_logos[selectedTokenIndex]}</div>
                                    <div className='send-text text-nowrap'>{list_token_names[selectedTokenIndex]}</div>
                                </div>
                                <svg width="8" height="14" viewBox="0 0 8 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path fill-rule="evenodd" clip-rule="evenodd" d="M4 0C4.26522 5.96046e-08 4.51957 0.105357 4.70711 0.292893L7.70711 3.29289C8.09763 3.68342 8.09763 4.31658 7.70711 4.70711C7.31658 5.09763 6.68342 5.09763 6.29289 4.70711L4 2.41421L1.70711 4.70711C1.31658 5.09763 0.683417 5.09763 0.292893 4.70711C-0.0976311 4.31658 -0.097631 3.68342 0.292893 3.29289L3.29289 0.292893C3.48043 0.105357 3.73478 0 4 0ZM0.292893 9.29289C0.683417 8.90237 1.31658 8.90237 1.70711 9.29289L4 11.5858L6.29289 9.29289C6.68342 8.90237 7.31658 8.90237 7.70711 9.29289C8.09763 9.68342 8.09763 10.3166 7.70711 10.7071L4.70711 13.7071C4.31658 14.0976 3.68342 14.0976 3.29289 13.7071L0.292893 10.7071C-0.0976311 10.3166 -0.0976311 9.68342 0.292893 9.29289Z" fill="white"/>
                                </svg>
                        </div>
                        {
                            showListAddresses ? (
                                <ListAddreses setShowListAddresses={setShowListAddresses} selectedTokenIndex={selectedTokenIndex} setSelectedTokenIndex={setSelectedTokenIndex}/>
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
                            window.navigator.vibrate(200)
                            setShowMessage(true)
                            setTimeout(() => {setShowMessage(false)}, 1000)
                        }}
                    >
                        {selectedTokenIndex === 0 ? address: selectedTokenIndex === 1 ? address_trx.trim(): address_btc}
                    </div>

                    <div className='message-address'>
                        Отправляйте только Tether ({fromLabel1 !== 'USDT TRC20' ? 'BEP20':'TRC20'}) на этот адрес.
                        Отправка любых других монет может привести к их безвозвратной потере.
                    </div>

                    

                    <div className='button-address-container'>

                        {showMessage && <div className='address-copy-message'>Адрес скопирован!</div>}

                        <div className='address-copy-button'
                            onClick={() => {
                                const copy_address = selectedTokenIndex === 0 ? address: selectedTokenIndex === 1 ? address_trx: address_btc
                                navigator.clipboard.writeText(copy_address)
                                const canVibrate = window.navigator.vibrate
                                if (canVibrate) window.navigator.vibrate(200)
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