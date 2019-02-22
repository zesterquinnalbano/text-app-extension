import { get, logoutIfUnauthorized } from '../resources/api-handler';

function listTwilioNumbers() {
	return new Promise((resolve, reject) => {
		get(`twilio-numbers`)
			.then(response => {
				resolve(response);
			})
			.catch(error => {
				logoutIfUnauthorized(error);
				reject(error);
			});
	});
}

export { listTwilioNumbers };
