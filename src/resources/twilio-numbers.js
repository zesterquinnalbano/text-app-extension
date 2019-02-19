import { get } from '../resources/api-handler';

function listTwilioNumbers() {
	return new Promise((resolve, reject) => {
		try {
			const response = get(`twilio-numbers`);
			resolve(response);
		} catch (error) {
			reject(error);
		}
	});
}

export { listTwilioNumbers };
