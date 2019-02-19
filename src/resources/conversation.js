import { get, post } from '../resources/api-handler';

function listConversation() {
	return new Promise((resolve, reject) => {
		try {
			const response = get(`conversations`);
			resolve(response);
		} catch (error) {
			reject(error);
		}
	});
}

function sendConversation(data) {
	return new Promise((resolve, reject) => {
		try {
			const response = post(`conversations/send`, data);
			resolve(response);
		} catch (error) {
			reject(error);
		}
	});
}

function sendNewConversation(data) {
	return new Promise((resolve, reject) => {
		try {
			const response = post(`conversations/send-new`, data);
			resolve(response);
		} catch (error) {
			reject(error);
		}
	});
}

function showConversation(id, params = null) {
	return new Promise((resolve, reject) => {
		try {
			const response = get(`conversations/${id}`, params);
			resolve(response);
		} catch (error) {
			reject(error);
		}
	});
}

function destroyConversation(id) {
	return new Promise((resolve, reject) => {
		try {
			const response = post(`conversations/${id}/destroy`);
			resolve(response);
		} catch (error) {
			reject(error);
		}
	});
}

export {
	sendConversation,
	destroyConversation,
	showConversation,
	listConversation,
	sendNewConversation
};
