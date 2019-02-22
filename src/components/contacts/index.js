import React, { useContext, useState, useEffect } from 'react';
import { reverse } from 'lodash';
import { Row, Col, List, Input, Button } from 'antd';
import AppContext from '../../context/app-context';
import { listContact } from '../../resources/contact';
import styles from './index.css';

export default function ContactListContainer() {
	/**
	 * get global context
	 */
	const context = useContext(AppContext);

	/**
	 * Contact list pagination object
	 */
	const [contactList, changeContactList] = useState([]);

	const [pageStart, changePageStart] = useState(1);

	const [firstLoad, changeFirstLoad] = useState(true);
	const pageLimit = 25;

	useEffect(() => {
		if (firstLoad) {
			getList();
			changeFirstLoad(false);
		}
	}, [firstLoad, ...contactList]);

	async function getList(searchData = null) {
		try {
			const {
				data: { data }
			} = await listContact({
				limit: pageLimit,
				offset: pageLimit * (pageStart - 1),
				query: searchData
			});

			let list = transformMessage(data);

			changeContactList(list);
		} catch (error) {}
	}

	async function loadMoreMessages() {
		try {
			let page = pageStart + 1;
			const {
				data: { data }
			} = await listContact({
				limit: pageLimit,
				offset: pageLimit * (page - 1),
				query: null
			});

			let list = transformMessage(data);

			if (list.length) {
				changeContactList([...contactList, ...reverse(list)]);
				changePageStart(page);
			}
		} catch (error) {}
	}

	function transformMessage(data) {
		return data.map(({ fullname, contact_number, id }) => {
			return {
				id,
				contact_id: id,
				title: fullname,
				description: contact_number
			};
		});
	}

	function selectedRow(contact) {
		context.component.renderComponent('NewContact', contact);
	}

	function handleChangeSearchData(e) {
		getList(e.target.value);
	}

	return (
		<Row>
			<Row className={styles.lnxSearchBar}>
				<Col>
					<Input onChange={handleChangeSearchData} placeholder={'Search'} />
				</Col>
			</Row>
			<Row className={styles.lnxContactListContainer}>
				<Col>
					<List
						itemLayout="horizontal"
						dataSource={contactList}
						bordered
						renderItem={function(item) {
							return (
								<List.Item
									className={styles.lnxListContainerContent}
									onClick={event => {
										selectedRow(item);
									}}
								>
									<List.Item.Meta
										title={item.title}
										description={item.description}
									/>
								</List.Item>
							);
						}}
					/>
				</Col>
				{pageLimit == contactList.length ? (
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
