import React from 'react';
// import { useEffect } from 'react';

export function Transactions () {

    

    return (
        <div className='container-center'>
            <div className='w-cntr'>
                <div className='container-title mt-20'>
                    <div className='title-text'>История транзакций</div>
                </div>

                <div key={0} className='row-2 color-bg-deal h-77 p-17 mt-20'>
                    <div className=''>
                        <div className='deal-text mt-21'>01 апреля 2023, 12:20</div>
                        <div className='deal-text-2'>Отправлено</div>
                    </div>
                    <div className=''>
                        <div className='text-deal-quantity'>{12} USDT</div>
                        <div className='deal-text-3 text-nowrap'>$45.3</div>
                    </div>
                </div>

                <div key={1} className='row-2 color-bg-deal h-77 mt-13 p-17' >
                    <div className=''>
                        <div className='deal-text mt-21'>01 апреля 2023, 12:20</div>
                        <div className='deal-text-2'>Отправлено</div>
                    </div>
                    <div className=''>
                        <div className='text-deal-quantity'>{12} USDT</div>
                        <div className='deal-text-3 text-nowrap'>$45.3</div>
                    </div>
                </div>

                <div key={2} className='row-2 color-bg-deal h-77 mt-13 p-17' >
                    <div className=''>
                        <div className='deal-text mt-21'>01 апреля 2023, 12:20</div>
                        <div className='deal-text-2'>Отправлено</div>
                    </div>
                    <div className=''>
                        <div className='text-deal-quantity'>{12} USDT</div>
                        <div className='deal-text-3 text-nowrap'>$45.3</div>
                    </div>
                </div>
            </div>
            

        </div>
      );
}

