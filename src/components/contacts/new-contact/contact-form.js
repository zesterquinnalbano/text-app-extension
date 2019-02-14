import React, { useEffect, useState, Fragment } from 'react';
import { Row, Col, Button, Divider, Input, InputNumber, Form } from 'antd';
import { useInput, useNumber, useValue } from '../../../states';
import './index.css';
import UploadContact from './upload-contact';
import axios from 'axios';

export default function ContactFrom(props) {
	const [firstLoad, changeFirstLoad] = useState(true);

	useEffect(() => {
		if (firstLoad) {
			if (props.getData.id) {
				editContact();
			}
			changeFirstLoad(false);
		}
	}, [firstLoad, props]);

	function editContact() {
		axios(`contacts/${props.getData.id}/edit`).then(
			({
				data: {
					data: { firstname, lastname, contact_number }
				}
			}) => {
				contact.firstname.handleChange(firstname);
				contact.lastname.handleChange(lastname);
				contact.contact_number.onChange(contact_number);
			}
		);
	}

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

	return (
		<Row className={'lnx-add-contact-content'}>
			<Col className="body">
				<Form.Item>
					<Input {...contact.firstname} placeholder="Firstname" />
				</Form.Item>
				<Form.Item>
					<Input {...contact.lastname} placeholder="Lastname" />
				</Form.Item>
				<Form.Item>
					<InputNumber
						formatter={value => `+${value}`}
						{...contact.contact_number}
						placeholder="Phone number eg:1-8002-334175"
					/>
				</Form.Item>
				{props.getData.id ? (
					<Row className={'action-button'}>
						<Col>
							<Button type="danger" className="delete">
								Delete
							</Button>
							<Button type="primary" className="update">
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
	);
}
