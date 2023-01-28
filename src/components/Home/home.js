import React, { useEffect } from 'react';
import { getUserData } from './homeApi';
import { MenuButtons } from './menubuttons';
import { useTelegram } from '../../hooks/useTelegram';


export function Home() {
	const { user_id} = useTelegram()
	useEffect(() => {
		getUserData({user_id: user_id}, () => {

		})
	});

	return (
		<div>
		<h3>Hello!</h3>
		{/* <input className='home-input' placeholder='adress' onChange={(e) => {setAdress(e.target.value)}} value={adress}/> */}
		<MenuButtons/>
		
		</div>
	);
}
