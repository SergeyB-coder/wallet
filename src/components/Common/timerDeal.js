import React from 'react';

export function Timer (props) {
    const time = Math.round(props.time)

    

    return (
        <>
            <div style={{color: 'white'}}>
                {parseInt(time/60)}:{time % 60 < 10 && 0} {time % 60}
            </div>
        </>
      );
}

