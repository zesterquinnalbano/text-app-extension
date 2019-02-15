import axios from 'axios';

function listConversation() {
	return new Promise((resolve, reject) => {
		try {
			const response = axios.get(`conversations`);
			resolve(response);
		} catch (error) {
			reject(error);
		}
	});
}

function sendConversation(data) {
	return new Promise((resolve, reject) => {
		try {
			const response = axios.post(`conversations/send`, data);
			resolve(response);
		} catch (error) {
			reject(error);
		}
	});
}

function sendNewConversation(data) {
	return new Promise((resolve, reject) => {
		try {
			const response = axios.post(`conversations/send`, data);
			resolve(response);
		} catch (error) {
			reject(error);
		}
	});
}

function showConversation(id) {
	return new Promise((resolve, reject) => {
		try {
			const response = axios.get(`conversations/${id}`);
			resolve(response);
		} catch (error) {
			reject(error);
		}
	});
}

function destroyConversation(id) {
	return new Promise((resolve, reject) => {
		try {
			const response = axios.post(`conversations/${id}/destroy`);
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
