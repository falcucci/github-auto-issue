import 'webext-dynamic-content-scripts';
import OptionsSync from 'webext-options-sync';
import addDomainPermissionToggle from 'webext-domain-permission-toggle';
addDomainPermissionToggle();

console.log('background.js loaded');

/* Define defaults */
// new OptionsSync().define({
// 	defaults: {
// 		personalToken: '',
// 		logging: false
// 	},
// });
//
