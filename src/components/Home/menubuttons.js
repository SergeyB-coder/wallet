import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
// import { svg_ptp_ico, svg_receive, svg_send } from '../../const/svgs';
import { useTelegram } from '../../hooks/useTelegram';
import { Button } from './button';
// import { Button } from './button';
import { getWallet, getWalletTRX } from './homeApi';
import { selectAddress, selectAddressTRX, setAddress, setAddressTRX } from './homeSlice';
import './style.css'

export function MenuButtons() {
    // const user_id = '652065848'
    // const user_id = '222'
    const { user_id } = useTelegram()
    const dispatch = useDispatch()
    const address = useSelector(selectAddress)
    const address_trx = useSelector(selectAddressTRX)
    const navigate = useNavigate()

    const handleClickP2P = () => {
        navigate('/ptp', {replace: true})
    }

    const handleClickSend = () => {
        navigate('/send', {replace: true})
    }
    
    // const handleClickMarket = () => {
    //     navigate('/market', {replace: true})
    // }

    const handleClickAddress = () => {
        if (!address) {
            getWallet({user_id: user_id}, (data) => {
                dispatch(setAddress(data.address))
            })
        }

        if (!address_trx) {
            getWalletTRX({user_id: user_id}, (data) => {
                dispatch(setAddressTRX(data.address_trx))
            })
        }
        
        navigate('/address', {replace: true})
        
    }
    return (
        <>
            <div className='d-flex justify-content-center'>
                <div className='row container-buttons m-0 p-0'>
                    <Button 
                        text={'Получить'} 
                        d_svg={'M8 1a.5.5 0 0 1 .5.5v11.793l3.146-3.147a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 .708-.708L7.5 13.293V1.5A.5.5 0 0 1 8 1z'}
                        fill_svg={"var(--btn-bg-color)"}
                        onClick={handleClickAddress}
                        type={'recieve'}
                        // style={{ marginLeft: 20}}
                    />

                    {/* <div className='button-svg'>
                        <div  onClick={handleClickAddress}>
                            {svg_send}
                            <div style={{color: 'white', marginTop: 5}}>Получить</div>
                        </div>                        
                    </div>

                    <div className='button-svg'>
                        <div onClick={handleClickP2P}>
                            {svg_ptp_ico}
                            <div style={{color: 'white', marginTop: 5}}>P2P</div>
                        </div>
                    </div>

                    <div className='button-svg'>
                        <div onClick={handleClickSend}>
                            {svg_receive}
                            <div style={{color: 'white', marginTop: 5}}>Отправить</div>
                        </div>
                    </div> */}
                    
                        
                    <Button 
                        text={'P2P Маркет'} 
                        d_svg={'M11.5 15a.5.5 0 0 0 .5-.5V2.707l3.146 3.147a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 1 0 .708.708L11 2.707V14.5a.5.5 0 0 0 .5.5zm-7-14a.5.5 0 0 1 .5.5v11.793l3.146-3.147a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 .708-.708L4 13.293V1.5a.5.5 0 0 1 .5-.5z'}
                        fill_svg={"var(--btn-bg-color)"}
                        onClick={handleClickP2P}
                        type={'ptp'}
                    />
                    <Button 
                        text={'Отправить'} 
                        d_svg={'M8 15a.5.5 0 0 0 .5-.5V2.707l3.146 3.147a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 1 0 .708.708L7.5 2.707V14.5a.5.5 0 0 0 .5.5z'}
                        fill_svg={"var(--btn-bg-color)"}
                        onClick={handleClickSend}
                        type={'send'}
                        // style={{ marginRight: 20}}
                    />
                </div>
            </div>
        </>
    );
}

