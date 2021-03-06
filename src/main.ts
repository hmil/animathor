import './global.css';

(self as any).MonacoEnvironment = {
	getWorkerUrl: function (moduleId, label) {
		if (label === 'json') {
			return './json.worker.js';
		}
		if (label === 'css' || label === 'scss' || label === 'less') {
			return './css.worker.js';
		}
		if (label === 'html' || label === 'handlebars' || label === 'razor') {
			return './html.worker.js';
		}
		if (label === 'typescript' || label === 'javascript') {
			return './ts.worker.js';
		}
		return './editor.worker.js';
	}
};

import App from './App.svelte';

const app = new App({
	target: document.body,
	props: {
		name: 'world'
	}
});

export default app;

const registerServiceWorker = async () => {
	if ('serviceWorker' in navigator) {
		try {
			const registration = await navigator.serviceWorker.register(
				new URL('./worker.ts', import.meta.url)
			);
			if (registration.installing) {
				console.log('Service worker installing');
			} else if (registration.waiting) {
				console.log('Service worker installed');
			} else if (registration.active) {
				console.log('Service worker active');
			}
		} catch (error) {
			console.error(`Registration failed with ${error}`);
		}
	}
};

registerServiceWorker();
