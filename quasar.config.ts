import { configure } from 'quasar/wrappers';

export default configure(function () {
    return {
        boot: [
            'i18n',
            'axios',
            'OpenLayersMap',
        ],
        // ... rest of your config
    };
}); 