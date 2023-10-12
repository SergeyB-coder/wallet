import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTelegram } from '../../../hooks/useTelegram';
// import { ButtonNext } from '../../Common/buttonNext';
// import { svg_salute } from '../../../const/svgs';

import salute_gif from '../../../static/animations/salute.gif'
import { dictionary } from '../../../const/dictionary';

export function CreateOrder5(props) {
    const {tg, language_code} = useTelegram()
    const navigate = useNavigate()
    const setScreen = props.setScreen

    const advertisement_placed = language_code === 'ru' ? dictionary.advertisement_placed.ru: dictionary.advertisement_placed.en
    const to_market = language_code === 'ru' ? dictionary.to_market.ru: dictionary.to_market.en
    

    const handleOpenMarket = () => {
        setScreen('createorder4')
        navigate('/market', {replace: true})
    }

    useEffect(() => {
        tg.MainButton.hide()
    }, );

    return (
        <div className='container-create-order mt-20'>
            <div className='container-title'>
                <div className='title-text'>{advertisement_placed}</div>
                <div className='page-number'>5/5</div>
            </div>
            <div className='container-finish-order mt-20'>
                <div className=''>
                    {/* {svg_salute} */}
                    <img style={{width: '131.4px', height: '132px'}} src={salute_gif} alt=''/>
                </div>
                
                <div className='d-flex justify-content-center'>
                    <div className='salute-text1'>
                        {advertisement_placed}
                    </div>
                </div>
                
            </div>
            
            
            

            <div onClick={handleOpenMarket} className='button-send-box button-active-send-bg active-text mt-20'>
                {to_market}
            </div>
        </div>
    );
}
