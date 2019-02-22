import React, { useContext } from 'react';
import { Menu, Icon, Row } from 'antd';
import styles from './index.css';
import AppContext from '../context/app-context';
import { getCurrentComponent } from '../services';

export default function SubHeader(props) {
	/**
	 * get global state from the parent
	 */
	const context = useContext(AppContext);

	/**
	 * get the latest component in the localStorage
	 */
	const latestComponent = getCurrentComponent();

	/**
	 * updates the global component
	 */
	function updateComponent(component) {
		context.component.renderComponent(component);
	}

	return (
		<Row id="lnx-sub-header" className={styles.lnxSubHeader}>
			{context.component.isLoggedIn ? (
				<Menu
					mode="horizontal"
					defaultSelectedKeys={[latestComponent.component]}
				>
					<Menu.Item key="Inbox" onClick={() => updateComponent('Inbox')}>
						<Icon type="inbox" />
						Inbox
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
