import React, { useEffect, Fragment, useContext } from 'react';
import { Row, Col, Button, Divider, Icon, Input, InputNumber } from 'antd';
import './index.css';
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
			await storeContact(data);
			redirect();
		} catch (error) {}
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
			descriptio: props.description
		});
	}

	return (
		<Row className="lnx-new-contact-container">
			{/**
			 * if page doesn't receive data, form action store() will trigger
			 * else update() will trigger when submitting
			 */}
			<form
				onSubmit={function(e) {
					e.preventDefault();
					props.id ? update() : store();
				}}
			>
				<Row className={'lnx-add-contact-header'}>
					<Col span={props.id ? 14 : 18}>
						<div>
							<p className="title">{props.id ? 'Update' : 'Add'} contact</p>
						</div>
					</Col>
					<Col span={props.id ? 8 : 6} className={'button-container'}>
						{props.id ? (
							<Button onClick={newMessage} type="primary">
								<Icon type="message" theme="filled" />
								Send message
							</Button>
						) : (
							<Button htmlType="submit" type="default" className="save">
								<Icon type="save" theme="filled" />
								Save
							</Button>
						)}
					</Col>
				</Row>
				<Row className={'lnx-add-contact-content'}>
					<Col className="body">
						<Input {...contact.firstname} placeholder="Firstname" />
						<Input {...contact.lastname} placeholder="Lastname" />
						<InputNumber
							formatter={value => `+${value}`}
							{...contact.contact_number}
							placeholder="Phone number eg:1-8002-334175"
						/>
						{props.id ? (
							<Row className={'action-button'}>
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
									<Button htmlType="submit" type="primary" className="update">
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
