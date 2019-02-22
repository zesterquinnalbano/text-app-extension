import React, { useContext, useState } from 'react';
import { Button, Alert, Input } from 'antd';
import { head } from 'lodash';
import styles from './index.css';
import { useInput, useValue } from '../../states';
import { Authenticate } from '../../services';
import AppContext from '../../context/app-context';

export default function Login() {
	const context = useContext(AppContext);
	const [responseMessage, changeResponseMessage] = useState(null);
	const [submitting, changeSubmitting] = useState(false);

	const credentials = {
		username: useInput(),
		password: useInput()
	};

	async function login(e) {
		e.preventDefault();
		changeSubmitting(true);
		changeResponseMessage(null);

		let params = {};

		Object.keys(credentials).map(keys => {
			params[keys] = useValue(credentials[keys]);
		});

		try {
			let {
				data: { token }
			} = await Authenticate(params);

			localStorage.setItem('text_app_token', JSON.stringify(token));
			context.component.renderComponent('Inbox');
		} catch ({ response: { data, status } }) {
			let message;
			let error = Object.values(data).map(values => {
				return <li>{head(values)}</li>;
			});

			if (status == 401) {
				message = data.error;
			} else {
				message = <ul className={styles.lnxList}>{error}</ul>;
			}

			changeResponseMessage({
				status,
				message
			});
		}

		changeSubmitting(false);
	}

	return (
		<div className={styles.lnxLoginContainer}>
			{responseMessage ? (
				<Alert
					className={styles.lnxAlert}
					message={responseMessage.status == 200 ? 'Success' : 'Error'}
					description={responseMessage.message}
					type={responseMessage.status == 200 ? 'success' : 'error'}
					showIcon
				/>
			) : (
				''
			)}
			<form onSubmit={login}>
				<Input
					className={styles.lnxFormInput}
					placeholder="Username"
					{...credentials.username}
				/>
				<Input
					className={styles.lnxFormInput}
					placeholder="Token"
					type="password"
					{...credentials.password}
				/>
				<Button
					style={{ marginTop: '1.5rem' }}
					htmlType="submit"
					type="primary"
					block
					loading={submitting}
				>
					Login
				</Button>
			</form>
		</div>
	);
}
