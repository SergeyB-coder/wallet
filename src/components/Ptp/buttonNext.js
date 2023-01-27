import React from 'react';

export function ButtonNext (props) {
    const onClick = props.onClick
    return (
        <>
            <div className='button-next' onClick={onClick}>
                Далее
            </div>
        </>
      );
}

