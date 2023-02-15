import React from 'react';

export function ButtonNext (props) {
    const onClick = props.onClick
    const text = props.text || 'Далее'
    const color = props.style
    return (
        <>
            <div className={color === 'grey' ? 'button-next-grey': 'button-next'} onClick={onClick}>
                {text}
            </div>
        </>
      );
}

