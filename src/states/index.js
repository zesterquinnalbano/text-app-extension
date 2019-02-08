import React, { useState } from 'react';
import { goTo } from 'route-lite';

function useId(initValue = null) {
	let [id, changeId] = useState(initValue);

	function updateId(id) {
		changeId(id);
	}

	return { id, updateId };
}

function useComponent() {
	let [currentComponent, changeCurrentComponent] = useState(null);

	function renderComponent(component, props = null) {
		changeCurrentComponent(goTo(component, props));
	}

	return { currentComponent, renderComponent };
}

export { useId, useComponent };
