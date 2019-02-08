import React from 'react';
import { Input, Row, Icon, Col } from 'antd';
import './index.css';

export default function SearchBar(props) {
	return (
		<Row className={'lnx-search-bar'}>
			<Col span={props.icon ? 20 : 24}>
				<Input placeholder={props.placeholder} />
			</Col>
			<Col span={4} className={'lnx-search-bar-icon-container'}>
				{/* check if icon is initialize */}
				{props.icon ? (
					<Icon
						onClick={() => {
							console.log('asd');
						}}
						type={props.icon}
						className={'lnx-search-bar-icon'}
					/>
				) : (
					''
				)}
			</Col>
		</Row>
	);
}
