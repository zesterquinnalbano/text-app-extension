import React, { useContext, useState, useEffect } from 'react';
import { Row, Col } from 'antd';
import AppContext from '../../context/app-context';
import ListContainer from '../common/list-container';
import { listContact } from '../../resources/contact';

export default function ContactListContainer() {
	/**
	 * get global context
	 */
	const context = useContext(AppContext);

	/**
	 * Contact list pagination object
	 */
	const [contactList, changeContactList] = useState([]);

	const [firstLoad, changeFirstLoad] = useState(true);

	useEffect(() => {
		if (firstLoad) {
			getList();
			changeFirstLoad(false);
		}
	}, [firstLoad, ...contactList]);

	function getList() {
		listContact().then(({ data: { data } }) => {
			let list = data.data.map(({ fullname, contact_number, id }) => {
				return {
					id,
					title: fullname,
					description: contact_number
				};
			});

			changeContactList(list);
		});
	}

	function selectedRow(contact) {
		context.component.renderComponent('NewContact', contact);
	}

	return (
		<Row className={'lnx-contacts-container'}>
			<Col>
				<ListContainer
					pageStart={0}
					loadMore={() => {}}
					selectedRow={selectedRow}
					data={contactList}
					rowContent={item => {
						// return (
						// 	<Fragment>
						// 		<Icon
						// 			onClick={() => {
						// 				console.log('asd');
						// 			}}
						// 			type="right-circle"
						// 			theme="filled"
						// 			className={'send-icon'}
						// 		/>
						// 	</Fragment>
						// );
					}}
				/>
			</Col>
		</Row>
	);
}
