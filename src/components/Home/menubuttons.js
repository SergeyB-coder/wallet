import React from 'react';
import { Button } from './button';
import './style.css'

export function MenuButtons() {
    return (
        <>
            <div>
                <div className='row container-buttons'>
                    <Button 
                        text={'Отправить'} 
                        d_svg={'M8 15a.5.5 0 0 0 .5-.5V2.707l3.146 3.147a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 1 0 .708.708L7.5 2.707V14.5a.5.5 0 0 0 .5.5z'}
                        fill_svg={"var(--tg-theme-button-color)"}
                    />
                    <Button 
                        text={'Получить'} 
                        d_svg={'M8 1a.5.5 0 0 1 .5.5v11.793l3.146-3.147a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 .708-.708L7.5 13.293V1.5A.5.5 0 0 1 8 1z'}
                        fill_svg={"var(--tg-theme-button-color)"}
                    />
                    <Button 
                        text={'Купить'} 
                        d_svg={'M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2Z'}
                        fill_svg={"var(--tg-theme-button-color)"}
                    />
                    <Button 
                        text={'P2P Маркет'} 
                        d_svg={'M8 15a.5.5 0 0 0 .5-.5V2.707l3.146 3.147a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 1 0 .708.708L7.5 2.707V14.5a.5.5 0 0 0 .5.5z'}
                        fill_svg={"var(--tg-theme-button-color)"}
                    />
                </div>
            </div>
        </>
    );
}

