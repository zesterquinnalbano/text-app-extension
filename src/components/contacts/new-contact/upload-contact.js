import React from 'react';
import { Upload, Icon, Button } from 'antd';
import styles from './index.css';

export default function UploadContact() {
	const props = {
		onRemove: file => {
			return file;
		},
		beforeUpload: file => {
			return file;
		}
	};

	return (
		<Upload {...props} className={styles.uploadContainer}>
			<Button block>
				<Icon type="upload" /> Upload .csv
			</Button>
		</Upload>
	);
}
