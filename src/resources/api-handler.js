import axios from 'axios';
import AppContext from '../context/app-context';

/**
 * Create axios config defaults
 */
const instance = axios.create({
	baseURL: 'http://localhost:8000'
});

function get(url, query = null) {
	let headers = { 'Content-Type': 'application/json' };
	let token = localStorage.getItem('text_app_token');

	if (token) {
		headers.Authorization = token;
	}

	return instance({
		method: 'GET',
		url,
		headers,
		params: {
			q: query
		}
	}).catch(function(error) {
		logoutIfUnauthorized(error);
	});
}

async function post(url, data = null) {
	let headers = { 'Content-Type': 'application/json' };
	let token = localStorage.getItem('text_app_token');

	if (token) {
		headers.Authorization = token;
	}

	return instance({
		method: 'POST',
		url,
		headers,
		data
	}).catch(function(error) {
		logoutIfUnauthorized(error);
	});
}

async function patch(url, data = null) {
	let headers = { 'Content-Type': 'application/json' };
	let token = localStorage.getItem('text_app_token');

	if (token) {
		headers.Authorization = token;
	}

	return instance({
		method: 'PATCH',
		url,
		headers,
		data
	}).catch(function(error) {
		logoutIfUnauthorized(error);
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
