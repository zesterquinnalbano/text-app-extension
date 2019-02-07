import React from 'react';
import { Row } from 'antd';
import './index.css';
import SearchBar from './seacrh-bar';
import MessageContainer from './message-container';

export default function Inbox() {
	return (
		<Row className={'lnx-inbox-container'}>
			<SearchBar />
			<MessageContainer />
		</Row>
	);
}
