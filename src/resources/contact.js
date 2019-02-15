import axios from 'axios';

function listContact(query = null) {
	return new Promise((resolve, reject) => {
		try {
			const response = axios.get(`contacts`, {
				params: {
					q: query
				}
			});
			resolve(response);
		} catch (error) {
			reject(error);
		}
	});
}

function storeContact(data) {
	return new Promise((resolve, reject) => {
		try {
			const response = axios.post(`contacts/store`, data);
			resolve(response);
		} catch (error) {
			reject(error);
		}
	});
}

function editContact(id) {
	return new Promise((resolve, reject) => {
		try {
			const response = axios.get(`contacts/${id}/edit`);
			resolve(response);
		} catch (error) {
			reject(error);
		}
	});
}

function updateContact(id, data) {
	return new Promise((resolve, reject) => {
		try {
			const response = axios.patch(`contacts/${id}/update`, data);
			resolve(response);
		} catch (error) {
			reject(error);
		}
	});
}

function destroyContact(id) {
	return new Promise((resolve, reject) => {
		try {
			const response = axios.post(`contacts/${id}/destroy`);
			resolve(response);
		} catch (error) {
			reject(error);
		}
	});
}

export {
	storeContact,
	destroyContact,
	editContact,
	updateContact,
	listContact
};
