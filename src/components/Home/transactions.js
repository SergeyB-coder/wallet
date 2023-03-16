import React from 'react';
// import { useEffect } from 'react';

export function Transactions () {

    

    return (
        <div>
            <h5 className='balance-label'>Транзакции</h5>

            <div key={1} className='container-deal row' >
                <div className='deal-col-1'>
                    <div className='text-deal'><span className='label-deal'>From:</span> {'Den'}</div>
                    <div className='text-deal'><span className='label-deal'>To:</span> {'Srg'}</div>
                </div>
                <div className='deal-col-2'>
                    <div className='text-deal-r'><span className='label-deal'>Кол-во:</span> {12} USDT</div>
                    <div className='text-deal-r text-nowrap'><span className='label-deal'>Статус: </span> 
                        {
                            'Завершена'
                        }
                    </div>
                </div>
            </div>

            <div key={1} className='container-deal row' >
                <div className='deal-col-1'>
                    <div className='text-deal'><span className='label-deal'>From:</span> {'Den'}</div>
                    <div className='text-deal'><span className='label-deal'>To:</span> {'Srg'}</div>
                </div>
                <div className='deal-col-2'>
                    <div className='text-deal-r'><span className='label-deal'>Кол-во:</span> {12} USDT</div>
                    <div className='text-deal-r text-nowrap'><span className='label-deal'>Статус: </span> 
                        {
                            'Завершена'
                        }
                    </div>
                </div>
            </div>

            <div key={1} className='container-deal row' >
                <div className='deal-col-1'>
                    <div className='text-deal'><span className='label-deal'>From:</span> {'Den'}</div>
                    <div className='text-deal'><span className='label-deal'>To:</span> {'Srg'}</div>
                </div>
                <div className='deal-col-2'>
                    <div className='text-deal-r'><span className='label-deal'>Кол-во:  </span> {12} USDT</div>
                    <div className='text-deal-r text-nowrap'><span className='label-deal'>Статус: </span> 
                        {
                            'Завершена'
                        }
                    </div>
                </div>
            </div>

        </div>
      );
}

