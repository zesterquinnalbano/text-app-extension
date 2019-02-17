import React, { useContext } from 'react';
import { Icon, Row, Layout, Button } from 'antd';
import './index.css';
import AppContext from '../context/app-context';
import { IsAuthenticated } from '../services';
import { debounce } from 'lodash';

export default function MainHeader() {
	const { Header } = Layout;

	/**
	 * get global state from the parent
	 */
	const context = useContext(AppContext);

	/**
	 * updates the global component
	 */
	function updateComponent(component) {
		context.component.renderComponent(component);
	}

	return (
		<Row className={'lnx-main-header'}>
			<Header>
				<Button
					onClick={() => {
						updateComponent('NewContact');
					}}
					className={'lnx-add-contact-button'}
					type="primary"
				>
					<Icon type="user-add" />
					New Contact
				</Button>
				<Icon
					onClick={() => {
						console.log('clicked');
					}}
					className={'lnx-close-icon'}
					type="close"
				/>
			</Header>
		</Row>
	);
}
