import React, { useEffect, useState } from 'react';
import './style.css'

// import QRCode from 'qrcode'
import EthereumQRPlugin from 'ethereum-qr-code';
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
    
    //   useEffect(() => {
    //     QRCode.toCanvas('0x0ce47b5b9117d09e72511e5feef84f917edad4cb', { errorCorrectionLevel: 'H' }, function (err, canvas) {
    //         if (err) throw err
          
    //         var container = document.getElementById('q')
    //         container.appendChild(canvas)
    //       })
    //   }, []);
    const qr = new EthereumQRPlugin()

    const backScreen = () => {
        navigate('/home', {replace: true})
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

    useEffect(() => {
        var e = document.getElementById("q");
        var child = e.firstElementChild;
        if (child) e.removeChild(child);
        qr.toCanvas(
            {
                to: address,
                gas: 21000,
            }, {
                selector: '#q',
            }
        )
    }, );

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
            <div className='address-container'>
                <div>
                    
                    <div style={{position: 'relative'}}>
                        <div className='row address-item mt-2 mx-2 w-60' onClick={handleClickSelectAddress}>
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
                                <div className='row address-item-2 mt-2 left-1 w-60' onClick={handleClickAddresItem}>

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
                    </div>
                    

                    <div className='mt-4' id='q'>
                    </div>

                    <div className='address-text'>
                        {fromLabel1 !== 'USDT TRC20' ? address: address_trx}
                    </div>

                    <div className='label-address mt-4'>
                        Адрес вашего кошелька
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
                    

                    <button className='address-copy-button' onClick={() => {
                            const copy_address = fromLabel1 !== 'USDT TRC20' ? address: address_trx
                            navigator.clipboard.writeText(copy_address)
                            setShowMessage(true)
                            setTimeout(() => {setShowMessage(false)}, 1000)
                        }}
                    >
                        Копировать адрес
                    </button>

                    {showMessage && <div className='address-text'>Адрес скопирован!</div>}
                </div>
            </div>
            
        </>
      );
}