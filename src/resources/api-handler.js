import axios from 'axios';
import AppContext from '../context/app-context';

/**
 * Create axios config defaults
 */
const instance = axios.create({
	baseURL: 'https://7d48008f.ngrok.io'
});

// Add a response interceptor
instance.interceptors.response.use(
	function(response) {
		// Do something with response data
		return response;
	},
	function(error) {
		if (error.response.status == 401) {
			localStorage.removeItem('text_app_token');
			AppContext.component.changeIsLoggedIn(false);
			AppContext.component.renderComponent('Login');
		}
	}
);

function get(url, query = null) {
	let headers = { 'Content-Type': 'application/json' };
	let token = localStorage.getItem('text_app_token');

	if (token) {
		headers.Authorization = JSON.parse(token);
	}

	return instance({
		method: 'GET',
		url,
		headers,
		params: {
			q: query
		}
	});
}

function post(url, data = null) {
	let headers = { 'Content-Type': 'application/json' };
	let token = localStorage.getItem('text_app_token');

	if (token) {
		headers.Authorization = JSON.parse(token);
	}

	return instance({
		method: 'POST',
		url,
		headers,
		data
	});
}

function patch(url, data = null) {
	let headers = { 'Content-Type': 'application/json' };
	let token = localStorage.getItem('text_app_token');

	if (token) {
		headers.Authorization = JSON.parse(token);
	}

	return instance({
		method: 'PATCH',
		url,
		headers,
		data
	});
}

function logoutIfUnauthorized(error) {
	if (error.response && error.response.status === 401) {
		AppContext.component.changeIsLoggedIn(false);
		AppContext.component.renderComponent('Login');
	}
}

function refreshToken() {
	let currentToken = localStorage.getItem('text_app_token');
	let headers = { 'Content-Type': 'application/json' };

	if (currentToken) {
		headers.Authorization = currentToken;
	}

	return instance({
		method: 'POST',
		url: 'auth/refresh',
		headers
	}).then(({ data: { token } }) => {
		localStorage.setItem('text_app_token', JSON.stringify(token));
	});
}

export { get, post, patch, logoutIfUnauthorized, refreshToken };
