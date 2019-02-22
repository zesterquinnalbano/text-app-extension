import {
	post,
	get,
	patch,
	logoutIfUnauthorized
} from '../resources/api-handler';

function updateUser(params) {
	return new Promise((resolve, reject) => {
		patch(`auth/update-user`, params)
			.then(response => {
				resolve(response);
			})
			.catch(error => {
				logoutIfUnauthorized(error);
				reject(error);
			});
	});
}

function getUser() {
	return new Promise((resolve, reject) => {
		get(`auth/user`)
			.then(response => {
				resolve(response);
			})
			.catch(error => {
				logoutIfUnauthorized(error);
				reject(error);
			});
	});
}

function logout() {
	return new Promise((resolve, reject) => {
		post(`auth/logout`)
			.then(response => {
				resolve(response);
			})
			.catch(error => {
				logoutIfUnauthorized(error);
				reject(error);
			});
	});
}

export { updateUser, getUser, logout };
