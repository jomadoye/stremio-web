const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const FocusLock = require('react-focus-lock').default;
const useDataset = require('stremio/common/useDataset');
const styles = require('./styles');

const Popup = ({ open, direction, renderLabel, renderMenu, onCloseRequest, ...props }) => {
    direction = ['top', 'bottom'].includes(direction) ? direction : null;
    const dataset = useDataset(props);
    const labelRef = React.useRef(null);
    const [autoDirection, setAutoDirection] = React.useState(null);
    const menuOnMouseDown = React.useCallback((event) => {
        event.nativeEvent.closePopupPrevented = true;
    }, []);
    const menuOnKeyUp = React.useCallback((event) => {
        event.nativeEvent.buttonClickPrevented = true;
    }, []);
    React.useEffect(() => {
        const onCloseEvent = (event) => {
            if (!event.closePopupPrevented && typeof onCloseRequest === 'function') {
                const closeEvent = {
                    type: 'close',
                    nativeEvent: event,
                    dataset: dataset
                };
                switch (event.type) {
                    case 'resize':
                        onCloseRequest(closeEvent);
                        break;
                    case 'keydown':
                        if (event.key === 'Escape') {
                            onCloseRequest(closeEvent);
                        }
                        break;
                    case 'mousedown':
                        if (event.target !== document.documentElement && !labelRef.current.contains(event.target)) {
                            onCloseRequest(closeEvent);
                        }
                        break;
                }
            }
        };
        if (open) {
            window.addEventListener('resize', onCloseEvent);
            window.addEventListener('keydown', onCloseEvent);
            window.addEventListener('mousedown', onCloseEvent);
        }
        return () => {
            window.removeEventListener('resize', onCloseEvent);
            window.removeEventListener('keydown', onCloseEvent);
            window.removeEventListener('mousedown', onCloseEvent);
        };
    }, [open, onCloseRequest, dataset]);
    React.useLayoutEffect(() => {
        if (open) {
            const documentRect = document.documentElement.getBoundingClientRect();
            const labelRect = labelRef.current.getBoundingClientRect();
            const labelOffsetTop = labelRect.top - documentRect.top;
            const labelOffsetBottom = (documentRect.height + documentRect.top) - (labelRect.top + labelRect.height);
            const autoDirection = labelOffsetBottom >= labelOffsetTop ? 'bottom' : 'top';
            setAutoDirection(autoDirection);
        } else {
            setAutoDirection(null);
        }
    }, [open]);
    return renderLabel({
        ref: labelRef,
        className: styles['label-container'],
        children: open ?
            <FocusLock className={classnames(styles['menu-container'], styles[`menu-direction-${typeof direction === 'string' ? direction : autoDirection}`])} autoFocus={true} lockProps={{ onMouseDown: menuOnMouseDown, onKeyUp: menuOnKeyUp }}>
                {renderMenu()}
            </FocusLock>
            :
            null
    });
}

Popup.propTypes = {
    open: PropTypes.bool,
    direction: PropTypes.oneOf(['top', 'bottom']),
    renderLabel: PropTypes.func.isRequired,
    renderMenu: PropTypes.func.isRequired,
    onCloseRequest: PropTypes.func
};

module.exports = Popup;
