import React, { useContext } from 'react';
import { Menu, Icon, Row } from 'antd';
import './index.css';
import Inbox from '../components/inbox';
import Contacts from '../components/contacts';
import Settings from '../components/settings';
import AppContext from '../context/app-context';

export default function SubHeader(props) {
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
		<Row className={'lnx-sub-header'}>
			<Menu mode="horizontal" defaultSelectedKeys={['mail']}>
				<Menu.Item key="mail" onClick={() => updateComponent(Inbox)}>
					<Icon type="inbox" />
					Inbox
				</Menu.Item>
				<Menu.Item key="contact" onClick={() => updateComponent(Contacts)}>
					<Icon type="team" />
					Contacts
				</Menu.Item>
				<Menu.Item key="setting" onClick={() => updateComponent(Settings)}>
					<Icon type="setting" />
					Settings
				</Menu.Item>
			</Menu>
		</Row>
	);
}
