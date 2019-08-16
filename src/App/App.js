const React = require('react');
const { Router } = require('stremio-router');
const { KeyboardNavigation, ServicesProvider } = require('stremio/services');
const routerViewsConfig = require('./routerViewsConfig');
require('./styles');

const App = () => {
    const onPathNotMatch = React.useCallback(() => {
        window.history.back();
    }, []);
    const services = React.useMemo(() => ({
        keyboardNavigation: new KeyboardNavigation()
    }), []);
    React.useEffect(() => {
        services.keyboardNavigation.start();
    }, [services]);
    return (
        <React.StrictMode>
            <ServicesProvider services={services}>
                <Router
                    homePath={'/'}
                    viewsConfig={routerViewsConfig}
                    onPathNotMatch={onPathNotMatch}
                />
            </ServicesProvider>
        </React.StrictMode>
    );
};

module.exports = App;
