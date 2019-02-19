// Enable pusher logging - don't include this in production
export default () => {
	// Pusher.logToConsole = true;
	// import Pusher from 'pusher-js';
	const Pusher = require('pusher-js');
	let socket;

	return {
		newMessageRecieved: () => {
			console.log('init');
			// console.log(Pusher);

			if (Pusher) {
				socket = new Pusher('44d82e2ec03a80f6c9fe', {
					cluster: 'ap1'
				});

				console.log(socket);

				socket.connection.bind('connected', conn => {
					console.log(conn);
				});

				socket.connection.bind('error', error => {
					console.log(error);
				});

				const channel = socket.subscribe(`recieved-message`);
				console.log(channel);

				channel.bind(`.new-message`, function(context, data) {
					console.log(data);
				});
			}
		},

		destroySocket: () => {
			socket.destroy();
		}
	};
};
