import React from 'react';
import { List } from 'antd';
import InfiniteScroll from 'react-infinite-scroller';
import './index.css';

export default function ListContainer(props) {
	return (
		<InfiniteScroll
			className={'lnx-list-contaner-inifinite-scroll'}
			initialLoad={true}
			pageStart={props.pageStart}
			useWindow={false}
			loadMore={props.loadMore}
		>
			<List
				itemLayout="horizontal"
				dataSource={props.data}
				bordered
				renderItem={function(item) {
					return (
						<List.Item
							className={'lnx-list-container-content'}
							onClick={event => {
								props.selectedRow(item);
							}}
						>
							<List.Item.Meta
								title={item.title}
								description={item.description}
							/>
							{props.rowContent(item)}
						</List.Item>
					);
				}}
			/>
		</InfiniteScroll>
	);
}
