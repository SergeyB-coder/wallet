import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import TextareaAutosize from 'react-textarea-autosize';
import { CURRENCY_FIAT_LIST, CURRENCY_LIST } from '../../../const/devdata';
import { url } from '../../../const/urls';

import { useSocket } from '../../../hooks/useSocket';
import { useTelegram } from '../../../hooks/useTelegram';
import { getDealInfo } from '../market/marketApi';
import { selectDealScreenInfo, setDealScreenInfo } from '../market/marketSlice';
import { getDealMessages } from './chatApi';
import { selectMessages, setMessages } from './chatSlice';
import './style.css'


export function Chat () {
    let xhr = new XMLHttpRequest();
    const navigate = useNavigate()
    const {tg} = useTelegram()
    const { deal_id } = useParams();
    const {socket} = useSocket()
    
    const {user_id, first_name} = useTelegram()
    const dispatch = useDispatch()
    const deal_screen_info = useSelector(selectDealScreenInfo)

    const list_messages = useSelector(selectMessages)

    const [message, setMessage] = useState('')
    const [files, setFiles] = useState([])
    const [showPreSendFilesModal, setShowPreSendFilesModal] = useState(false)
    const [showLoadFile, setShowLoadFile] = useState(false)
    
    
    const handleChangeMessage = (e) => {
        setMessage(e.target.value)
    }

    const handleClickSendMessage = () => {
        setMessage('')
        socket.emit("new_message", {deal_id: deal_screen_info.deal_id, message: message, user_id: user_id, first_name: first_name});
        addMsgToChat({text: message, first_name: first_name})
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
            var objDiv = document.getElementById("messages");
            objDiv.scrollTop = objDiv.scrollHeight;
        })
        
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    function addMsgToChat(msg) {
        let arr = list_messages.slice()
        arr.push(msg)
        dispatch(setMessages(arr))
    }

    const handleSocketOn = (data) => {
            console.log('message from server', data);
            if (data.first_name !== first_name) {
                getDealMessages({deal_id: deal_id !== '0' ? deal_id: deal_screen_info.deal_id}, (data) => {
                    dispatch(setMessages(data.messages))
                })
            }
    }

    const handleCloseSendFile = () => {
        setShowPreSendFilesModal(false)
    }

    const handleSendFileMessage = () => {
        setShowLoadFile(true)
        let formData = new FormData();
        console.log('files', files.length)

        for (let i = 0; i < files.length; i++) {
            formData.append('avatar', files[i]);
        }   
        
        
        formData.append("deal_id", deal_screen_info.deal_id);
        formData.append("user_id", user_id);

        xhr.open('POST', url + '/savefilemessage')
        xhr.upload.addEventListener('progress', function(e) {

        });
        xhr.addEventListener('load', function(e) {
            // alert('Изменеия сохранены')
            
            console.log('good', e)
            getDealMessages({deal_id: deal_id !== '0' ? deal_id: deal_screen_info.deal_id}, (data) => {
                dispatch(setMessages(data.messages))
                var objDiv = document.getElementById("messages");
                objDiv.scrollTop = objDiv.scrollHeight;
                setShowLoadFile(false)
                setShowPreSendFilesModal(false)
            })
        });
        xhr.addEventListener('abort', event => {
            // alert('Отправка отменена')
        })
        xhr.send(formData)
    }

    const backScreen = (() => {
        navigate(`/deal/${deal_id !== '0' ? deal_id: deal_screen_info.deal_id}`, {replace: true})
    })
    

    useEffect(() => {
        console.log(9)
        socket.on(deal_id !== '0' ? deal_id: deal_screen_info.deal_id, handleSocketOn);
        return () => {
            socket.removeAllListeners(deal_id !== '0' ? deal_id: deal_screen_info.deal_id);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        handleGetDealInfo()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        tg.onEvent('backButtonClicked', backScreen)
            return () => {tg.offEvent('backButtonClicked', backScreen)}
        }, )

    return (
            <div className='chat-container'>

                {
                    showPreSendFilesModal &&
                    <div className='modal-send'>
                        <div style={{textAlign: 'left'}}>
                            <svg onClick={handleCloseSendFile} xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="var(--item-bg)" class="bi bi-x" viewBox="0 0 16 16">
                                <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
                            </svg>
                        </div>
                        <img className='img-send' alt='' src={URL.createObjectURL(files[0])}/>
                        <div className='d-flex justify-content-center'>
                            <div onClick={handleSendFileMessage} className='btn-send-file'>
                                {showLoadFile ? <div className="loader-mini"></div>: 'Отправить'}
                            </div>
                        </div>
                    </div>    
                }

                <label style={{color: 'var(--text-light-color)'}}>Чат c {deal_screen_info?.buyer_id?.toString() === user_id.toString() ? deal_screen_info?.saler: deal_screen_info?.buyer}</label>
                <div style={{color: 'var(--text-light-color)'}}>Сумма сделки: {deal_screen_info?.quantity} {CURRENCY_LIST[deal_screen_info?.currency-1]}</div>
                <div style={{color: 'var(--text-light-color)'}}>Цена: {deal_screen_info?.price} {CURRENCY_FIAT_LIST[deal_screen_info?.fiat-1]}</div>
                <div id='messages' className='container-messages my-2'>
                    {
                        list_messages.map((message, index) => {
                            return (
                                <div style={{ display: 'flex', justifyContent: first_name === message.first_name ? 'left': 'right'}}  key={index}>
                                    <div className='container-message-item px-3 py-2 mt-1'>
                                        <div className={first_name === message.first_name ? 'sender-msg-chat': 'recipient-msg-chat'}>{message.first_name}</div>
                                        <div className={first_name === message.first_name ? 'msg-chat': 'msg-chat-recipient'}>{message.text}</div>
                                        {message.url && 
                                            <div style={{backgroundColor: '#FFFFFF', borderRadius: '7px'}}>
                                                <img className='message-img' alt='' src={url + '/static/uploads/' + message.url}/>
                                            </div>
                                        }
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
                
                <div>
                    <div className='row d-flex align-items-center justify-content-between  m-0 p-0'>
                        <TextareaAutosize  className='message-input' type='text' onChange={handleChangeMessage} value={message}/>
                        <div class="file-upload m-0 p-0">
                            <label className='p-0 m-0 w-100' for="file-input">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-paperclip" viewBox="0 0 16 16">
                                    <path d="M4.5 3a2.5 2.5 0 0 1 5 0v9a1.5 1.5 0 0 1-3 0V5a.5.5 0 0 1 1 0v7a.5.5 0 0 0 1 0V3a1.5 1.5 0 1 0-3 0v9a2.5 2.5 0 0 0 5 0V5a.5.5 0 0 1 1 0v7a3.5 3.5 0 1 1-7 0V3z"/>
                                </svg>
                            </label>

                            <input id="file-input" name='file_input' type="file" 
                                onChange={() => {
                                    console.log('onchange')
                                    let file_input = document.getElementById("file-input")
                                    setFiles(file_input.files)     
                                    setShowPreSendFilesModal(true)                                       
                                }}
                            />
                        </div>
                        <div className='btn-send' onClick={handleClickSendMessage}>send</div>
                    </div>
                </div>
                
            </div>
      );
}