import React from 'react';
import { Input, Row, Col, Button } from 'antd';
import './index.css';

export default function SearchBar(props) {
	return (
		<Row className={'lnx-search-bar'}>
			<Col span={props.buttonText ? 13 : 24}>
				<Input placeholder={props.placeholder} />
			</Col>
			<Col span={11} className={'lnx-search-bar-button-container'}>
				{/* check if buttonText is initialize */}
				{props.buttonText ? (
					<Button onClick={props.buttonClicked} type="primary">
						{props.buttonText}
					</Button>
				) : (
					''
				)}
			</Col>
		</Row>
	);
}
