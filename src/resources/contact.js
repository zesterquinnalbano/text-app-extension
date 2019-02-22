import { get, post, patch, logoutIfUnauthorized } from './api-handler';

function listContact(query = null) {
	return new Promise((resolve, reject) => {
		get(`contacts`, query)
			.then(response => {
				resolve(response);
			})
			.catch(error => {
				logoutIfUnauthorized(error);
				reject(error);
			});
	});
}

function storeContact(data) {
	return new Promise((resolve, reject) => {
		post(`contacts/store`, data)
			.then(response => {
				resolve(response);
			})
			.catch(error => {
				logoutIfUnauthorized(error);
				reject(error);
			});
	});
}

function editContact(id) {
	return new Promise((resolve, reject) => {
		get(`contacts/${id}/edit`)
			.then(response => {
				resolve(response);
			})
			.catch(error => {
				logoutIfUnauthorized(error);
				reject(error);
			});
	});
}

function updateContact(id, data) {
	return new Promise((resolve, reject) => {
		patch(`contacts/${id}/update`, data)
			.then(response => {
				resolve(response);
			})
			.catch(error => {
				logoutIfUnauthorized(error);
				reject(error);
			});
	});
}

function destroyContact(id) {
	return new Promise((resolve, reject) => {
		post(`contacts/${id}/destroy`)
			.then(response => {
				resolve(response);
			})
			.catch(error => {
				logoutIfUnauthorized(error);
				reject(error);
			});
	});
}

export {
	storeContact,
	destroyContact,
	editContact,
	updateContact,
	listContact
};
