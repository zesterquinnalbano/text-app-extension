import React from 'react';
import { List, Row, Icon, Col, Tag } from 'antd';
import InfiniteScroll from 'react-infinite-scroller';

const data = [
	{
		title: 'Contact 1',
		description: 'Message asdasd ...',
		time: '9:30pm'
	},
	{
		title: 'Contact 2',
		description: 'Message asdasd ...',
		time: '9:30pm'
	},
	{
		title: 'Contact 3',
		description: 'Message asdasd ...',
		time: '9:30pm'
	}
];

export default function MessageContainer() {
	return (
		<Row className={'lnx-inbox-message-container'}>
			<Col>
				<InfiniteScroll
					className={'lnx-inbox-message-inifinite-scroll'}
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
								className={'lnx-inbox-message-box'}
								onClick={() => {
									console.log('asd');
								}}
							>
								<List.Item.Meta
									title={item.title}
									description={item.description}
								/>
								<div>
									<Tag color="#f50">
										<Icon type="warning" />
									</Tag>
									<Tag color="#87d068">
										<Icon type="message" />
									</Tag>
									{item.time}
								</div>
							</List.Item>
						)}
					/>
				</InfiniteScroll>
			</Col>
		</Row>
	);
}
