import React, { useContext, useEffect, useState, Fragment } from 'react';
import cx from 'classnames';
import {
	Row,
	List,
	Input,
	Icon,
	Col,
	Card,
	Select,
	Menu,
	Dropdown,
	Button,
	message
} from 'antd';
import moment from 'moment';
import AppContext from '../../context/app-context';
import styles from './index.css';
import {
	showConversation,
	sendConversation,
	destroyConversation,
	sendNewConversation,
	updateNewMessage
} from '../../resources/conversation';
import EventHandler from '../../resources/event-handler';
import { listTwilioNumbers } from '../../resources/twilio-numbers';
import { listContact } from '../../resources/contact';
import { debounce, reverse, head } from 'lodash';
import { useInput, useValue } from '../../states';

export default function Thread(props) {
	const {
		iframeWindow,
		iframeDocument,
		component,
		newMessageCount
	} = useContext(AppContext);

	/**
	 * Information variables
	 */
	const [threadList, changeThreadList] = useState([]);
	const [contactInfo, changeContactInfo] = useState({});
	const [twilioNumbers, changeTwilioNumbers] = useState([]);
	const [recipientOptions, changeRecientOptions] = useState([]);

	/**
	 * Loading States
	 */
	const [searchLoading, changeSearchLoading] = useState(false);
	const [sendingMessage, changeSendingMessage] = useState(false);
	const [gettingList, changeGettingList] = useState(true);

	/**
	 * Load more page start
	 */
	const [pageStart, changePageStart] = useState(1);
	const [loadMoreCount, changeLoadMoreCount] = useState(0);
	const [firstLoad, changeFirstLoad] = useState(true);

	/**
	 * Message body content to be sent to the backend
	 */
	const messageBody = {
		conversation_id: useInput(),
		contact_number_id: useInput([]),
		message: useInput(),
		twilio_number_id: useInput(),
		sending: useState(false)
	};

	/**
	 * message limit
	 */
	const pageLimit = 15;

	/**
	 * instantiate the Pusher
	 */
	const eventPusher = EventHandler();

	/**
	 * Ant Design props
	 */
	const { TextArea } = Input;
	const Option = Select.Option;

	/**
	 * instantiate the Pusher
	 */
	useEffect(() => {
		if (firstLoad) {
			getNewMessage();
			changeFirstLoad(false);
		}
	}, [firstLoad]);

	/**
	 * Check if props has receive a contact_id
	 * if so it will get the coversation thread
	 * else it will get the twilio numbers
	 */
	useEffect(() => {
		if (!checkInfo() && props.contact_id) {
			getList(props.contact_id);
		} else {
			getTwilioNumbers();
		}
		messageBody.contact_number_id.handleChange(props.contact_id);
	}, [contactInfo, props.contact_id]);

	/**
	 * View new message once the conversation is opened
	 */
	useEffect(() => {
		viewNewMessage();
		(async () => {
			await updateNewMessage(props.contact_id);
		})();
	}, [contactInfo]);

	/**
	 * Check if there is an existing contact info
	 *
	 * @return Boolean
	 */
	function checkInfo() {
		return Object.keys(contactInfo).length ? true : false;
	}

	/**
	 * Updates the message reciepients
	 *
	 */
	function updateRecipientOptions(recipientIds) {
		messageBody.contact_number_id.handleChange(recipientIds);
	}

	/**
	 * Updates the message sender
	 *
	 */
	function updateTwilioNumberId({ key }) {
		messageBody.twilio_number_id.handleChange(key);
	}

	/**
	 * Containes the twilio number options
	 *
	 * @returns RsJX
	 */
	function twilioNumbersOption() {
		return (
			<Menu className={'lnx-menu-overlay'} onClick={updateTwilioNumberId}>
				{twilioNumbers.map(({ id, contact_number }) => {
					return (
						<Menu.Item key={id}>
							<Icon type="user" />
							{contact_number}
						</Menu.Item>
					);
				})}
			</Menu>
		);
	}

	/**
	 * Search for the reciepient of the message
	 *
	 * @returns RsJX
	 */
	async function searchRecipient(inputValue) {
		try {
			changeSearchLoading(true);
			changeRecientOptions([]);
			let {
				data: { data }
			} = await listContact({
				limit: 100,
				offset: 0,
				query: inputValue
			});

			if (data.length) {
				let list = data.map(({ id, fullname }) => {
					return <Option key={id}>{fullname}</Option>;
				});

				changeRecientOptions(list);
			} else {
				changeRecientOptions([]);
			}
			changeSearchLoading(false);
		} catch (error) {}
	}

	/**
	 * Send's the message
	 */
	async function handleSendMessage() {
		let messageContent = {};

		Object.keys(messageBody).map(keys => {
			messageContent[keys] = useValue(messageBody[keys]);
		});

		changeSendingMessage(true);

		try {
			if (typeof messageContent.contact_number_id == 'object') {
				await sendNewConversation(messageContent);
				component.renderComponent('Inbox');
			} else {
				let {
					data: { data }
				} = await sendConversation(messageContent);

				messageBody.conversation_id.handleChange(data.conversation_id);
				messageBody.message.handleChange(null);

				changeSendingMessage(false);
				changeThreadList([...threadList, data]);
				changeLoadMoreCount(threadList.length);
				viewNewMessage();
			}
		} catch (error) {
			changeSendingMessage(false);
		}
	}

	/**
	 * Get the twilio numbers
	 */
	async function getTwilioNumbers() {
		try {
			let {
				data: { data }
			} = await listTwilioNumbers();
			let twilioNumber = head(data);
			messageBody.twilio_number_id.handleChange(twilioNumber.id);
			changeTwilioNumbers(data);
		} catch (error) {}
	}

	/**
	 * check if new message has arrived
	 */
	function getNewMessage() {
		eventPusher.newMessageRecieved(
			({
				data: {
					conversation: { contact_id }
				}
			}) => {
				if (props.contact_id == contact_id) {
					getList(contact_id);
				}
			}
		);
	}

	/**
	 * Get the conversation messages
	 *
	 * @param contactId
	 */
	async function getList(contactId) {
		try {
			let page = pageStart;
			changeGettingList(true);

			const {
				data: {
					data: { id, contact_id, twilio_number_id, messages, contact }
				}
			} = await showConversation(contactId, {
				limit: pageLimit,
				offset: pageLimit * (page - 1)
			});

			let list = transformMessage(messages);

			let messageBodyInfo = { id, twilio_number_id, contact_id };

			messageBody.conversation_id.handleChange(messageBodyInfo.id);
			Object.keys(messageBody).map(keys => {
				if (messageBody[keys] == messageBodyInfo[keys])
					messageBody[keys].handleChange(messageBodyInfo[keys]);
			});

			changeThreadList(reverse(list));
			changeContactInfo(contact);
			changePageStart(++page);
			changeLoadMoreCount(list.length);
		} catch (error) {
			let info = {
				fullname: props.title,
				contact_number: props.description
			};

			changeContactInfo(info);
		}

		changeGettingList(false);
	}

	/**
	 * Delete conversation
	 */
	async function deleteConversation() {
		try {
			await destroyConversation(messageBody.conversation_id.value);
			component.renderComponent('Inbox');
		} catch (error) {}
	}

	/**
	 * load more message
	 */
	async function loadMoreMessages() {
		try {
			let page = pageStart;
			changeGettingList(true);
			const {
				data: {
					data: { messages }
				}
			} = await showConversation(props.contact_id, {
				limit: pageLimit,
				offset: pageLimit * (page - 1)
			});

			let list = transformMessage(messages);

			changeThreadList([...reverse(list), ...threadList]);
			changePageStart(++page);
			changeLoadMoreCount(list.length);
		} catch (error) {}

		changeGettingList(false);
	}

	/**
	 * transform message given by the backend data
	 */
	function transformMessage(messages) {
		return messages.map(
			({ message, direction, created_at, user, status, new_message }) => {
				let sent_by = null;
				if (user) {
					sent_by = user.firstname;
				}
				if (new_message == 1) {
					newMessageCount.handleChange(-1);
				}
				return {
					message,
					direction,
					created_at,
					sent_by,
					status
				};
			}
		);
	}

	/**
	 * get the container of the thread
	 * then view the lastest message of the thread
	 */
	function viewNewMessage() {
		let thread = iframeDocument.getElementsByClassName(styles.lnxThreadBody)[0];

		thread.scrollTop = thread.scrollHeight;
	}

	return (
		<Row className={'lnx-thread-container'}>
			<Row className={styles.lnxThreadHeader}>
				<Col span={checkInfo() ? 20 : 24}>
					<div
						id="lnx-thread-header-recipient-info"
						className={'lnx-thread-header-recipient-info'}
					>
						{checkInfo() ? (
							<Fragment>
								<p
									className={styles.lnxThreadHeaderContactName}
									onClick={viewNewMessage}
								>
									{contactInfo.fullname}
								</p>
								<p className={styles.lnxThreadHeaderContactNumber}>
									{contactInfo.contact_number}
								</p>
							</Fragment>
						) : (
							<Select
								mode="multiple"
								showSearch
								style={{ width: '100%' }}
								placeholder="Add recipient"
								onChange={debounce(updateRecipientOptions, 50)}
								onSearch={debounce(searchRecipient, 50)}
								filterOption={false}
								loading={searchLoading}
								getPopupContainer={() =>
									iframeDocument.getElementById(
										'lnx-thread-header-recipient-info'
									)
								}
							>
								{recipientOptions}
							</Select>
						)}
					</div>
				</Col>
				<Col
					span={checkInfo() && threadList.length ? 4 : ''}
					className={styles.lnxThreadHeaderIconContainer}
				>
					{checkInfo() && threadList.length ? (
						<Icon
							onClick={deleteConversation}
							type="delete"
							className={styles.lnxThreadHeaderDeleteIcon}
						/>
					) : (
						''
					)}
				</Col>
			</Row>
			<Row className={styles.lnxThreadBody}>
				<Col>
					{loadMoreCount == pageLimit ? (
						<Button
							className={styles.lnxLoadMoreButton}
							type="default"
							onClick={loadMoreMessages}
						>
							Load more
						</Button>
					) : (
						''
					)}
					<List
						itemLayout="horizontal"
						dataSource={threadList}
						bordered
						className={styles.antSpinContainer}
						loading={gettingList}
						renderItem={item => (
							<Fragment>
								<List.Item
									className={cx(
										styles.lnxThread,
										item.direction == 'INBOUND'
											? styles.lnxThreadInbound
											: styles.lnxThreadOutbound
									)}
								>
									<Card className={styles.lnxThreadMessageCard}>
										<p className={styles.lnxThreadMessageContent}>
											{item.message}
										</p>
										<p className={styles.lnxThreadMessageTime}>
											{item.status == 'delivered' ||
											item.status != 'undelivered' ||
											item.status == 'recieved'
												? moment(item.created_at).fromNow()
												: 'Failed'}
										</p>
										<br />
										{item.direction == 'OUTBOUND' ? (
											<p className={styles.lnxThreadMessageSender}>
												Sent by {item.sent_by}
											</p>
										) : (
											''
										)}
									</Card>
								</List.Item>
							</Fragment>
						)}
					/>
				</Col>
			</Row>
			<Row className={styles.lnxThreadTextarea}>
				<Col span={15}>
					<TextArea
						{...messageBody.message}
						placeholder="Write message here..."
						rows={3}
					/>
				</Col>
				<Col
					span={6}
					id="area"
					className={styles.lnxThreadTextareaSendButtonContainer}
				>
					{!Object.keys(threadList).length ? (
						<Dropdown.Button
							type="primary"
							onClick={handleSendMessage}
							overlay={twilioNumbersOption}
							trigger={['click']}
							disabled={sendingMessage}
							getPopupContainer={() => iframeDocument.getElementById('area')}
							placement="topLeft"
						>
							Send
						</Dropdown.Button>
					) : (
						<Button
							loading={sendingMessage}
							onClick={handleSendMessage}
							type="primary"
						>
							Send
						</Button>
					)}
				</Col>
			</Row>
		</Row>
	);
}
