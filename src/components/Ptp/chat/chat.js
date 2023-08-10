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
import { selectNameUser } from '../../Home/homeSlice';


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
    const name_user = useSelector(selectNameUser)

    const [message, setMessage] = useState('')
    const [files, setFiles] = useState([])
    const [showPreSendFilesModal, setShowPreSendFilesModal] = useState(false)
    const [showLoadFile, setShowLoadFile] = useState(false)
    
    
    const handleChangeMessage = (e) => {
        setMessage(e.target.value)
    }

    const handleClickSendMessage = () => {
        if (message.trim() === '') return
        setMessage('')
        socket.emit("new_message", {deal_id: deal_screen_info.deal_id, message: message, user_id: user_id, name_user: name_user});
        addMsgToChat({text: message, first_name: name_user})
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

    useEffect(() => {
        tg.expand()
    }, [tg]);

    return (
            <div className='chat-container'>
                <div className='w-cntr color-bg-cntr-person mt-20'>

                    {
                        showPreSendFilesModal &&
                        <div className='modal-send'>
                            <div style={{textAlign: 'left'}}>
                                <svg onClick={handleCloseSendFile} xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="var(--item-bg)" className="bi bi-x" viewBox="0 0 16 16">
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

                    <label className='chat-title-text mt-25'>Чат c {deal_screen_info?.buyer_id?.toString() === user_id.toString() ? deal_screen_info?.saler: deal_screen_info?.buyer}</label>
                    <div className='chat-title-text-2'>
                        Сумма: {deal_screen_info?.quantity} {CURRENCY_LIST[deal_screen_info?.currency-1]}
                        Цена: {deal_screen_info?.price} {CURRENCY_FIAT_LIST[deal_screen_info?.fiat-1]}
                    </div>
                    
                    <div id='messages' className='container-messages mt-32'>
                        {
                            list_messages.map((message, index) => {
                                return (
                                    name_user === message.first_name ?
                                    <div style={{ display: 'flex', justifyContent: 'left', marginBottom: '10px'}}  key={index}>
                                        <div className='container-message-item'>
                                            <div className='msg-chat'>{message.text}</div>
                                            {message.url && 
                                                <div style={{backgroundColor: '#FFFFFF', borderRadius: '7px'}}>
                                                    <img className='message-img' alt='' src={url + '/static/uploads/' + message.url}/>
                                                </div>
                                            }

                                        <svg className='msg-svg' width="6" height="11" viewBox="0 0 6 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M3.6936 0.463279L0.433667 4.90864C0.17554 5.26063 0.17554 5.73937 0.433667 6.09136L3.69359 10.5367C4.26513 11.3161 5.5 10.9118 5.5 9.94536V1.05464C5.5 0.0881743 4.26513 -0.316086 3.6936 0.463279Z" fill="white"/>
                                        </svg>

                                        </div>
                                    </div>:
                                    <div style={{display: 'flex', justifyContent: 'right', marginBottom: '10px'}} key={index}>
                                        <div className='container-my-message-item'>
                                            <div className='msg-chat'>{message.text}</div>
                                            {message.url && 
                                                <div style={{backgroundColor: '#FFFFFF', borderRadius: '7px'}}>
                                                    <img className='message-img' alt='' src={url + '/static/uploads/' + message.url}/>
                                                </div>
                                            }

                                        <svg className='msg-svg-g' width="5" height="11" viewBox="0 0 5 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M1.83205 0.748073L4.6302 4.9453C4.85413 5.2812 4.85413 5.7188 4.6302 6.0547L1.83205 10.2519C1.28323 11.0752 0 10.6866 0 9.69722V1.30278C0 0.313368 1.28322 -0.0751638 1.83205 0.748073Z" fill="#86EFAC"/>
                                        </svg>


                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                    
                    <div className='chat-cntr-input'>
                        <div className='row d-flex align-items-center justify-content-between  m-0 p-0 w-335'>
                        
                            <div className="file-upload m-0 p-0">
                                <label className='p-0 m-0 w-100' for="file-input">
                                    {/* <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-paperclip" viewBox="0 0 16 16">
                                        <path d="M4.5 3a2.5 2.5 0 0 1 5 0v9a1.5 1.5 0 0 1-3 0V5a.5.5 0 0 1 1 0v7a.5.5 0 0 0 1 0V3a1.5 1.5 0 1 0-3 0v9a2.5 2.5 0 0 0 5 0V5a.5.5 0 0 1 1 0v7a3.5 3.5 0 1 1-7 0V3z"/>
                                    </svg> */}
                                    <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path fill-rule="evenodd" clip-rule="evenodd" d="M13 25.5C19.9036 25.5 25.5 19.9036 25.5 13C25.5 6.09644 19.9036 0.5 13 0.5C6.09644 0.5 0.5 6.09644 0.5 13C0.5 19.9036 6.09644 25.5 13 25.5ZM17.6875 14.9063V11.8749H14.7345V8.70312H11.2655V11.8749H8.3125V14.9063H11.2655V18.0781H14.7345V14.9063H17.6875Z" fill="#86EFAC"/>
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
                            <div className='chat-wrap-input ml-7'>
                                <TextareaAutosize placeholder='Введите сообщение'  className='message-input' type='text' onChange={handleChangeMessage} value={message}/>
                            </div>
                            
                            
                            <div className='btn-send' onClick={handleClickSendMessage}>
                                <svg width="7" height="11" viewBox="0 0 7 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path fill-rule="evenodd" clip-rule="evenodd" d="M7 5.5C7 5.86467 6.8525 6.21441 6.58995 6.47227L2.38995 10.5973C1.84321 11.1342 0.956784 11.1342 0.41005 10.5973C-0.136683 10.0603 -0.136683 9.1897 0.410051 8.65273L3.6201 5.5L0.410052 2.34727C-0.136682 1.8103 -0.136683 0.939699 0.410052 0.402728C0.956785 -0.134243 1.84322 -0.134243 2.38995 0.402728L6.58995 4.52773C6.8525 4.78559 7 5.13533 7 5.5Z" fill="black"/>
                                </svg>

                            </div>
                        </div>
                    </div>
                
                </div>

            </div>
      );
}