import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { svg_address_to } from '../../const/svgs';
import { useTelegram } from '../../hooks/useTelegram';
import { selectAddress, selectAddressTRX, selectBalance, selectBalanceBTC, selectBalanceTRX, selectBalanceTRXv, selectBalanceV, selectSumOrders, setBalance, setBalanceTRX, setSumBlocks, setSumOrders } from '../Home/homeSlice';
import { balanceTransfer, sendTo } from './sendApi';

import gear_gif from '../../static/animations/gear.gif'
import success_gif from '../../static/animations/success.gif'

import './style.css'
import { QrReader } from './qrscanner';
import { getUserData, getUserSumBlocks, getUserSumOrders } from '../Home/homeApi';
import { ListAddreses } from '../address/listAddresses';
import { list_svg_logos, list_token_names } from '../../const/devdata';
import { dictionary } from '../../const/dictionary';

export function Send() {
    const dispatch = useDispatch()
    const [date, setDate] = useState(new Date())
    const { tg, user_id, first_name, chat_id, init_data, language_code } = useTelegram()
    const navigate = useNavigate()
    const address = useSelector(selectAddress)
    const address_trx = useSelector(selectAddressTRX)

    const balance = useSelector(selectBalance)
    const balance_v = useSelector(selectBalanceV)
    const balance_trx = useSelector(selectBalanceTRX)
    const balance_trx_v = useSelector(selectBalanceTRXv)

    const balance_btc = useSelector(selectBalanceBTC)

    const sum_orders = useSelector(selectSumOrders)

    const [stepSend, setStepSend] = useState('address') // address, confirm, wait, finish 
    // const [showLoader, setShowLoader] = useState(false)

    const [address1] = useState(address)

    const [fromLabel1] = useState('USDT BEP20')

    const [addressTo, setAddressTo] = useState('')
    const [quantity, setQuantity] = useState('')

    const [showListAddresses, setShowListAddresses] = useState(false)
    const [showQrScanner, setShowQrScanner] = useState(false);
    const [isReady, setIsReady] = useState(false);
    const [isValidAddress, setIsValidAddress] = useState(true);


    //labels
    const send_title = language_code === 'ru' ? dictionary.send.send.ru: dictionary.send.send.en
    const yourbalance = language_code === 'ru' ? dictionary.send.yourbalance.ru: dictionary.send.yourbalance.en
    const amount_adv = language_code === 'ru' ? dictionary.send.amount_adv.ru: dictionary.send.amount_adv.en
    const amount_send_comm = language_code === 'ru' ? dictionary.send.amount_send_comm.ru: dictionary.send.amount_send_comm.en
    const fill_details = language_code === 'ru' ? dictionary.send.fill_details.ru: dictionary.send.fill_details.en
    const invalid_address = language_code === 'ru' ? dictionary.send.invalid_address.ru: dictionary.send.invalid_address.en
    const wrong_amount = language_code === 'ru' ? dictionary.send.wrong_amount.ru: dictionary.send.wrong_amount.en
    const confirm_transfer = language_code === 'ru' ? dictionary.send.confirm_transfer.ru: dictionary.send.confirm_transfer.en
    const confirm = language_code === 'ru' ? dictionary.send.confirm_transfer.ru: dictionary.send.confirm_transfer.en
    const expectation = language_code === 'ru' ? dictionary.send.expectation.ru: dictionary.send.expectation.en
    const look_at = language_code === 'ru' ? dictionary.send.look_at.ru: dictionary.send.look_at.en
    const assets = language_code === 'ru' ? dictionary.send.assets.ru: dictionary.send.assets.en
    const recipient = language_code === 'ru' ? dictionary.send.recipient.ru: dictionary.send.recipient.en
    const network_fee = language_code === 'ru' ? dictionary.send.network_fee.ru: dictionary.send.network_fee.en
    const total = language_code === 'ru' ? dictionary.send.total.ru: dictionary.send.total.en

    const gear_anim = <img style={{ width: '131.4px', height: '132px' }} src={gear_gif} alt='' />
    const success_anim = <img style={{ width: '131.4px', height: '132px' }} src={success_gif} alt='' />

    const [hash, sethash] = useState('');

    const [selectedTokenIndex, setSelectedTokenIndex] = useState(0);

    function checkValidAddress(adderss) {
        // console.log(adderss[0] === 'T')
        if (selectedTokenIndex === 1 && adderss.length > 0) return adderss[0] === 'T'
        else if (selectedTokenIndex === 0 && adderss.length > 1) return adderss.slice(0, 2) === '0x'
        if (adderss.length === 0) return true
        return false
    }

    function checkIsReady(address_to, q) {
        if (address_to.length > 0 && q.length > 0 && q !== '0') setIsReady(true)
        else setIsReady(false)
    }

    const handleClickSelectAddress = () => {
        setShowListAddresses(!showListAddresses)
    }

    const handleChangeQuantity = (e) => {
        // // console.log(e.target.value)
        // let inp = document.getElementById('q-send')
        // inp.style.width = (30 + (e.target.value.toString().length + 1) * 15) + 'px'
        checkIsReady(addressTo, e.target.value)
        setQuantity(e.target.value)
    }

    const handleChangeAddressTo = (e) => {
        checkIsReady(e.target.value, quantity)

        setIsValidAddress(checkValidAddress(e.target.value))

        setAddressTo(e.target.value)
    }

    function commission() {
        return selectedTokenIndex === 1 ? 3 : 0.1
    }

    function getCurrentBalance() {
        console.log('getCurrentBalance', balance, balance_v, balance_trx, balance_trx_v)
        if (selectedTokenIndex === 1) return parseFloat(balance_trx + balance_trx_v)
        else return parseFloat(balance + balance_v)
    }

    function getScanner() {
        if (selectedTokenIndex === 1) return 'TRONSCAN'
        else return 'Etherscan'
    }

    function isCorrectQuantity() {
        // console.log('getCurrentBalance()', getCurrentBalance(), sum_orders, quantity)
        // return ((parseFloat(quantity || 0) + sum_orders + (selectedTokenIndex === 1 ? 3 : 0.5)) <= getCurrentBalance())
        return ((parseFloat(quantity || 0) + 0 + (selectedTokenIndex === 1 ? 3 : 0.5)) <= getCurrentBalance())
    }

    const handleClickSend = () => {
        if (stepSend === 'address') {

            if (isValidAddress && isCorrectQuantity() && isReady) {

                setStepSend('confirm')
            }
        }

        else if (stepSend === 'confirm') {

            setStepSend('wait')

            let net = ''
            if (address1 === address) net = 'b'
            else if (address1 === address_trx) net = 't'
            let address_from = ''
            setStepSend('finish')
            if (net === '' || address1 === '') {
                getUserData({ user_id: user_id, first_name: first_name, chat_id: chat_id, is_visit: false }, (data) => {
                    // console.log('get user data', data)
                    // dispatch(setAddress(data.address))
                    // dispatch(setAddressTRX(data.address_trx))
                    // dispatch(setBalance(data.balance))
                    // dispatch(setBalanceV(data.balance_v))
                    // dispatch(setBalanceTRX(data.balance_trx))
                    // dispatch(setBalanceTRXv(data.balance_trx_v))
                    // dispatch(setNameUser(data.name_user))
                    // setTimeout(() => {setIsLoadData(false)}, 400)
                    if (selectedTokenIndex === 1) {
                        net = 't'
                        address_from = data.address_trx
                    }
                    else {
                        net = 'b'
                        address_from = data.address
                    }

                    // console.log('send to', init_data)
                    sendTo({
                        net: net,
                        user_id: user_id,
                        address_from: address_from,
                        address_to: addressTo,
                        quantity: quantity,
                        init_data: init_data,
                    }, (data) => {
                        console.log('hashs', data.hash, data.hash2)
                        sethash(net === 't' ? data.hash2 : data.hash)
                        // console.log('sendTo', data)
                        // setShowLoader(false)
                        // navigate('/home', {replace: true})
                        setStepSend('finish')
                    })

                })
            }
            else {
                address_from = address1

                // console.log('send to', init_data)
                sendTo({
                    net: net,
                    user_id: user_id,
                    address_from: address_from,
                    address_to: addressTo,
                    quantity: quantity,
                    init_data: init_data,
                }, (data) => {
                    sethash(net === 't' ? data.hash2 : data.hash)
                    // console.log('sendTo', data)
                    // setShowLoader(false)
                    // navigate('/home', {replace: true})

                })

            }



        }

        else if (stepSend === 'finish' && hash) {
            if (selectedTokenIndex === 1) window.open('https://tronscan.io/#/transaction/' + hash, "_blank")
            else window.open('https://bscscan.com/tx/' + hash, "_blank")
            // navigate('/', {replace: true})
            // navigate('/home', {replace: true})
        }

    }

    // const handleClickCross = () => {
    //     setShowInputAddressTo(true)
    // }



    const backScreen = () => {
        switch (stepSend) {
            case 'address':
                if (showQrScanner) setShowQrScanner(false)
                else navigate('/', { replace: true })
                break;

            case 'confirm':
                setStepSend('address')
                break;

            default:
                break;
        }
    }

    const divider =
        <div className='container-center'>
            <div className='line-2'></div>
        </div>

    useEffect(() => {
        balanceTransfer({ user_id: user_id }, (data) => {
            getUserData({ user_id: user_id, first_name: first_name, chat_id: chat_id, is_visit: false }, (data) => {

                dispatch(setBalance(data.balance))
                dispatch(setBalanceTRX(data.balance_trx))
    
                localStorage.setItem('balance', data.balance)
                localStorage.setItem('balance_trx', data.balance_trx)
    
            })
        })
        
    }, [chat_id, dispatch, first_name, user_id]);

    useEffect(() => {
        getUserSumBlocks({ user_id: user_id, currency_id: (selectedTokenIndex === 1 ? 2 : 1) }, (data) => {
            // console.log('sum_blocks', data.sum_blocks)
            dispatch(setSumBlocks(data.sum_blocks))
        })
    }, [dispatch, user_id]);

    useEffect(() => {
        getUserSumOrders({ user_id: user_id, currency_id: (selectedTokenIndex === 1 ? 2 : 1) }, (data) => {
            console.log('sum_orders', data.sum_orders)
            dispatch(setSumOrders(data.sum_orders))
        })
    }, [dispatch, user_id]);

    useEffect(() => {
        // const inp = document.getElementById('q-send')

        // inp.style.width = '40px'
        // inp.focus()
        setDate(new Date())
    }, []);

    useEffect(() => {
        tg.onEvent('backButtonClicked', backScreen)
        return () => { tg.offEvent('backButtonClicked', backScreen) }
    })

    useEffect(() => {
        tg.BackButton.show()
    }, [tg.BackButton]);

    return (
        <div className='d-flex justify-content-center'>
            <div className='send-container'>
                <div className='container-title mt-20'>
                    <div className='title-send' onClick={backScreen}>
                        {
                            stepSend === 'address' ? send_title :
                                stepSend === 'confirm' ? confirm_transfer :
                                    stepSend === 'wait' ? 'Ожидайте статус' :
                                        'Транзакция завершена'
                        }
                    </div>

                    <div className='page-number'>
                        {
                            stepSend === 'address' ? '1/4' :
                                stepSend === 'confirm' ? '2/4' :
                                    stepSend === 'wait' ? '3/4' :
                                        '4/4'
                        }
                    </div>
                </div>

                {/* <div className='row d-flex align-items-center justify-content-center'>
                    <input id='q-send' className='send-q-input' type='number'  onChange={handleChangeQuantity} value={quantity}/>
                    <span style={{color: 'white', width: 'fit-content', height: 'fit-content'}}>USDT</span>
                </div> */}



                {stepSend === 'address' &&
                    (
                        <>
                            {showQrScanner ? <QrReader setAddressTo={setAddressTo} setShowQrScanner={setShowQrScanner} /> :
                                <div className=''>
                                    <div className='address-item p-17 position-relative' onClick={handleClickSelectAddress}>
                                        {/* <div className='address-item-col1'> */}
                                        {/* <div className='title-from mb-2'>From</div> */}
                                        {/* <div className='row p-0 m-0'> */}
                                        {/* <div className='address-circle'></div> */}
                                        <div className='svg-circle'>{list_svg_logos[selectedTokenIndex]}</div>
                                        <div className='send-text text-nowrap'>{list_token_names[selectedTokenIndex]}</div>
                                        {/* </div> */}
                                        {/* </div> */}

                                        <div className='address-item-col2'>
                                            <svg width="8" height="14" viewBox="0 0 8 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path fill-rule="evenodd" clip-rule="evenodd" d="M4 0C4.26522 5.96046e-08 4.51957 0.105357 4.70711 0.292893L7.70711 3.29289C8.09763 3.68342 8.09763 4.31658 7.70711 4.70711C7.31658 5.09763 6.68342 5.09763 6.29289 4.70711L4 2.41421L1.70711 4.70711C1.31658 5.09763 0.683417 5.09763 0.292893 4.70711C-0.0976311 4.31658 -0.097631 3.68342 0.292893 3.29289L3.29289 0.292893C3.48043 0.105357 3.73478 0 4 0ZM0.292893 9.29289C0.683417 8.90237 1.31658 8.90237 1.70711 9.29289L4 11.5858L6.29289 9.29289C6.68342 8.90237 7.31658 8.90237 7.70711 9.29289C8.09763 9.68342 8.09763 10.3166 7.70711 10.7071L4.70711 13.7071C4.31658 14.0976 3.68342 14.0976 3.29289 13.7071L0.292893 10.7071C-0.0976311 10.3166 -0.0976311 9.68342 0.292893 9.29289Z" fill="white" />
                                            </svg>
                                        </div>

                                        {
                                            showListAddresses ? (
                                                // <div className='address-item p-17 pos-abs-t-40 color-bg-cntr' onClick={handleClickAddresItem}>
                                                //     <div className='svg-circle'>{fromLabel2 === 'USDT TRC20' ? svg_tron : svg_bep}</div>
                                                //     <div className='send-text text-nowrap'>{fromLabel2}</div>


                                                //     <div className='address-item-col2'>
                                                //     </div>

                                                // </div>
                                                <div style={{position: 'absolute', bottom: '-120px', left: 0}}>
                                                    <ListAddreses setShowListAddresses={setShowListAddresses} selectedTokenIndex={selectedTokenIndex} setSelectedTokenIndex={setSelectedTokenIndex} />
                                                </div>
                                            ) : null
                                        }
                                    </div>


                                    {/* TO */}
                                    <div className='send-address'>
                                        <input className='address-to-input' type='text' placeholder='Search, public address (0x) or ENS'
                                            onChange={handleChangeAddressTo} value={addressTo}
                                        />:
                                        <div className='address-item-col2'>
                                            <div onClick={() => setShowQrScanner(true)}>{svg_address_to}</div>
                                            {/* <svg onClick={handleClickCross} xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="white" className="bi bi-x" viewBox="0 0 16 16">
                                            <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
                                        </svg> */}
                                        </div>
                                    </div>

                                    {/* QUANTITY */}
                                    <div className='send-address'>
                                        <input
                                            className={isCorrectQuantity() ? 'address-to-input-2' : 'address-to-input-2 not-valid'}
                                            type='number'
                                            placeholder='0 USDT'
                                            onChange={handleChangeQuantity}
                                            value={quantity}
                                        />

                                        <div className='address-item-col2'>
                                            <div style={{ color: 'var(--text-mini)' }}
                                                onClick={() => { selectedTokenIndex === 1 ? setQuantity(balance_trx + balance_trx_v) : setQuantity(balance) }}
                                            >
                                                Max
                                            </div>
                                        </div>

                                    </div>

                                    <div className='container-balance'>
                                        <div className='your-balance-text'>
                                            {yourbalance}
                                        </div>
                                        <div className='your-balance-q'>
                                            { 
                                                selectedTokenIndex === 0 ? Math.round((balance + balance_v) * 100) / 100:
                                                selectedTokenIndex === 1 ? Math.round((balance_trx + balance_trx_v) * 100) / 100 : 
                                                Math.round((balance_btc) * 100) / 100} USDT
                                        </div>
                                    </div>
                                    <div className='container-balance'>
                                        <div className='your-balance-text'>
                                            {amount_adv}
                                        </div>
                                        <div className='your-balance-q'>
                                            {Math.round(sum_orders * 100) / 100} USDT
                                        </div>
                                    </div>
                                    <div className='container-balance'>
                                        <div className='your-balance-text'>
                                            {amount_send_comm}
                                        </div>
                                        <div className='your-balance-q'>
                                            {selectedTokenIndex === 1 ? (quantity) : (quantity)} / {selectedTokenIndex === 1 ? 3 : 0.5} USDT
                                        </div>
                                    </div>

                                </div>
                            }
                        </>
                    )
                }

                {stepSend === 'confirm' && (
                    <div className='color-bg-cntr h-162 pt-15 mt-20'>
                        <div className='row-2 p-17 h-29'>
                            <div className='send-text-1'>{assets}</div>
                            <div className='send-text-2'>{quantity} USDT</div>
                        </div>

                        {divider}

                        <div className='row-2 p-17 h-29'>
                            <div className='send-text-1'>{recipient}</div>
                            <div className='send-text-2'>{addressTo.slice(0, 4) + '...' + addressTo.slice(28)}</div>
                        </div>

                        {divider}

                        <div className='row-2 p-17 h-29'>
                            <div className='send-text-1'>{network_fee}</div>
                            <div className='send-text-2'>{selectedTokenIndex === 1 ? '3 USDT' : '0.1 USDT'}</div>
                        </div>

                        {divider}

                        <div className='row-2 p-17 h-29 mt-6'>
                            <div className='send-text-1'>{total}</div>
                            <div className='send-text-2'>${parseFloat(quantity) + commission()}</div>
                        </div>
                    </div>

                )}

                {(stepSend === 'wait' || stepSend === 'finish') && (
                    <>
                        <div className='color-bg-cntr h-cntr-deal pt-17 mt-20'>
                            {stepSend === 'wait' ? gear_anim : success_anim}
                            <div className='wait-text'>
                                {stepSend === 'wait' ? 'Транзакция выполняется' : 'Транзакция завершена!'}
                            </div>
                            <div className='wait-text-1 mt-10'>
                                {stepSend === 'wait' && 'Ожидаем кода подтверждения'}
                            </div>
                        </div>

                        <div className='color-bg-cntr h-198 pt-15 mt-20'>
                            <div className='row-2 p-17 h-29'>
                                <div className='send-text-1'>Дата операции</div>
                                <div className='send-text-2'>{date.toLocaleDateString()}</div>
                            </div>

                            {divider}

                            <div className='row-2 p-17 h-29'>
                                <div className='send-text-1'>Актив</div>
                                <div className='send-text-2'>{quantity} USDT</div>
                            </div>

                            {divider}

                            <div className='row-2 p-17 h-29'>
                                <div className='send-text-1'>Получатель</div>
                                <div className='send-text-2'>{addressTo.slice(0, 4) + '...' + addressTo.slice(28)}</div>
                            </div>

                            {divider}

                            <div className='row-2 p-17 h-29'>
                                <div className='send-text-1'>Сетевой сбор</div>
                                <div className='send-text-2'>{selectedTokenIndex === 1 ? '3 USDT' : '0.1 USDT'}</div>
                            </div>

                            {divider}

                            <div className='row-2 p-17 h-29 mt-6'>
                                <div className='send-text-1'>Итого</div>
                                <div className='send-text-2'>${(parseFloat(quantity) || 0) + commission()}</div>
                            </div>
                        </div>
                    </>
                )}

                {stepSend === 'finish' &&
                    <div className='button-send-box button-active-send-bg active-text mt-20'
                        onClick={() => { navigate('/', { replace: true }) }}
                    >
                        На главный экран
                    </div>
                }

                {/* {showLoader && <div className="loader"></div>} */}
                {!showQrScanner &&
                    <div onClick={handleClickSend}
                        className={`button-send-box 
                                ${isCorrectQuantity() && isValidAddress && isReady && stepSend !== 'wait' ?
                                'button-active-send-bg active-text' :
                                stepSend === 'finish' ? 'button-send-bg green-text' : 'button-send-bg disable-text'
                            }  mt-20`
                        }
                    >
                        {
                            stepSend === 'confirm' ? confirm :
                                stepSend === 'wait' ? getScanner() :
                                    stepSend === 'finish' ? hash === '' ? expectation : `${look_at} ${getScanner()}` :
                                        !isValidAddress ? invalid_address :
                                            !isCorrectQuantity() ? wrong_amount :
                                                isReady ? send_title : fill_details

                        }
                    </div>
                }
            </div>
        </div>
    );
}

