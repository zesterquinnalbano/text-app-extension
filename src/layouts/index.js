import React, { useEffect, useState } from 'react';
import Router from 'route-lite';
import axios from 'axios';
import './index.css';
import AppContext from '../context/app-context';
import { useComponent, useLogin } from '../states';
import MainHeader from './main-header';
import SubHeader from './sub-header';
import { IsAuthenticated } from '../services';

export default function MainLayout({ iframeDocument, iframeWindow }) {
	let state = {
		/**
		 * assign the component passed by the SubHeader
		 * then renders the component
		 */
		component: useComponent(),
		/**
		 * get the iframe document body
		 */
		iframeDocument,
		loginStatus: useLogin()
	};

	/**
	 * Axios global config defaults
	 */
	axios.defaults.baseURL = 'http://localhost:8000';
	axios.defaults.headers.common['Authorization'] = JSON.stringify(
		localStorage.getItem('text_app_token')
	);
	axios.defaults.headers.post['Content-Type'] =
		'application/x-www-form-urlencoded';

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
