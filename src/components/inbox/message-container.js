import React, { useEffect, useContext, Fragment, useState } from 'react';
import { Row, Icon, Col, Tag } from 'antd';
import AppContext from '../../context/app-context';
import ListContainer from '../common/list-container';
import { listConversation } from '../../resources/conversation';
import moment from 'moment';
import EventHandler from '../../resources/event-handler';
import { reverse } from 'lodash';

const ev = EventHandler();
ev.newMessageRecieved();

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
	}, [firstLoad, conversationList]);

	async function getList() {
		try {
			const {
				data: { data }
			} = await listConversation();

			let list = data.data.map(({ id, message, contact }) => {
				let messageString = message.message.substring(0, 30);

				if (messageString.length >= 30) {
					messageString = messageString.concat('.....', '');
				}

				return {
					id,
					contact_id: contact.id,
					title: contact.fullname,
					description: messageString,
					created_at: message.created_at
				};
			});

			changeConversationList(reverse(list));
		} catch (error) {}
	}

	function getThread({ contact_id }) {
		context.component.renderComponent('Thread', { contact_id });
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
								{moment(item.created_at).format('hh:mm a')}
							</Fragment>
						);
					}}
				/>
			</Col>
		</Row>
	);
}
