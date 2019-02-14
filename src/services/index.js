function Authenticate() {}

function IsAuthenticated() {}

function updateCurrentComponent(component, props) {
	localStorage.setItem(
		'current-component',
		JSON.stringify({ component, props })
	);
}

function getCurrentComponent() {
	return JSON.parse(localStorage.getItem('current-component'));
}

export {
	Authenticate,
	IsAuthenticated,
	updateCurrentComponent,
	getCurrentComponent
};
