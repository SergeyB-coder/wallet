import React, { useEffect } from 'react';
import './style.css'

// import QRCode from 'qrcode'
import EthereumQRPlugin from 'ethereum-qr-code';
import { useSelector } from 'react-redux';
import { selectAddress } from '../Home/homeSlice';
import { useTelegram } from '../../hooks/useTelegram';
import { useNavigate } from 'react-router-dom';

// With promises


export function Address (props) {
    const {tg} = useTelegram()
    const navigate = useNavigate()
    const address = useSelector(selectAddress)
    
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
                        {address}
                    </div>

                    <div className='label-address mt-4'>
                        Адрес вашего кошелька
                    </div>

                    <button className='address-copy-button' onClick={() => {navigator.clipboard.writeText(address)}}>Копировать адрес</button>
                </div>
                
            </div>
            
        </>
      );
}