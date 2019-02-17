import React, { useContext } from 'react';
import AppInput from '../common/input';
import './index.css';
import { Button } from 'antd';
import { useInput, useValue } from '../../states';
import { Authenticate, IsAuthenticated } from '../../services';
import AppContext from '../../context/app-context';

export default function Login() {
	const context = useContext(AppContext);

	const credentials = {
		username: useInput(),
		password: useInput()
	};

	async function login(e) {
		e.preventDefault();

		let params = {
			username: useValue(credentials.username),
			password: useValue(credentials.password)
		};

		try {
			let {
				data: { token }
			} = await Authenticate(params);
			localStorage.setItem('text_app_token', JSON.stringify(token));
			context.component.renderComponent('Inbox');
		} catch ({
			response: {
				data: { error }
			}
		}) {
			console.log(error);
		}
	}

	return (
		<div className={'lnx-login-container'}>
			<form onSubmit={login}>
				<AppInput
					name="Username"
					inputData={value => {
						credentials.username.handleChange(value);
					}}
					validationRules={[]}
					placeholder="Username"
				/>
				<AppInput
					name="Token"
					inputData={value => {
						credentials.password.handleChange(value);
					}}
					validationRules={[]}
					placeholder="Token"
					type="password"
				/>
				<Button htmlType="submit" type="primary" block>
					Login
				</Button>
			</form>
		</div>
	);
}
