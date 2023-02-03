import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { getUserData } from './homeApi';
import { setAddress } from './homeSlice';
import { MenuButtons } from './menubuttons';
import { useTelegram } from '../../hooks/useTelegram';

// const user_id = '652065848'
// const user_id = '222'
export function Home() {
	const { user_id, chat_id } = useTelegram()

	const dispatch = useDispatch()

	const {tg} = useTelegram()

	useEffect(() => {
		getUserData({user_id: user_id, chat_id: chat_id}, (data) => {
			dispatch(setAddress(data.address))
		})
	});

	useEffect(() => {
        tg.MainButton.hide()
		tg.BackButton.hide()
    }, );

	return (
		<div>
			<h3>Hello!</h3>
			<MenuButtons/>		
		</div>
	);
}
