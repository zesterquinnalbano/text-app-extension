import axios from 'axios';

/**
 * Create axios config defaults
 */
const instance = axios.create({
	baseURL: 'http://localhost:8000'
});

function get(url, query = null) {
	let token = localStorage.getItem('text_app_token');
	let headers = { 'Content-Type': 'application/json' };

	if (token) {
		headers.Authorization = JSON.stringify(token);
	}

	return instance({
		method: 'GET',
		url,
		headers,
		params: {
			q: query
		}
	}).catch(error => {
		localStorage.removeItem('text_app_token');
		localStorage.removeItem('text_app_current_component');
	});
}

function post(url, data = null) {
	let token = localStorage.getItem('text_app_token');
	let headers = { 'Content-Type': 'application/json' };

	if (token) {
		headers.Authorization = JSON.stringify(token);
	}

	return instance({
		method: 'POST',
		url,
		headers,
		data
	}).catch(error => {
		localStorage.removeItem('text_app_token');
		localStorage.removeItem('text_app_current_component');
	});
}

function patch(url, data = null) {
	let token = localStorage.getItem('text_app_token');
	let headers = { 'Content-Type': 'application/json' };

	if (token) {
		headers.Authorization = JSON.stringify(token);
	}

	return instance({
		method: 'PATCH',
		url,
		headers,
		data
	}).catch(error => {
		localStorage.removeItem('text_app_token');
		localStorage.removeItem('text_app_current_component');
	});
}

export { get, post, patch };
