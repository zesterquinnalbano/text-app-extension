import React, { useEffect, Fragment, useContext, useState } from 'react';
import {
	Row,
	Col,
	Button,
	Divider,
	Icon,
	Input,
	InputNumber,
	Alert
} from 'antd';
import { forEach, head } from 'lodash';
import styles from './index.css';
import UploadContact from './upload-contact';
import { useInput, useNumber, useValue } from '../../../states';
import AppContext from '../../../context/app-context';
import {
	editContact,
	storeContact,
	updateContact,
	destroyContact
} from '../../../resources/contact';

export default function NewContact(props) {
	/**
	 * get global context
	 */
	const context = useContext(AppContext);

	const [errorMessage, changeErrorMessage] = useState(null);
	const [submitting, changeSubmitting] = useState(false);

	const { TextArea } = Input;

	const contact = {
		firstname: useInput(),
		lastname: useInput(),
		contact_number: useNumber()
	};

	const data = {
		firstname: useValue(contact.firstname),
		lastname: useValue(contact.lastname),
		contact_number: useValue(contact.contact_number)
	};

	useEffect(() => {
		props.id ? edit() : resetForm();
	}, [props.id]);

	function redirect(props = null) {
		context.component.renderComponent('Contacts', props);
	}

	function resetForm() {
		Object.keys(contact).map(key => {
			contact[key].handleChange('');
		});
	}

	async function store() {
		try {
			changeSubmitting(true);
			changeErrorMessage(null);
			const response = await storeContact(data);
			redirect();
		} catch ({ response: { data } }) {
			changeSubmitting(false);

			let error = Object.values(data).map(values => {
				return <li>{head(values)}</li>;
			});

			changeErrorMessage(<ul className={styles.lnxList}>{error}</ul>);
		}
	}

	async function edit() {
		try {
			const {
				data: { data }
			} = await editContact(props.id);

			Object.keys(contact).map(key => {
				contact[key].handleChange(data[key]);
			});
		} catch (error) {}
	}

	async function update() {
		try {
			await updateContact(props.id, data);
			redirect();
		} catch (error) {}
	}

	async function destroy() {
		try {
			await destroyContact(props.id);
			redirect();
		} catch (error) {}
	}

	/**
	 * Go to conversation
	 */
	function newMessage() {
		context.component.renderComponent('Thread', {
			contact_id: props.id,
			title: props.title,
			description: props.description
		});
	}

	return (
		<Row className="lnx-new-contact-container">
			<form
				onSubmit={function(e) {
					e.preventDefault();
					props.id ? update() : store();
				}}
			>
				<Row className={styles.lnxAddContactHeader}>
					<Col span={props.id ? 14 : 18}>
						<div>
							<p className={styles.title}>
								{props.id ? 'Update' : 'Add'} contact
							</p>
						</div>
					</Col>
					<Col span={props.id ? 8 : 6} className={styles.buttonContainer}>
						{props.id ? (
							<Button onClick={newMessage} type="primary">
								<Icon type="message" theme="filled" />
								Send message
							</Button>
						) : (
							<Button
								loading={submitting}
								htmlType="submit"
								type="default"
								className={styles.save}
							>
								<Icon type="save" theme="filled" />
								Save
							</Button>
						)}
					</Col>
				</Row>
				<Row className={styles.lnxAddContactContent}>
					<Col className={styles.body}>
						{errorMessage ? (
							<Alert
								className={styles.lnxAlert}
								message="Error"
								description={errorMessage}
								type="error"
								showIcon
							/>
						) : (
							''
						)}
						<Input
							className={styles.input}
							{...contact.firstname}
							placeholder="Firstname"
						/>
						<Input
							className={styles.input}
							{...contact.lastname}
							placeholder="Lastname"
						/>
						<InputNumber
							className={styles.inputNumber}
							{...contact.contact_number}
							placeholder="Phone number eg:18002334175"
						/>
						{props.id ? (
							<Row className={styles.actionButton}>
								<Col>
									{/* delete button calls function delete */}
									<Button
										htmlType="button"
										onClick={() => {
											destroy();
										}}
										type="danger"
										className="delete"
									>
										Delete
									</Button>
									<Button
										htmlType="submit"
										type="primary"
										className={styles.update}
									>
										Update
									</Button>
								</Col>
							</Row>
						) : (
							<Fragment>
								<Divider>OR</Divider>
								<UploadContact />
							</Fragment>
						)}
					</Col>
				</Row>
				{/* <Row className={'lnx-add-contact-textarea'}>
					<Col span={18}>
						<TextArea placeholder="Write message here..." rows={3} />
					</Col>
					<Col span={6} className={'icon-container'}>
						<Icon
							onClick={() => {
								console.log('asd');
							}}
							type="right-circle"
							theme="filled"
							className={'send-icon'}
						/>
					</Col>
				</Row> */}
			</form>
		</Row>
	);
}
