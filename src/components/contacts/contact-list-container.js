import React, { useContext, Fragment } from 'react';
import { List, Row, Icon, Col, Tag } from 'antd';
import AppContext from '../../context/app-context';
import ListContainer from '../common/list-container';

const data = [
	{
		id: 1,
		title: 'Contact 1',
		description: '09152597181'
	},
	{
		id: 2,
		title: 'Contact 2',
		description: '09152597181'
	},
	{
		id: 3,
		title: 'Contact 3',
		description: '09152597181'
	}
];

export default function ContactListContainer() {
	/**
	 * get global context
	 */
	const context = useContext(AppContext);

	function getId(item) {
		console.log(item);
	}

	return (
		<Row className={'lnx-contacts-container'}>
			<Col>
				<ListContainer
					pageStart={0}
					loadMore={() => {}}
					selectedRow={getId}
					data={data}
					rowContent={item => {
						return (
							<Fragment>
								<Tag color="#87d068">
									<Icon type="message" />
								</Tag>
							</Fragment>
						);
					}}
				/>
			</Col>
		</Row>
	);
}
