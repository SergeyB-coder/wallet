import React, { useEffect } from 'react';

import { useTelegram } from '../../hooks/useTelegram';

export function CreateOrder1() {
    const {tg} = useTelegram()

    useEffect(() => {
        tg.BackButton.show()
    }, );

    return (
        <div className='p-4'>
            <div className='row'>
                <div className='col-9'>Объявление на продажу</div>
                <div className='col-2'>1/4</div>
            </div>
        </div>
    );
}
