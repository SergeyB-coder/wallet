import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { getUserData } from './homeApi';
import { setAddress } from './homeSlice';
import { MenuButtons } from './menubuttons';
import { useTelegram } from '../../hooks/useTelegram';

// const user_id = '652065848'
export function Home() {
	const { user_id} = useTelegram()

	const dispatch = useDispatch()

	// const address = useSelector(selectAddress)

	useEffect(() => {
		getUserData({user_id: user_id}, (data) => {
			dispatch(setAddress(data.address))
		})
	});

	return (
		<div>
			<h3>Hello!</h3>
			<MenuButtons/>		
		</div>
	);
}
