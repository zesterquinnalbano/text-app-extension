import React, { useEffect, useContext, Fragment, useState } from 'react';
import { Row, Icon, Col, Tag } from 'antd';
import AppContext from '../../context/app-context';
import ListContainer from '../common/list-container';
import { listConversation } from '../../resources/conversation';

// const data = [
// 	{
// 		id: 1,
// 		title: 'Contact 1',
// 		description: 'Message asdasd ...',
// 		time: '9:30pm'
// 	}
// ];

export default function MessageContainer() {
	/**
	 * get global context
	 */
	const context = useContext(AppContext);

	const [conversationList, changeConversationList] = useState([]);

	const [firstLoad, changeFirstLoad] = useState(true);

	useEffect(() => {
		if (firstLoad) {
			getList();
			changeFirstLoad(false);
		}
	}, [firstLoad, ...conversationList]);

	async function getList() {
		try {
			const {
				data: { data }
			} = await listConversation();

			let list = data.data.map(({ id, message, contact }) => {
				return {
					id,
					contact_id: contact.id,
					title: contact.fullname,
					description: message.message,
					created_at: message.created_at
				};
			});

			changeConversationList(list);
		} catch (error) {}
	}

	function getThread(conversation) {
		context.component.renderComponent('Thread', conversation);
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
					data={conversationList}
					rowContent={item => {
						return (
							<Fragment>
								{/* <Tag color="#f50">
									<Icon type="warning" />
								</Tag>
								<Tag color="#3bb54f">
									<Icon type="message" />
								</Tag> */}
								{item.created_at}
							</Fragment>
						);
					}}
				/>
			</Col>
		</Row>
	);
}
