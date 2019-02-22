import React, { useEffect, useState } from 'react';
import { Input, Row, Col, Button } from 'antd';
import styles from './index.css';
import { useInput } from '../../states';

export default function SearchBar(props) {
	let [searchData, changeSearchData] = useState(null);

	function handleChange(e) {
		changeSearchData(e.target.value);
		props.data(searchData);
	}

	return (
		<Row className={styles.lnxSearchBar}>
			<Col span={props.buttonText ? 13 : 24}>
				<Input
					value={searchData}
					onChange={handleChange}
					placeholder={props.placeholder}
				/>
			</Col>
			<Col span={11} className={styles.lnxSearchBarButtonContainer}>
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
