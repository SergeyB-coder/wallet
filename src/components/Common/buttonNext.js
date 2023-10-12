import React from 'react';
import { dictionary } from '../../const/dictionary';
import { useTelegram } from '../../hooks/useTelegram';

export function ButtonNext (props) {
    const { language_code } = useTelegram()
    const further = language_code === 'ru' ? dictionary.further.ru: dictionary.further.en

    const onClick = props.onClick
    const text = props.text || further
    const color = props.style
    return (
        <>
            <div className={color === 'grey' ? 'button-next-grey': 'button-next'} onClick={onClick}>
                {text}
            </div>
        </>
      );
}

