function Authenticate() {}

function IsAuthenticated() {}

function updateCurrentComponent(component, props) {
	localStorage.setItem(
		'current-component',
		JSON.stringify({ component, props })
	);
}

function getCurrentComponent() {
	return localStorage.getItem('current-component')
		? JSON.parse(localStorage.getItem('current-component'))
		: { component: null, props: null };
}

export {
	Authenticate,
	IsAuthenticated,
	updateCurrentComponent,
	getCurrentComponent
};
