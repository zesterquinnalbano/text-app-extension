import React, { useContext } from 'react';
import { Row } from 'antd';
import './index.css';
import SearchBar from '../common/search-bar';
import MessageContainer from './message-container';
import AppContext from '../../context/app-context';

export default function Inbox() {
	/**
	 * get global state from the parent
	 */
	const context = useContext(AppContext);

	function updateComponent(component) {
		context.component.renderComponent(component);
	}

	return (
		<Row className={'lnx-inbox-container'}>
			<SearchBar
				buttonClicked={() => {
					updateComponent('Thread');
				}}
				buttonText="New message"
				icon="plus"
				placeholder="Search..."
			/>
			<MessageContainer />
		</Row>
	);
}
