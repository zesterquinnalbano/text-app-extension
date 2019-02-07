import React, { useState, useEffect, useContext } from 'react';
import { Menu, Icon, Row } from 'antd';
import style from './index.css';
import Inbox from '../inbox';
import Contacts from '../contacts';
import Settings from '../settings';
import AppContext from '../context/app-context';

function SubHeader(props) {
	/**
	 * ???
	 */
	const context = useContext(AppContext);

	function goToPage(page) {
		props.component(page);
	}

	return (
		<Row className={'lnx-sub-header'}>
			<Menu mode="horizontal" defaultSelectedKeys={['mail']}>
				<Menu.Item key="mail" onClick={() => goToPage(<Inbox />)}>
					<Icon type="inbox" />
					Inbox
				</Menu.Item>
				<Menu.Item key="contact" onClick={() => goToPage(<Contacts />)}>
					<Icon type="team" />
					Contacts
				</Menu.Item>
				<Menu.Item key="setting" onClick={() => goToPage(<Settings />)}>
					<Icon type="setting" />
					Settings
				</Menu.Item>
			</Menu>
		</Row>
	);
}

export default SubHeader;
