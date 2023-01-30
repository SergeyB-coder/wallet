import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTelegram } from '../../hooks/useTelegram';
import { CreateOrder1 } from './createorder1';
import { CreateOrder2 } from './createorder2';
import { CreateOrder4 } from './createorder4';
import { CreateOrder5 } from './createorder5';
import { TradeMenu } from './trademenu';


export function Ptp(props) {
    const {tg} = useTelegram()
    const navigate = useNavigate()
    const [screen, setScreen] = useState('menu') 

    useEffect(() => {
        tg.MainButton.show()
        tg.MainButton.setText('Далее')
        tg.BackButton.show()
    }, );

    const nextScreen = () => {
        switch (screen) {
            case 'menu':
                setScreen('createorder1')
                break;
            
            case 'createorder1':
                setScreen('createorder2')
                break;

            case 'createorder2':
                setScreen('createorder3')
                break;

            case 'createorder3':
                setScreen('createorder4')
                break;

            case 'createorder4':
                setScreen('createorder5')
                break;

            default:
                break;
        }
    }

    const backScreen = () => {
        switch (screen) {
            case 'menu':
                navigate('/home', {replace: true})
                break;
            
            case 'createorder1':
                setScreen('menu')
                break;

            case 'createorder2':
                setScreen('createorder1')
                break;

            case 'createorder3':
                setScreen('createorder2')
                break;

            case 'createorder4':
                setScreen('createorder3')
                break;
            
            case 'createorder5':
                setScreen('createorder4')
                break;

            default:
                break;
        }
    }

    useEffect(() => {
        tg.onEvent('mainButtonClicked', nextScreen)
            return () => {tg.offEvent('mainButtonClicked', nextScreen)}
        }, )

    useEffect(() => {
        tg.onEvent('backButtonClicked', backScreen)
            return () => {tg.offEvent('backButtonClicked', backScreen)}
        }, )

    return (
        <div className={screen === 'createorder5' ? 'p-4 ptp-container': 'p-4'} >
        {/* <h3>P2P</h3> */}
        {screen === 'menu' && <TradeMenu setScreen={setScreen}/>}
        {screen === 'createorder1' && <CreateOrder1 setScreen={setScreen}/>}
        {screen === 'createorder2' && <CreateOrder2 setScreen={setScreen}/>}
        {screen === 'createorder4' && <CreateOrder4 setScreen={setScreen}/>}
        {screen === 'createorder5' && <CreateOrder5 setScreen={setScreen}/>}
        </div>
    );
}
