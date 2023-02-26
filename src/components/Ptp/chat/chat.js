import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import TextareaAutosize from 'react-textarea-autosize';

import { useSocket } from '../../../hooks/useSocket';
import { useTelegram } from '../../../hooks/useTelegram';
import { getDealInfo } from '../market/marketApi';
import { selectDealScreenInfo, setDealScreenInfo } from '../market/marketSlice';
import { getDealMessages } from './chatApi';
import { selectMessages, setMessages } from './chatSlice';
import './style.css'


export function Chat () {
    let { deal_id } = useParams();
    const {socket} = useSocket()
    
    const {user_id, first_name} = useTelegram()
    const dispatch = useDispatch()
    const deal_screen_info = useSelector(selectDealScreenInfo)

    const list_messages = useSelector(selectMessages)
    let state_list_messages = []

    const [message, setMessage] = useState('')
    
    const handleChangeMessage = (e) => {
        setMessage(e.target.value)
    }

    const handleClickSendMessage = () => {
        // setMessage('')
        socket.emit("new_message", {deal_id: deal_screen_info.deal_id, message: message, user_id: user_id, first_name: first_name});
        // addMsgToChat({text: message, first_name: first_name})
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    function handleGetDealInfo() {
        if (deal_id !== '0') {
            console.log('handleGetDealInfo start', deal_id)
            getDealInfo( {deal_id: deal_id}, (data) => {
                console.log('handleGetDealInfo chat', data)
                dispatch(setDealScreenInfo(
                    {
                        deal_id: deal_id,
                        quantity: data.deal.quantity, 
                        price: data.deal.price,
                        fiat: data.deal.fiat,
                        currency: data.deal.currency,
                        status: data.deal.status,
                        saler_id: data.deal.saler_id,
                        buyer_id: data.deal.buyer_id,
                        saler: data.deal.saler, 
                        buyer: data.deal.buyer,
                    } 
                ))
            }) 
        }

        getDealMessages({deal_id: deal_id !== '0' ? deal_id: deal_screen_info.deal_id}, (data) => {
            dispatch(setMessages(data.messages))
            state_list_messages = data.messages
        })
        
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    function addMsgToChat(msg) {
        let arr = state_list_messages.slice()
        arr.push(msg)
        state_list_messages = arr
        dispatch(setMessages(arr))
    }

    const handleSocketOn = (data) => {
            console.log('message from server', data);
            addMsgToChat(data)
    }
    

    useEffect(() => {
        console.log(9)
        socket.on(deal_id, handleSocketOn);
        return () => {
            socket.removeAllListeners(deal_id);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        handleGetDealInfo()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
            <div className='chat-container'>
                <label style={{color: 'var(--text-light-color)'}}>Чат c {deal_screen_info?.buyer_id?.toString() === user_id.toString() ? deal_screen_info.saler: deal_screen_info?.buyer}</label>

                <div className='container-messages my-2'>
                    {
                        list_messages.map((message, index) => {
                            return (
                                <div key={index}>
                                    <div className={first_name === message.first_name ? 'sender-msg-chat': 'recipient-msg-chat'}>{message.first_name}</div>
                                    <div className={first_name === message.first_name ? 'msg-chat': 'msg-chat-recipient'}>{message.text}</div>
                                </div>
                            )
                        })
                    }
                </div>
                
                <div>
                    <div className='row d-flex align-items-center justify-content-between  m-0 p-0'>
                        <TextareaAutosize  className='message-input' type='text' onChange={handleChangeMessage} value={message}/>
                        <div className='btn-send' onClick={handleClickSendMessage}>send</div>
                    </div>
                </div>
                
            </div>
      );
}