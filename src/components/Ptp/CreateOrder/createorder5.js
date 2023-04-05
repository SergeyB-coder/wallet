import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTelegram } from '../../../hooks/useTelegram';
// import { ButtonNext } from '../../Common/buttonNext';
import { svg_salute } from '../../../const/svgs';


export function CreateOrder5(props) {
    const {tg} = useTelegram()
    const navigate = useNavigate()
    const setScreen = props.setScreen
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
                <div className='title-text'>Объявление размещено</div>
                <div className='page-number'>5/5</div>
            </div>
            <div className='container-finish-order mt-20'>
                <div className=''>
                    {svg_salute}
                </div>
                <div className='d-flex justify-content-center'>
                    <div className='salute-text1'>
                        Объявление успешно размещено
                    </div>
                </div>
                
            </div>
            
            
            {/* <ButtonNext onClick={handleOpenMarket} text='Открыть маркет'/> */}

            <div onClick={handleOpenMarket} className='button-send-box button-active-send-bg active-text mt-20'>
                Перейти в маркет
            </div>
        </div>
    );
}
