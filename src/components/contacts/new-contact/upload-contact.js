import React from 'react';
import { Upload, Icon, Button } from 'antd';
import './index.css';

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
		<Upload {...props} className="upload-container">
			<Button block>
				<Icon type="upload" /> Upload .csv
			</Button>
		</Upload>
	);
}
