import { get, post, patch } from './api-handler';

function listContact(query = null) {
	return new Promise((resolve, reject) => {
		try {
			const response = get(`contacts`, query);
			resolve(response);
		} catch (error) {
			reject(error);
		}
	});
}

function storeContact(data) {
	return new Promise((resolve, reject) => {
		try {
			const response = post(`contacts/store`, data);
			resolve(response);
		} catch (error) {
			reject(error);
		}
	});
}

function editContact(id) {
	return new Promise((resolve, reject) => {
		try {
			const response = get(`contacts/${id}/edit`);
			resolve(response);
		} catch (error) {
			reject(error);
		}
	});
}

function updateContact(id, data) {
	return new Promise((resolve, reject) => {
		try {
			const response = patch(`contacts/${id}/update`, data);
			resolve(response);
		} catch (error) {
			reject(error);
		}
	});
}

function destroyContact(id) {
	return new Promise((resolve, reject) => {
		try {
			const response = post(`contacts/${id}/destroy`);
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
