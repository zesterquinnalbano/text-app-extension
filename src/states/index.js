import { useState, useEffect } from 'react';
import { goTo } from 'route-lite';
import { updateCurrentComponent, getCurrentComponent } from '../services';
import Inbox from '../components/inbox';
import Contacts from '../components/contacts';
import Settings from '../components/settings';
import Login from '../components/login';
import NewContact from '../components/contacts/new-contact';
import Thread from '../components/thread';

function useValue(state) {
	return state.value;
}

function useInput(initValue = null) {
	let [value, changeValue] = useState(initValue);

	function onChange(e) {
		changeValue(e.target.value);
	}

	function handleChange(value) {
		changeValue(value);
	}

	return { value, onChange, handleChange };
}

function useNumber(initValue = null) {
	let [value, changeValue] = useState(initValue);

	function onChange(value) {
		changeValue(value);
	}

	function handleChange(value) {
		changeValue(value);
	}

	return { value, onChange, handleChange };
}

function useComponent() {
	let [currentComponent, changeCurrentComponent] = useState(null);

	/**
	 * get the latest component in the localStorage
	 */
	const { component, props } = getCurrentComponent();

	useEffect(() => {
		if (!component) {
			changeCurrentComponent(goTo(Login));
		} else {
			/**
			 * set the view to the latest component from the localStorage
			 */
			checkComponent(component, props);
		}
	});

	/**
	 * check the lastest component from localStorage or passed by sub header
	 * and updated the current component
	 *
	 * params: string component, fn changeComponent
	 */
	function checkComponent(component, props = null) {
		switch (component) {
			case 'Inbox':
				changeCurrentComponent(goTo(Inbox));
				break;
			case 'Contacts':
				changeCurrentComponent(goTo(Contacts));
				break;
			case 'NewContact':
				changeCurrentComponent(goTo(NewContact, props));
				break;
			case 'Settings':
				changeCurrentComponent(goTo(Settings, props));
				break;
			case 'Login':
				changeCurrentComponent(goTo(Login));
				break;
			case 'Thread':
				changeCurrentComponent(goTo(Thread, props));
				break;
			default:
				changeCurrentComponent(goTo(Login));
				break;
		}
	}

	function renderComponent(component, props = null) {
		/**
		 * update current component in the localStorage
		 */
		updateCurrentComponent(component, props);

		/**
		 * set the view to the latest component passed by the sub header
		 */
		checkComponent(component, props);
	}

	return { currentComponent, renderComponent };
}

export { useComponent, useInput, useNumber, useValue };
