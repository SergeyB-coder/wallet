import React, { useEffect, useState } from 'react';
import './style.css'

// import QRCode from 'qrcode'
import EthereumQRPlugin from 'ethereum-qr-code';
import { useSelector } from 'react-redux';
import { selectAddress, selectAddressTRX } from '../Home/homeSlice';
import { useTelegram } from '../../hooks/useTelegram';
import { useNavigate } from 'react-router-dom';

// With promises


export function Address (props) {
    const CURRENCY_LIST = [
        'USDT BEP20',
        'USDT TRC20'
    ]
    const {tg} = useTelegram()
    const navigate = useNavigate()
    const address = useSelector(selectAddress)
    const address_trx = useSelector(selectAddressTRX)
    const [currencyBalance, setCurrencyBalance] = useState(CURRENCY_LIST[0])
    const [showListCurrency, setShowListCurrency] = useState(false)
    
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

    

    const handleClickCurrencyBalance = () => {
        setShowListCurrency(!showListCurrency)
    }

    function handleClickCurrencyItem(index) {
        console.log(index)
        setCurrencyBalance(CURRENCY_LIST[index])
        setShowListCurrency(false)
    }

    useEffect(() => {
        var e = document.getElementById("q");
        var child = e.firstElementChild;
        if (child) e.removeChild(child);
        qr.toCanvas({
            to: address,
            gas: 21000,
          }, {
            selector: '#q',
          })
    }, );

    useEffect(() => {
        tg.MainButton.hide()
        tg.BackButton.show()
    }, );

    useEffect(() => {
        tg.onEvent('backButtonClicked', backScreen)
            return () => {tg.offEvent('backButtonClicked', backScreen)}
        }, )

    return (
        <>
            <div className='address-container'>
                <div>
                    <div className='' id='q'>
                    </div>

                    <div className='address-text'>
                        {CURRENCY_LIST.indexOf(currencyBalance) === 0 ? address: address_trx}
                    </div>

                    <div className='label-address mt-4'>
                        Адрес вашего кошелька
                    </div>

                    <div style={{position: 'relative'}}>
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
                    </div>
                    

                    <button className='address-copy-button' onClick={() => {navigator.clipboard.writeText(address)}}>Копировать адрес</button>
                </div>
                
            </div>
            
        </>
      );
}