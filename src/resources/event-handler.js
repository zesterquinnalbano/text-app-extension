import { useState } from 'react';
import Pusher from 'pusher-js';

let socket;

export default () => {
	return {
		newMessageRecieved: function(callback) {
			socket = new Pusher('44d82e2ec03a80f6c9fe', {
				cluster: 'ap1',
				disableStats: true
			});

			const channel = socket.subscribe('inbox-channel');

			channel.bind('new-message-recieved-event', function(data) {
				callback(data);
				console.log(data);
			});
		},

		destroySocket: () => {
			// socket.destroy();
			return;
		}
	};
};
