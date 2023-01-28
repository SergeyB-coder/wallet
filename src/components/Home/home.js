import React, { useEffect } from 'react';
import { getUserData } from './homeApi';
import { MenuButtons } from './menubuttons';
import { useTelegram } from '../../hooks/useTelegram';


export function Home() {
	const tg = useTelegram()
	useEffect(() => {
		getUserData({user_id: tg.WebAppUser.id}, () => {

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
