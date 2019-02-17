import { useContext, useState } from 'react';
import axios from 'axios';
import AppContext from '../context/app-context';

function Authenticate(data) {
	return new Promise((resolve, reject) => {
		try {
			const response = axios.post(`login`, data);
			resolve(response);
		} catch (error) {
			reject(error);
		}
	});
}

/**
 * Check if token exists in localStorage
 *
 * @returns Boolean
 */
function IsAuthenticated() {
	let context = useContext(AppContext);
	let [token, changeToken] = useState(localStorage.getItem('text_app_token'));

	if (token !== null) {
		context.loginStatus.changeLoginStatus(true);
	}
}

function updateCurrentComponent(component, props) {
	localStorage.setItem(
		'text_app_current_component',
		JSON.stringify({ component, props })
	);
}

function getCurrentComponent() {
	return localStorage.getItem('text_app_current_component')
		? JSON.parse(localStorage.getItem('text_app_current_component'))
		: { component: null, props: null };
}

export {
	Authenticate,
	IsAuthenticated,
	updateCurrentComponent,
	getCurrentComponent
};
