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
import { useInput } from '../../states';

export default function Thread(props) {
	const { iframeDocument } = useContext(AppContext);
	const [threadList, changeThreadList] = useState([]);
	const [contactInfo, changeContactInfo] = useState({});
	const [twilioNumbers, changeTwilioNumbers] = useState([]);
	const [twilioNumberContainer, changetwilioNumberContainer] = useState(null);
	const [recipentContainer, changeRecipientContainer] = useState(null);
	const [recipientOptions, changeRecientOptions] = useState([]);
	const [searchLoading, changeSearchLoading] = useState(false);

	const messageBody = {
		contact_number_id: useInput([]),
		message: useInput(),
		twilio_number_id: useInput(),
		sending: useState(false)
	};
	const { TextArea } = Input;
	const Option = Select.Option;

	useEffect(() => {
		if (!checkInfo() && props.id) {
			console.log(props);
			getList();
		} else {
			getTwilioNumbers();
		}
		messageBody.contact_number_id.handleChange(props.contact_id);
	}, [contactInfo, props.id]);

	useEffect(() => {
		if (twilioNumberContainer != null) {
			if (typeof twilioNumberContainer !== 'undefined') {
				twilioNumberContainer.parentElement.parentElement.parentElement.className =
					'lnx-twilio-number-container';
			}
		}
	}, [twilioNumberContainer, contactInfo, props.id]);

	useEffect(() => {
		if (recipentContainer != null) {
			if (typeof recipentContainer !== 'undefined') {
				recipentContainer.parentElement.parentElement.className =
					'lnx-recipient-container';
			}
		}
	}, [recipentContainer]);

	useEffect(() => {
		viewNewMessage();
	}, [threadList]);

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

	function updateRecipientOptions(recipientId) {
		messageBody.contact_number_id.handleChange(recipientId);
	}

	function handleSendMessage() {
		let {
			contact_number_id,
			message: { value },
			twilio_number_id
		} = messageBody;

		let body = {
			contact_number_id: contact_number_id.value,
			twilio_number_id: twilio_number_id.value,
			message: value
		};

		sendMessage(body);
	}

	async function sendMessage(body) {
		try {
			if (body.contact_number_id.length > 1) {
				await sendNewConversation(body);
			} else {
				let {
					data: { data }
				} = await sendConversation(body);
				changeThreadList([...threadList, data]);
			}
		} catch (error) {}
	}

	function twilioNumbersOption() {
		return (
			<Menu className={'lnx-menu-overlay'} onClick={setTwilioNumberId}>
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

	function setTwilioNumberId(twilioNumber) {
		messageBody.twilio_number_id.handleChange(twilioNumber.key);
	}

	function handleChangeTwilioNumber() {
		setTimeout(() => {
			changetwilioNumberContainer(
				document.getElementsByClassName('lnx-menu-overlay')[0]
			);
		}, 10);
	}

	function handleChangeRecipientContainer() {
		setTimeout(() => {
			changeRecipientContainer(
				document.getElementsByClassName('ant-select-dropdown')[0]
			);
		}, 10);
	}

	function checkInfo() {
		return Object.keys(contactInfo).length ? true : false;
	}

	async function getTwilioNumbers() {
		try {
			let {
				data: { data }
			} = await listTwilioNumbers();

			changeTwilioNumbers(data);
		} catch (error) {}
	}

	async function getList() {
		try {
			const {
				data: {
					data: { contact_id, twilio_number_id, messages, contact }
				}
			} = await showConversation(props.contact_id);

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

	function viewNewMessage() {
		/**
		 * get the container of the thread
		 */
		let thread = iframeDocument.getElementsByClassName('lnx-thread-body')[0];

		/**
		 * view the lastest message of the thread
		 */
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
								// value={[]}
								showSearch
								style={{ width: '100%' }}
								placeholder="Add recipient"
								onChange={debounce(updateRecipientOptions, 50)}
								onSearch={debounce(searchRecipient, 60)}
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
					<Icon
						onClick={() => {
							console.log('asd');
						}}
						theme="filled"
						type="trash"
						className={'lnx-thread-header-add-icon'}
					/>
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
