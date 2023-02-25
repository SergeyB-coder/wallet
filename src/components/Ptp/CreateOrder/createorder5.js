import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTelegram } from '../../../hooks/useTelegram';
import { ButtonNext } from '../../Common/buttonNext';


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
        <div className='salute-container'>
            <div className='salute-text1'>
                Объявление создано
            </div>
            <div className='salute-text2 mb-5'>
                Мы сообщим, когда на него откликнуться
            </div>
            <ButtonNext onClick={handleOpenMarket} text='Открыть маркет'/>
        </div>
    );
}
