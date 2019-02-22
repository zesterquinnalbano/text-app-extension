import { get, post, patch } from '../resources/api-handler';

function listConversation(params = null) {
	return new Promise((resolve, reject) => {
		get(`conversations`, params)
			.then(response => {
				resolve(response);
			})
			.catch(error => {
				reject(error);
			});
	});
}

function sendConversation(data) {
	return new Promise((resolve, reject) => {
		post(`conversations/send`, data)
			.then(response => {
				resolve(response);
			})
			.catch(error => {
				reject(error);
			});
	});
}

function sendNewConversation(data) {
	return new Promise((resolve, reject) => {
		post(`conversations/send-new`, data)
			.then(response => {
				resolve(response);
			})
			.catch(error => {
				reject(error);
			});
	});
}

function showConversation(id, params = null) {
	return new Promise((resolve, reject) => {
		get(`conversations/${id}`, params)
			.then(response => {
				resolve(response);
			})
			.catch(error => {
				reject(error);
			});
	});
}

function updateNewMessage(id) {
	return new Promise((resolve, reject) => {
		patch(`conversations/${id}/update-new-message`)
			.then(response => {
				resolve(response);
			})
			.catch(error => {
				reject(error);
			});
	});
}

function destroyConversation(id) {
	return new Promise((resolve, reject) => {
		post(`conversations/${id}/destroy`)
			.then(response => {
				resolve(response);
			})
			.catch(error => {
				reject(error);
			});
	});
}

export {
	sendConversation,
	destroyConversation,
	showConversation,
	listConversation,
	updateNewMessage,
	sendNewConversation
};
