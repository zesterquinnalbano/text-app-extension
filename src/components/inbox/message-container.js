import React, { useContext, Fragment } from 'react';
import { List, Row, Icon, Col, Tag } from 'antd';
import InfiniteScroll from 'react-infinite-scroller';
import AppContext from '../../context/app-context';
import Thread from '../thread';
import ListContainer from '../common/list-container';

const data = [
	{
		id: 1,
		title: 'Contact 1',
		description: 'Message asdasd ...',
		time: '9:30pm'
	},
	{
		id: 2,
		title: 'Contact 2',
		description: 'Message asdasd ...',
		time: '9:30pm'
	},
	{
		id: 3,
		title: 'Contact 3',
		description: 'Message asdasd ...',
		time: '9:30pm'
	},
	{
		id: 3,
		title: 'Contact 3',
		description: 'Message asdasd ...',
		time: '9:30pm'
	},
	{
		id: 3,
		title: 'Contact 3',
		description: 'Message asdasd ...',
		time: '9:30pm'
	},
	{
		id: 3,
		title: 'Contact 3',
		description: 'Message asdasd ...',
		time: '9:30pm'
	},
	{
		id: 3,
		title: 'Contact 3',
		description: 'Message asdasd ...',
		time: '9:30pm'
	},
	{
		id: 3,
		title: 'Contact 3',
		description: 'Message asdasd ...',
		time: '9:30pm'
	},
	{
		id: 3,
		title: 'Contact 3',
		description: 'Message asdasd ...',
		time: '9:30pm'
	},
	{
		id: 3,
		title: 'Contact 3',
		description: 'Message asdasd ...',
		time: '9:30pm'
	},
	{
		id: 3,
		title: 'Contact 3',
		description: 'Message asdasd ...',
		time: '9:30pm'
	},
	{
		id: 3,
		title: 'Contact 3',
		description: 'Message asdasd ...',
		time: '9:30pm'
	},
	{
		id: 3,
		title: 'Contact 3',
		description: 'Message asdasd ...',
		time: '9:30pm'
	},
	{
		id: 3,
		title: 'Contact 3',
		description: 'Message asdasd ...',
		time: '9:30pm'
	},
	{
		id: 3,
		title: 'Contact 3',
		description: 'Message asdasd ...',
		time: '9:30pm'
	},
	{
		id: 3,
		title: 'Contact 3',
		description: 'Message asdasd ...',
		time: '9:30pm'
	},
	{
		id: 3,
		title: 'Contact 3',
		description: 'Message asdasd ...',
		time: '9:30pm'
	},
	{
		id: 3,
		title: 'Contact 3',
		description: 'Message asdasd ...',
		time: '9:30pm'
	}
];

export default function MessageContainer() {
	/**
	 * get global context
	 */
	const context = useContext(AppContext);

	/**
	 * get the selected id
	 * then show the thred message
	 *  @params id
	 */
	function getThread(item, e) {
		context.selectedMessage.updateId(item.id);
		context.component.renderComponent(Thread);
	}

	return (
		<Row className={'lnx-inbox-message-container'}>
			<Col>
				<ListContainer
					pageStart={0}
					loadMore={() => {
						console.log('asd');
					}}
					selectedRow={getThread}
					data={data}
					rowContent={item => {
						return (
							<Fragment>
								<Tag color="#f50">
									<Icon type="warning" />
								</Tag>
								<Tag color="#87d068">
									<Icon type="message" />
								</Tag>
								{item.time}
							</Fragment>
						);
					}}
				/>
			</Col>
		</Row>
	);
}
