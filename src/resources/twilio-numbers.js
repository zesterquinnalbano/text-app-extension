import axios from 'axios';

function listTwilioNumbers() {
	return new Promise((resolve, reject) => {
		try {
			const response = axios.get(`twilio-numbers`);
			resolve(response);
		} catch (error) {
			reject(error);
		}
	});
}

export { listTwilioNumbers };
