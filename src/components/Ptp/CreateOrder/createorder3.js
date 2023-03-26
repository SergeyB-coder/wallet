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
        <div>
            <div className='row  mt-3'>
                <div className='col-9 t-left-align text-dark-color'>Добавьте комментарий</div>
                <div className='col-2 text-dark-color'>3/4</div>
            </div>

            
            <TextareaAutosize  className='comment-input mt-3' type='text' onChange={handleChangeComment} value={comment}/>
            {/* <ButtonNext onClick={() => props.setScreen('createorder4')}/> */}
        </div>
    );
}
