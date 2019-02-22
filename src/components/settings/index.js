import React, { useContext, useEffect, useState } from 'react';
import AppInput from '../common/input';
import { head } from 'lodash';
import styles from './index.css';
import { Button, Row, Col, Input, Alert } from 'antd';
import { useInput, useValue } from '../../states';
import AppContext from '../../context/app-context';
import { getUser, updateUser, logout } from '../../resources/user';

export default function Settings(props) {
	const context = useContext(AppContext);
	const [responseMessage, changeResponseMessage] = useState({});
	const [submitting, changeSubmitting] = useState(false);

	const credentials = {
		firstname: useInput(),
		lastname: useInput(),
		password: useInput(),
		username: useInput()
	};

	useEffect(() => {
		getInfo();
	}, props);

	async function getInfo() {
		try {
			let {
				data: { data }
			} = await getUser();

			Object.keys(credentials).map(key => {
				credentials[key].handleChange(data[key]);
			});
		} catch (error) {}
	}

	async function updateInfo(e) {
		e.preventDefault();
		changeSubmitting(true);

		let params = {};

		Object.keys(credentials).map(keys => {
			params[keys] = useValue(credentials[keys]);
		});

		try {
			let {
				status,
				data: { message }
			} = await updateUser(params);

			changeResponseMessage({
				status,
				message
			});
		} catch ({ response: { status, data } }) {
			let error = Object.values(data).map(values => {
				return <li>{head(values)}</li>;
			});

			changeResponseMessage({
				status,
				message: <ul className={styles.lnxList}>{error}</ul>
			});
		}

		changeSubmitting(false);
	}

	async function logout() {
		await logout();
		localStorage.removeItem('text_app_token');
		localStorage.removeItem('text_app_current_component');
		context.component.handleLoggedIn(false);
		context.component.renderComponent('Login');
	}

	return (
		<Row>
			<Row className={styles.lnxSettingsHeaderContainer}>
				<Col span={13}>
					<h2 className={styles.lnxTextHeader}>Settings</h2>
				</Col>
				<Col span={11}>
					<Button
						onClick={logout}
						icon="logout"
						style={{ float: 'right' }}
						type="danger"
					>
						Logout
					</Button>
				</Col>
			</Row>
			<Row className={styles.lnxSettingsBodyContainer}>
				<Col>
					{Object.keys(responseMessage).length ? (
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
					<form onSubmit={updateInfo}>
						<Input
							className={styles.lnxFormInput}
							placeholder="Firstname"
							{...credentials.firstname}
						/>
						<Input
							className={styles.lnxFormInput}
							placeholder="Lastname"
							{...credentials.lastname}
						/>
						<Input
							className={styles.lnxFormInput}
							placeholder="Username"
							{...credentials.username}
						/>
						<Input
							className={styles.lnxFormInput}
							placeholder="Token"
							{...credentials.password}
							type="password"
						/>
						<Button
							style={{ marginTop: '1.5rem' }}
							htmlType="submit"
							type="primary"
							block
							loading={submitting}
						>
							Update
						</Button>
					</form>
				</Col>
			</Row>
		</Row>
	);
}
