import React, { useEffect, useContext, Fragment, useState } from 'react';
import cx from 'classnames';
import moment from 'moment';
import { Row, List, Col, Button, Input } from 'antd';
import AppContext from '../../context/app-context';
import { listConversation } from '../../resources/conversation';
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
	const [gettingList, changeGettingList] = useState(true);
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
	}, [firstLoad]);

	useEffect(() => {
		if (firstLoad) {
			eventPusher.newMessageRecieved(() => {
				hasNewMessage(true);
			});
			changeFirstLoad(false);
		}
	}, [firstLoad]);

	useEffect(() => {
		if (newMessage) {
			getFreshList();
			hasNewMessage(false);
		}
	}, [newMessage]);

	function handleChangeSearchData(e) {
		getList(e.target.value);
	}

	async function getFreshList() {
		try {
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
			changeGettingList(true);

			const {
				data: { data }
			} = await listConversation({
				limit: pageLimit,
				offset: pageLimit * (pageStart - 1),
				query: searchData
			});

			let list = transformMessage(data);

			changeConversationList(reverse(list));
			changeLoadMoreCount(conversationList.length);
		} catch (error) {}
		changeGettingList(false);
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
				changeLoadMoreCount(conversationList.length);
			}
		} catch (error) {}
	}

	function goToNewMessage() {
		context.component.renderComponent('Thread');
	}

	function getThread({ contact_id }) {
		context.component.renderComponent('Thread', { contact_id });
	}

	function transformMessage(data) {
		return data.map(({ id, message, contact }) => {
			let messageString = message.message.substring(0, 30);

			if (messageString.length >= 30) {
				messageString = messageString.concat('.....', '');
			}

			if (message.new_message == 1) {
				context.newMessageCount.handleChange(1);
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
						loading={gettingList}
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
									{moment(item.created_at).fromNow()}
								</List.Item>
							);
						}}
					/>
				</Col>
				{pageLimit == loadMoreCount ? (
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
