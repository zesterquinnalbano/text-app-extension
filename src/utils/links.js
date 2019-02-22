/*global chrome*/
import React from 'react';

const Links = [
	<link
		type="text/css"
		rel="stylesheet"
		href={chrome.runtime.getURL('/static/css/content.css')}
	/>,
	// <link
	// 	type="text/css"
	// 	rel="stylesheet"
	// 	href={chrome.runtime.getURL('/static/css/app.css')}
	// />
	// <link
	// 	type="text/css"
	// 	rel="stylesheet"
	// 	href={chrome.runtime.getURL('/static/css/0.chunk.css')}
	// />,
	<link
		type="text/css"
		rel="stylesheet"
		href={'https://cdnjs.cloudflare.com/ajax/libs/antd/3.13.3/antd.css'}
	/>
];

export default Links;
