import React from 'react';
import { Icon, Row, Layout, Button } from 'antd';
import './index.css';

export default function MainHeader() {
	const { Header } = Layout;

	return (
		<Row className={'lnx-main-header'}>
			<Header>
				<Button className={'lnx-add-contact-button'} type="primary">
					<Icon type="user-add" />
					Add Contact
				</Button>
				<Icon
					onClick={() => {
						console.log('clicked');
					}}
					className={'lnx-close-icon'}
					type="close"
				/>
			</Header>
		</Row>
	);
}
