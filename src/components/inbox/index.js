import React, { useContext } from 'react';
import { Row } from 'antd';
import './index.css';
import SearchBar from '../common/search-bar';
import MessageContainer from './message-container';

export default function Inbox() {
	return (
		<Row className={'lnx-inbox-container'}>
			<SearchBar icon="form" placeholder="Search..." />
			<MessageContainer />
		</Row>
	);
}
