import React, { useEffect, useState } from 'react';
import TextareaAutosize from 'react-textarea-autosize';

import { useSocket } from '../../../hooks/useSocket';
import { useTelegram } from '../../../hooks/useTelegram';
import './style.css'


export function Chat (props) {
    const deal_id = props.deal_id
    const {socket} = useSocket()
    const {user_id, first_name} = useTelegram()

    const [listMessage, setListMessage] = useState([])
    const [message, setMessage] = useState('')
    
    const handleChangeMessage = (e) => {
        setMessage(e.target.value)
    }

    const handleClickSendMessage = () => {
        setMessage('')
        socket.emit("new_message", {deal_id: deal_id, message: message, user_id: user_id, first_name: first_name});
        addMsgToChat({text: message, first_name: first_name})
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    function addMsgToChat(msg) {
        let arr = listMessage.slice()
        arr.push(msg)
        setListMessage(arr)
    }

    useEffect(() => {
        console.log(9)
        socket.on(deal_id, (data) => {
            console.log('message from server', data);
            addMsgToChat(data)
        });
        return () => {
            socket.removeAllListeners(deal_id);
        }
    }, [addMsgToChat, deal_id, socket]);

    return (
            <div className='chat-container'>
                <label>Чат</label>

                <div className='container-messages my-2'>
                    {
                        listMessage.map((message, index) => {
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