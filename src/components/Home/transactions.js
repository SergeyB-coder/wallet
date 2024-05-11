import React from 'react';
import { useEffect } from 'react';
import { useTelegram } from '../../hooks/useTelegram';
import { dateConvert } from '../Common/funcs';
import { useNavigate } from 'react-router-dom';
// import { parsePrice } from '../Ptp/ptpApi';
import { useDispatch, useSelector } from 'react-redux';
import { selectPriceMarket } from '../Ptp/ptpSlice';

export function Transactions (props) {
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const { user_id, tg } = useTelegram()

    const price_market = useSelector(selectPriceMarket)

    // const [transactions, setTransactions] = useState([]);

    const backScreen = () => {
        navigate('/', {replace: true})
        // navigate('/home', {replace: true})
    }

    const svg_deal_send = 
        <svg width="13" height="14" viewBox="0 0 13 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8.05374 4.83336L3.9001 4.83336C3.66071 4.83336 3.46673 4.63938 3.46673 4.39999C3.46673 4.16074 3.66071 3.96676 3.9001 3.96676L9.10004 3.96676C9.33929 3.96676 9.53327 4.16074 9.53327 4.39999L9.53327 9.59987C9.53327 9.83926 9.33929 10.0332 9.10005 10.0332C8.86065 10.0332 8.66667 9.83926 8.66667 9.59987L8.66667 5.44628L0.739729 13.3731C0.570557 13.5423 0.296211 13.5423 0.126879 13.3731C-0.0422936 13.2038 -0.0422936 12.9295 0.126879 12.7603L8.05374 4.83336ZM0.866682 1.36682L0.866683 8.73319C0.866683 8.97244 0.672698 9.16657 0.433303 9.16657C0.194054 9.16657 7.68518e-05 8.97244 7.68309e-05 8.7332L7.6149e-05 0.933375C7.61281e-05 0.694127 0.194057 0.500001 0.433303 0.500001L12.5666 0.5C12.8059 0.5 13 0.694126 13 0.933373L13 13.0666C13 13.3058 12.8059 13.4998 12.5666 13.4998L4.76671 13.4998C4.52746 13.4998 4.33333 13.3058 4.33333 13.0666C4.33333 12.8272 4.52746 12.6332 4.76671 12.6332L12.1332 12.6332L12.1332 1.3669L0.866682 1.36682Z" fill="#979797"/>
        </svg>

    const svg_deal_recieve = 
        <svg width="13" height="14" viewBox="0 0 13 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4.94626 9.16664H9.09989C9.33929 9.16664 9.53327 9.36062 9.53327 9.60001C9.53327 9.83926 9.33929 10.0332 9.09989 10.0332H3.89995C3.66071 10.0332 3.46673 9.83926 3.46673 9.60001V4.40013C3.46673 4.16074 3.66071 3.96676 3.89995 3.96676C4.13935 3.96676 4.33333 4.16074 4.33333 4.40013V8.55372L12.2603 0.626878C12.4294 0.457707 12.7038 0.457707 12.8731 0.626878C13.0423 0.796194 13.0423 1.07054 12.8731 1.23972L4.94626 9.16664ZM12.1333 12.6332V5.26681C12.1333 5.02756 12.3273 4.83343 12.5667 4.83343C12.8059 4.83343 12.9999 5.02756 12.9999 5.26681V13.0666C12.9999 13.3059 12.8059 13.5 12.5667 13.5H0.433378C0.194129 13.5 0 13.3059 0 13.0666V0.933448C0 0.694202 0.194129 0.500224 0.433378 0.500224H8.23329C8.47254 0.500224 8.66667 0.694205 8.66667 0.933448C8.66667 1.17284 8.47254 1.36682 8.23329 1.36682H0.86683V12.6331L12.1333 12.6332Z" fill="#86EFAC"/>
        </svg>



    
    useEffect(() => {
        // getTransactions({user_id: user_id}, (data) => {
        //     setTransactions(data.transactions)
        // })
    }, [user_id]);

    useEffect(() => {
        tg.MainButton.hide()
        tg.BackButton.show()
    }, [tg.BackButton, tg.MainButton]);

    useEffect(() => {
        tg.onEvent('backButtonClicked', backScreen)
            return () => {tg.offEvent('backButtonClicked', backScreen)}
        }, )
    
    useEffect(() => {
        // parsePrice({}, (data) => {
        //     dispatch(setPriceMarket(data.price_market))
        //     dispatch(setPriceMarketTRX(data.price_market_trx))
        //     dispatch(setRubDollar(data.rub_dollar))            
        // })
    }, [dispatch]);

    return (
        <div className='container-center'>
            <div className='w-cntr'>
                <div className='container-title mt-20'>
                    <div className='title-text'>История транзакций</div>
                </div>

                {
                    props.transactions.map((transaction, index) => {
                        return (
                            <div key={index} className={`row-2 a-c ${transaction.type === 'send' ? 'color-bg-deal': 'color-bg-deal-r'} h-77 p-17 mt-20`}>
                                <div className='h-100'>
                                    <div className='deal-text mt-18'>{dateConvert(transaction.datetime)}</div>
                                    <div className={transaction.type === 'send' || transaction.to_id === 0 ? 'deal-text-2 color-deal-text mt-10': 'mt-10 deal-text-2 color-deal-r-text'}>
                                        {transaction.type === 'send' || transaction.to_id === 0 ? <span>{svg_deal_send}</span>: <span>{svg_deal_recieve}</span>}

                                        {transaction.type === 'send' || transaction.to_id === 0 ? ' Отправлено': ' Доставлено'}
                                    </div>
                                </div>
                                <div className='h-100'>
                                    {transaction.type === 'send' || transaction.to_id === 0 ?
                                        <div className= 'text-deal-quantity color-q-text'>-{transaction.q} USDT</div>:
                                        <div className='text-deal-quantity color-deal-r-text'>+{Math.round(transaction.q*100)/100} USDT</div>
                                    }
                                    <div className='deal-text-3 text-nowrap'>${Math.round(transaction.q * price_market * 100)/100}</div>
                                </div>
                            </div>
                        )
                    })
                }

                
            </div>
            

        </div>
      );
}

