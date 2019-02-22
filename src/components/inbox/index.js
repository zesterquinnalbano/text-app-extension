import React, { useEffect, useContext, Fragment, useState } from 'react';
import cx from 'classnames';
import moment from 'moment';
import { Row, List, Col, Button, Input } from 'antd';
import AppContext from '../../context/app-context';
import {
	listConversation,
	updateNewMessage
} from '../../resources/conversation';
import EventHandler from '../../resources/event-handler';
import { reverse } from 'lodash';
import styles from './index.css';

export default function MessageContainer(props) {
	/**
	 * get global context
	 */
	const context = useContext(AppContext);

	const [conversationList, changeConversationList] = useState([]);

	const [firstLoad, changeFirstLoad] = useState(true);

	const [pageStart, changePageStart] = useState(1);
	const [loadMoreCount, changeLoadMoreCount] = useState(0);

	const [newMessage, hasNewMessage] = useState(false);

	const pageLimit = 25;

	const eventPusher = EventHandler();

	useEffect(() => {
		if (firstLoad) {
			getList();
			changeFirstLoad(false);
		}
	}, [firstLoad, ...conversationList]);

	useEffect(() => {
		if (firstLoad) {
			eventPusher.newMessageRecieved(() => {
				hasNewMessage(true);
			});
			changeFirstLoad(false);
		}
	}, [firstLoad]);

	useEffect(() => {
		getFreshList();
	}, [newMessage]);

	function handleChangeSearchData(e) {
		getList(e.target.value);
	}

	async function getFreshList() {
		try {
			let page = pageStart;

			const {
				data: { data }
			} = await listConversation({
				limit: pageLimit,
				offset: 0
			});

			let list = transformMessage(data);

			changeConversationList(reverse(list));
		} catch (error) {}
	}

	async function getList(searchData = null) {
		try {
			let page = pageStart;

			const {
				data: { data }
			} = await listConversation({
				limit: pageLimit,
				offset: pageLimit * (pageStart - 1),
				query: searchData
			});

			let list = transformMessage(data);

			changeConversationList(reverse(list));
		} catch (error) {}
	}

	async function loadMoreMessages() {
		try {
			let page = pageStart + 1;
			const {
				data: { data }
			} = await listConversation({
				limit: pageLimit,
				offset: pageLimit * (page - 1),
				query: null
			});

			let list = transformMessage(data);

			if (list.length) {
				changeConversationList([...conversationList, ...reverse(list)]);
				changePageStart(page);
			}
		} catch (error) {}
	}

	function goToNewMessage() {
		context.component.renderComponent('Thread');
	}

	function getThread({ contact_id, new_message }) {
		if (new_message == 1) {
			updateNewMessage(contact_id);
		}

		context.component.renderComponent('Thread', { contact_id });
	}

	function transformMessage(data) {
		return data.map(({ id, message, contact }) => {
			let messageString = message.message.substring(0, 30);

			if (messageString.length >= 30) {
				messageString = messageString.concat('.....', '');
			}

			return {
				id,
				contact_id: contact.id,
				title: contact.fullname,
				description: messageString,
				created_at: message.created_at,
				new_message: message.new_message
			};
		});
	}

	return (
		<Row>
			<Row className={styles.lnxSearchBar}>
				<Col span={13}>
					<Input onChange={handleChangeSearchData} placeholder={'Search'} />
				</Col>
				<Col span={11} className={styles.lnxSearchBarButtonContainer}>
					<Button onClick={goToNewMessage} type="primary">
						New Message
					</Button>
				</Col>
			</Row>
			<Row className={styles.lnxInboxMessageContainer}>
				<Col>
					<List
						itemLayout="horizontal"
						dataSource={conversationList}
						bordered
						renderItem={function(item) {
							return (
								<List.Item
									className={cx(
										styles.lnxListContainerContent,
										item.new_message == 1 ? styles.lnxNewMessage : ''
									)}
									onClick={event => {
										getThread(item);
									}}
								>
									<List.Item.Meta
										title={item.title}
										description={item.description}
									/>
									{moment(item.created_at).format('hh:mm a')}
								</List.Item>
							);
						}}
					/>
				</Col>
				{pageLimit == conversationList.length ? (
					<Col className={styles.lnxLoadMoreContainer}>
						<Button onClick={loadMoreMessages} type="primary">
							Load More
						</Button>
					</Col>
				) : (
					''
				)}
			</Row>
		</Row>
	);
}
