import React, { useContext } from 'react';
import { Icon, Row, Layout, Button } from 'antd';
import styles from './index.css';
import AppContext from '../context/app-context';
import 'antd/dist/antd.css';

export default function MainHeader() {
	const { Header } = Layout;

	/**
	 * get global state from the parent
	 */
	const context = useContext(AppContext);

	/**
	 * updates the global component
	 */
	function updateComponent(component) {
		context.component.renderComponent(component);
	}

	return (
		<Row className={styles.lnxMainHeader}>
			<Header>
				{context.component.isLoggedIn ? (
					<Button
						onClick={() => {
							updateComponent('NewContact');
						}}
						className={styles.lnxAddContactButton}
						type="primary"
					>
						<Icon type="user-add" />
						New Contact
					</Button>
				) : (
					''
				)}

				<Icon
					onClick={() => {
						console.log('clicked');
					}}
					className={styles.lnxCloseIcon}
					type="close"
				/>
			</Header>
		</Row>
	);
}
