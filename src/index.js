/*global chrome*/
import React from 'react';
import ReactDOM from 'react-dom';
import Frame, { FrameContextConsumer } from 'react-frame-component';
import Links from './utils/links';
import 'antd/dist/antd.css';
import './index.css';
import Layout from './layouts';

function Content() {
	return (
		/**
		 * head: array of <link> will be imported to iframe
		 */
		<Frame head={[...Links]}>
			<FrameContextConsumer>
				{/**
				 * Callback is invoked with iframe's window and document instances
				 */
				({ document, window }) => {
					/**
					 * renders that content
					 */
					return <Layout />;
				}}
			</FrameContextConsumer>
		</Frame>
	);
}

/**
 * append the element that will be used in the extension
 */
const app = document.createElement('div');
app.id = 'lnx-app-container';
document.body.appendChild(app);

/**
 * hide the extension in the brower
 */
app.style.display = 'none';

/**
 * receive message on browser action clicked
 */
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	if (request.message === 'clicked_browser_action') {
		toggle();
	}
});

/**
 * toogle extension in browser
 */
function toggle() {
	if (app.style.display === 'none') {
		app.style.display = 'block';
	} else {
		app.style.display = 'none';
	}
}

/**
 * render the app
 */
ReactDOM.render(<Content />, app);