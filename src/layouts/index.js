import React from 'react';
import Router from 'route-lite';
import './index.css';
import AppContext from '../context/app-context';
import { useComponent, useInput } from '../states';
import MainHeader from './main-header';
import SubHeader from './sub-header';

export default function MainLayout({ iframeDocument, iframeWindow }) {
	let state = {
		iframeDocument,
		iframeWindow,

		/**
		 * assign the component passed by the SubHeader
		 * then renders the component
		 */
		component: useComponent(),

		/**
		 * handles the message search
		 */
		search: useInput(),

		/**
		 * count the new message from the inbox
		 */
		newMessageCount: useInput(null)
	};

	return (
		<div className="main-layout">
			<AppContext.Provider value={state}>
				<MainHeader />
				<SubHeader />
				<Router>{state.component.currentComponent}</Router>
			</AppContext.Provider>
		</div>
	);
}
