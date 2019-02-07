import React from 'react';
import { Input, Row, Icon, Col } from 'antd';

export default function SearchBar(props) {
	return (
		<Row className={'lnx-inbox-search'}>
			<Col span={20}>
				<Input placeholder="Search..." />
			</Col>
			<Col span={4} className={'lnx-inbox-search-icon-container'}>
				<Icon
					onClick={() => {
						console.log('asd');
					}}
					type="form"
					className={'lnx-inbox-search-icon'}
				/>
			</Col>
		</Row>
	);
}
