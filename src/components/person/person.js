import React from 'react';
import { useTelegram } from '../../hooks/useTelegram';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export function Person (props) {
    const { first_name } = useTelegram()
    const navigate = useNavigate()

    const [allOrderActive, setAllOrderActive] = useState(true);

    const handleClickCreateOrder = () => {
        navigate('/createorder', {replace: true})
    }

    const handleClickSettingsPay = () => {
        navigate('/settingspay', {replace: true})
    }

    return (
        <div className='container-center'>
            <div className='w-cntr'>
                <div className='container-title mt-20'>
                    <div className='title-text'>Личный кабинет</div>
                </div>

                <div className='h-cntr-person color-bg-cntr-person pt-26 mt-20'>
                    <div className='name-text'>{first_name}</div>

                    <div className='container-center'>
                        <div className='mini-text w-227'>
                            Это имя будет Вашим ID для всех операций на P2P Маркете.
                        </div>
                    </div>
                </div>

                <div className='row-2 mt-10'>
                    <div className='cntr-2 color-bg-cntr-person'>
                        <div className='num-text'>
                            6
                        </div>
                        <div className='mini-text'>
                            Количество сделок
                        </div>
                    </div>
                    <div className='cntr-2 color-bg-cntr-person'>
                        <div className='num-text'>
                            84%
                        </div>
                        <div className='mini-text'>
                            Завершенные сделки
                        </div>
                    </div>
                </div>

                <div className='h-118 color-bg-cntr-person pt-9 mt-10'>

                    <div className='row-2 p-17 a-c h-47' onClick={handleClickSettingsPay}>
                        <div className='item-text'>
                            Настройка оплаты
                        </div>
                        <div>
                            <svg width="5" height="9" viewBox="0 0 5 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M5 4.5C5 4.76522 4.89464 5.01957 4.70711 5.20711L1.70711 8.20711C1.31658 8.59763 0.683416 8.59763 0.292892 8.20711C-0.0976318 7.81658 -0.0976317 7.18342 0.292893 6.79289L2.58579 4.5L0.292893 2.20711C-0.097631 1.81658 -0.0976315 1.18342 0.292893 0.792893C0.683417 0.402369 1.31658 0.402369 1.70711 0.792893L4.70711 3.79289C4.89464 3.98043 5 4.23478 5 4.5Z" fill="white"/>
                            </svg>
                        </div>
                    </div>

                    <div className='container-center'>
                        <div className='line'></div>
                    </div>

                    <div className='row-2 p-17 a-c h-47'>
                        <div className='item-text'>
                            Активность всех объявлений
                        </div>
                        {/* <div>
                            <div className={1 ? 'method-switch': 'method-switch-off'}
                                onClick={() => {}}
                            >
                                <div className={1 ? 'method-switch-circle':'method-switch-off-circle'}></div>
                            </div>
                        </div> */}

                        <div className=''>
                            <div className={allOrderActive ? 'method-switch anim-switch': 'method-switch-off anim-switch-off'}
                                onClick={() => {setAllOrderActive(!allOrderActive)}}
                            >
                                <div className={allOrderActive ? 'method-switch-circle anim-circle':'method-switch-off-circle anim-circle-b'}></div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='container-title mt-20'>
                    <div className='title-text'>Ваши объявления</div>
                </div>

                <div className='container-center mt-20'>
                    <div className='btn-add-method-pay'>
                        <div className='svg-add-method'>
                            <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M15 30C23.2843 30 30 23.2843 30 15C30 6.71573 23.2843 0 15 0C6.71573 0 0 6.71573 0 15C0 23.2843 6.71573 30 15 30ZM22 17.9251V13.0749H17.2752V8H11.7248V13.0749H7V17.9251H11.7248V23H17.2752V17.9251H22Z" fill="#86EFAC"/>
                            </svg>
                        </div>
                        <div className='btn-add-method-text' onClick={handleClickCreateOrder}>
                            Создать объявление
                        </div>
                    </div>
                </div>
            </div>
        </div>
      );
}

