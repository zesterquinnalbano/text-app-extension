import React, { useState, useEffect } from 'react';
import './index.css';
import MainHeader from './main-header';
import SubHeader from './sub-header';
import Router from 'route-lite';
import AppContext from '../context/app-context';
import { useId, useComponent } from '../states';

export default function MainLayout() {
	let state = {
		/**
		 * assign the component passed by the SubHeader
		 * then renders the component
		 */
		component: useComponent(),
		/**
		 * get the id from the selected message
		 */
		selectedMessage: useId()
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
