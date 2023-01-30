import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ButtonNext } from './buttonNext';


export function CreateOrder5(props) {
    const navigate = useNavigate()
    const setScreen = props.setScreen
    const handleOpenMarket = () => {
        setScreen('createorder4')
        navigate('/market', {replace: true})
    }
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
