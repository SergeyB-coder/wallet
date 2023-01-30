import React from 'react';

export function ButtonNext (props) {
    const onClick = props.onClick
    const text = props.text || 'Далее'
    return (
        <>
            <div className='button-next' onClick={onClick}>
                {text}
            </div>
        </>
      );
}

