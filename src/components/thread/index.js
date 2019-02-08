import React, { useContext } from 'react';
import { Row, List, Input, Tag, Icon, Col, Card } from 'antd';
import InfiniteScroll from 'react-infinite-scroller';
import AppContext from '../../context/app-context';
import './index.css';

export default function Thread() {
	const { TextArea } = Input;

	/**
	 * get the thread id
	 */
	const { selectedMessage } = useContext(AppContext);

	const data = [
		{
			id: 1,
			message: 'asdaasdasdasdasdasdasdasdasdasdasdasdasasdasasdasdsd'
		},
		{
			id: 2,
			message: 'asd3asdasdasdaasdasdasdasdasdasdasdadasdsd'
		},
		{
			id: 3,
			message: 'asdasdasdasdasd'
		}
	];

	return (
		<Row className={'lnx-thread-container'}>
			<Row className={'lnx-thread-header'}>
				<Col span={20}>
					<div className="lnx-thread-header-recipient-info">
						<p className={'lnx-thread-header-contact-name'}>Zester Quinn</p>
						<p className={'lnx-thread-header-contact-number'}>123123123</p>
					</div>
				</Col>
				<Col span={4} className={'lnx-thread-header-icon-container'}>
					<Icon
						onClick={() => {
							console.log('asd');
						}}
						type="plus"
						className={'lnx-thread-header-add-icon'}
					/>
				</Col>
			</Row>
			<Row className={'lnx-thread-body'}>
				<Col>
					<InfiniteScroll
						className={'lnx-thread-message-inifinite-scroll'}
						initialLoad={false}
						pageStart={0}
						useWindow={false}
						loadMore={() => {
							console.log('loaded');
						}}
					>
						<List
							itemLayout="horizontal"
							dataSource={data}
							bordered
							renderItem={item => (
								<List.Item
									className={`lnx-thread ${
										item.id % 2 == 0
											? 'lnx-thread-inbound'
											: 'lnx-thread-outbound'
									}`}
								>
									<Card className={'lnx-thread-message-card'}>
										<p className={'lnx-thread-message-content'}>
											{item.message}
										</p>
										<p className={'lnx-thread-message-time'}>9:50pm</p>
									</Card>
									<br />
								</List.Item>
							)}
						/>
					</InfiniteScroll>
				</Col>
			</Row>
			<Row className={'lnx-thread-textarea'}>
				<Col span={18}>
					<TextArea placeholder="Write message here..." rows={3} />
				</Col>
				<Col span={6} className={'lnx-thread-textarea-icon-container'}>
					<Icon
						onClick={() => {
							console.log('asd');
						}}
						type="right-circle"
						theme="filled"
						className={'lnx-thread-textarea-send-icon'}
					/>
				</Col>
			</Row>
		</Row>
	);
}
