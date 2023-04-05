import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import TextareaAutosize from 'react-textarea-autosize';

// import { useTelegram } from '../../../hooks/useTelegram';
// import { ButtonNext } from '../../Common/buttonNext';
import { selectComment, setComment } from '../ptpSlice';

export function CreateOrder3(props) {
    // const {user_id} = useTelegram()
    const dispatch = useDispatch()

    const comment = useSelector(selectComment)

    const handleChangeComment = (e) => {
        dispatch(setComment(e.target.value))
    }

    return (
        <div className='container-create-order mt-20'>
            <div className='container-title'>
                <div className='title-text'>Комментарий</div>
                <div className='page-number'>3/4</div>
            </div>

            <div className='container-comment-input mt-20'>
                <TextareaAutosize placeholder='Коментарий'  className='comment-input' type='text' onChange={handleChangeComment} value={comment}/>
            </div>
            
            <div className='px-17 mt-20'>
                <div className='comment-mini-text clr-white'>Пример сообщения:</div>
                <div  className='comment-mini-text clr-grey'>
                    
                    Владельцем платежного счета и аккаунта на Р2Р
                    Маркете Wallet должен быть один человек. Не указывайте тикеры монет (например, TON) в комментарии к переводу.
                </div>
            </div>
            
            {/* <ButtonNext onClick={() => props.setScreen('createorder4')}/> */}
            <div onClick={() => {props.setScreen('createorder4')}} className='button-send-box button-active-send-bg active-text mt-20'>
                Далее
            </div>
        </div>
    );
}
