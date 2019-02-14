import React from 'react';
import { Row } from 'antd';
import './index.css';
import SearchBar from '../common/search-bar';
import ContactListContainer from './contact-list-container';

export default function Contacts() {
	return (
		<Row className={'lnx-contacts-container'}>
			<SearchBar placeholder="Search..." />
			<ContactListContainer />
		</Row>
	);
}
