import React, { useContext, useEffect, useState } from 'react';
import { Menu, Icon, Row, Badge } from 'antd';
import styles from './index.css';
import AppContext from '../context/app-context';
import { getCurrentComponent } from '../services';
import { useValue } from '../states';

export default function SubHeader(props) {
	/**
	 * get global state from the parent
	 */
	const context = useContext(AppContext);

	/**
	 * get the latest component in the localStorage
	 */
	const latestComponent = getCurrentComponent();

	const [countNewMessage, changeCountNewMessage] = useState(0);

	/**
	 * updates the global component
	 */
	function updateComponent(component) {
		context.component.renderComponent(component);
	}

	useEffect(() => {
		sumNewMessage();
	}, [useValue(context.newMessageCount)]);

	function sumNewMessage() {
		let currentCount = countNewMessage;
		currentCount += useValue(context.newMessageCount);
		changeCountNewMessage(currentCount);
	}

	return (
		<Row id="lnx-sub-header" className={styles.lnxSubHeader}>
			{context.component.isLoggedIn ? (
				<Menu
					mode="horizontal"
					defaultSelectedKeys={[latestComponent.component]}
				>
					<Menu.Item key="Inbox" onClick={() => updateComponent('Inbox')}>
						<Badge count={countNewMessage}>
							<Icon type="inbox" />
							Inbox
						</Badge>
					</Menu.Item>
					<Menu.Item key="Contacts" onClick={() => updateComponent('Contacts')}>
						<Icon type="team" />
						Contacts
					</Menu.Item>
					<Menu.Item key="Settings" onClick={() => updateComponent('Settings')}>
						<Icon type="setting" />
						Settings
					</Menu.Item>
				</Menu>
			) : (
				''
			)}
		</Row>
	);
}
