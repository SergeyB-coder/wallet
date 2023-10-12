import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import TextareaAutosize from 'react-textarea-autosize';

import { useTelegram } from '../../../hooks/useTelegram';
// import { ButtonNext } from '../../Common/buttonNext';
import { selectComment, setComment } from '../ptpSlice';
import { dictionary } from '../../../const/dictionary';

export function CreateOrder3(props) {
    const {language_code} = useTelegram()
    const dispatch = useDispatch()

    const a_comment = language_code === 'ru' ? dictionary.a_comment.ru: dictionary.a_comment.en
    const further = language_code === 'ru' ? dictionary.further.ru: dictionary.further.en

    const comment = useSelector(selectComment)

    const handleChangeComment = (e) => {
        dispatch(setComment(e.target.value))
    }

    return (
        <div className='container-create-order mt-20'>
            <div className='container-title'>
                <div className='title-text'>{a_comment}</div>
                <div className='page-number'>3/4</div>
            </div>

            <div className='container-comment-input mt-20' onClick={()=>{
                const el = document.getElementById('5')
                el.focus()
            }}>
                <TextareaAutosize id='5' placeholder={a_comment}  className='comment-input' type='text' onChange={handleChangeComment} value={comment}/>
            </div>
            
            
            <div onClick={() => {props.setScreen('createorder4')}} className='button-send-box button-active-send-bg active-text mt-20'>
                {further}
            </div>
        </div>
    );
}
