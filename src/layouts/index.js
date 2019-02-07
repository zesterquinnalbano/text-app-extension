import React, { useState, useEffect } from 'react';
import './index.css';
import MainHeader from './main-header';
import SubHeader from './sub-header';
import Router, { goTo } from 'route-lite';
import AppContext from '../context/app-context';

export default function MainLayout() {
	let [renderedComponent, changeRenderedComponent] = useState(null);

	/**
	 * assign the component passed by the SubHeader
	 * then renders the component
	 */
	function getComponent(component) {
		changeRenderedComponent(goTo(component));
	}

	return (
		<div className="main-layout">
			<AppContext.Provider value={{ asd: 'asd' }}>
				<MainHeader />
				<SubHeader component={getComponent} />
				<Router>{renderedComponent}</Router>
			</AppContext.Provider>
		</div>
	);
}
