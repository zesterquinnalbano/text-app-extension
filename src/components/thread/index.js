import React, { useContext, useEffect, useState, Fragment } from 'react';
import {
	Spin,
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
	message,
	Mention
} from 'antd';
import moment from 'moment';
import InfiniteScroll from 'react-infinite-scroller';
import AppContext from '../../context/app-context';
import './index.css';
import {
	showConversation,
	sendConversation,
	destroyConversation,
	sendNewConversation
} from '../../resources/conversation';
import { listTwilioNumbers } from '../../resources/twilio-numbers';
import { listContact } from '../../resources/contact';
import { debounce } from 'lodash';
import { useInput, useValue } from '../../states';

export default function Thread(props) {
	const { iframeDocument } = useContext(AppContext);

	/**
	 * Information variables
	 */
	const [threadList, changeThreadList] = useState([]);
	const [contactInfo, changeContactInfo] = useState({});
	const [twilioNumbers, changeTwilioNumbers] = useState([]);
	const [recipientOptions, changeRecientOptions] = useState([]);

	/**
	 * Iframe containers
	 */
	const [twilioNumberContainer, changetwilioNumberContainer] = useState(null);
	const [recipentContainer, changeRecipientContainer] = useState(null);

	/**
	 * Search recipient loading status
	 */
	const [searchLoading, changeSearchLoading] = useState(false);

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
	 * Ant Design props
	 */
	const { TextArea } = Input;
	const Option = Select.Option;

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
	 * Get the dropdown html so i can set it to where it belongs
	 */
	useEffect(() => {
		if (twilioNumberContainer != null) {
			if (typeof twilioNumberContainer !== 'undefined') {
				twilioNumberContainer.parentElement.parentElement.parentElement.className =
					'lnx-twilio-number-container';
			}
		}
	}, [twilioNumberContainer, contactInfo, props.contact_id]);

	function handleChangeTwilioNumber() {
		setTimeout(() => {
			changetwilioNumberContainer(
				document.getElementsByClassName('lnx-menu-overlay')[0]
			);
		}, 10);
	}

	useEffect(() => {
		if (recipentContainer != null) {
			if (typeof recipentContainer !== 'undefined') {
				recipentContainer.parentElement.parentElement.className =
					'lnx-recipient-container';
			}
		}
	}, [recipentContainer]);

	function handleChangeRecipientContainer() {
		setTimeout(() => {
			changeRecipientContainer(
				document.getElementsByClassName('ant-select-dropdown')[0]
			);
		}, 10);
	}

	/**
	 * View new message once the conversation is opened
	 */
	useEffect(() => {
		viewNewMessage();
	}, [threadList]);

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
				data: {
					data: { data }
				}
			} = await listContact(inputValue);

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
		let {
			conversation_id,
			contact_number_id,
			message: { value },
			twilio_number_id
		} = messageBody;

		let body = {
			conversation_id: useValue(conversation_id),
			contact_number_id: useValue(contact_number_id),
			twilio_number_id: useValue(twilio_number_id),
			message: value
		};

		try {
			if (body.contact_number_id.length > 1) {
				await sendNewConversation(body);
			} else {
				let {
					data: { data }
				} = await sendConversation(body);
				changeThreadList([...threadList, data]);
				messageBody.message.handleChange(null);
			}
		} catch (error) {}
	}

	/**
	 * Get the twilio numbers
	 */
	async function getTwilioNumbers() {
		try {
			let {
				data: { data }
			} = await listTwilioNumbers();

			changeTwilioNumbers(data);
		} catch (error) {}
	}

	/**
	 * Get the conversation messages
	 *
	 * @param contactId
	 */
	async function getList(contactId) {
		try {
			const {
				data: {
					data: { id, contact_id, twilio_number_id, messages, contact }
				}
			} = await showConversation(contactId);

			let list = messages.map(
				({ message, direction, created_at, user, status }) => {
					let sent_by = null;
					if (user) {
						sent_by = user.firstname;
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

			messageBody.twilio_number_id.handleChange(twilio_number_id);
			messageBody.contact_number_id.handleChange(contact_id);
			messageBody.conversation_id.handleChange(id);
			changeThreadList(list);
			changeContactInfo(contact);
			debounce(viewNewMessage, 50);
		} catch (error) {
			let info = {
				fullname: props.title,
				contact_number: props.description
			};

			changeContactInfo(info);
		}
	}

	/**
	 * Delete conversation
	 */
	async function deleteConversation() {
		try {
			await destroyConversation(messageBody.conversation_id.value);
		} catch (error) {}
	}

	/**
	 * get the container of the thread
	 * then view the lastest message of the thread
	 */
	function viewNewMessage() {
		let thread = iframeDocument.getElementsByClassName('lnx-thread-body')[0];

		thread.scrollTop = thread.scrollHeight;
	}

	return (
		<Row className={'lnx-thread-container'}>
			<Row className={'lnx-thread-header'}>
				<Col span={checkInfo() ? 20 : 24}>
					<div className="lnx-thread-header-recipient-info">
						{checkInfo() ? (
							<Fragment>
								<p
									className={'lnx-thread-header-contact-name'}
									onClick={viewNewMessage}
								>
									{contactInfo.fullname}
								</p>
								<p className={'lnx-thread-header-contact-number'}>
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
								onDropdownVisibleChange={handleChangeRecipientContainer}
								loading={searchLoading}
							>
								{recipientOptions}
							</Select>
						)}
					</div>
				</Col>
				<Col
					span={checkInfo() ? 4 : ''}
					className={'lnx-thread-header-icon-container'}
				>
					{checkInfo() ? (
						<Icon
							onClick={deleteConversation}
							type="delete"
							className={'lnx-thread-header-delete-icon'}
						/>
					) : (
						''
					)}
				</Col>
			</Row>
			<Row className={'lnx-thread-body'}>
				<Col>
					<InfiniteScroll
						className={'lnx-thread-message-inifinite-scroll'}
						initialLoad={false}
						pageStart={1}
						useWindow={false}
						loadMore={() => {
							console.log('loaded');
						}}
					>
						<List
							itemLayout="horizontal"
							dataSource={threadList}
							bordered
							renderItem={item => (
								<Fragment>
									<List.Item
										className={`lnx-thread ${
											item.direction == 'INBOUND'
												? 'lnx-thread-inbound'
												: 'lnx-thread-outbound'
										}`}
									>
										<Card className={'lnx-thread-message-card'}>
											<p className={'lnx-thread-message-content'}>
												{item.message}
											</p>
											<div>
												<p className={'lnx-thread-message-time'}>
													{item.status == 'sent'
														? moment(item.created_at).format('h:mm a')
														: 'Failed'}
												</p>
												{item.direction == 'OUTBOUND' ? (
													<p className={'lnx-thread-message-sender'}>
														{item.sent_by}
													</p>
												) : (
													''
												)}
											</div>
										</Card>
									</List.Item>
								</Fragment>
							)}
						/>
					</InfiniteScroll>
				</Col>
			</Row>
			<Row className={'lnx-thread-textarea'}>
				<Col span={15}>
					<TextArea
						{...messageBody.message}
						placeholder="Write message here..."
						rows={3}
					/>
				</Col>
				<Col span={6} className={'lnx-thread-textarea-send-button-container'}>
					{!Object.keys(threadList).length ? (
						<Dropdown.Button
							type="primary"
							onClick={handleSendMessage}
							overlay={twilioNumbersOption}
							trigger={['click']}
							onVisibleChange={handleChangeTwilioNumber}
						>
							Send
						</Dropdown.Button>
					) : (
						<Button onClick={handleSendMessage} type="primary">
							Send
						</Button>
					)}
				</Col>
			</Row>
		</Row>
	);
}
