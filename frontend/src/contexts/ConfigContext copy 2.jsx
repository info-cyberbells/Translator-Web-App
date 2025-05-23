import PropTypes from 'prop-types';
import React, { createContext, useReducer } from 'react';
import * as actionType from '../store/actions';
import { CONFIG } from '../config/constant';
import { LiveSermonProvider } from '../views/LiveSermonContext/LiveSermonContext'; // Import LiveSermonProvider

const initialState = {
  ...CONFIG,
  isOpen: [],
  isTrigger: []
};

const ConfigContext = createContext(initialState);
const { Provider } = ConfigContext;

const ConfigProvider = ({ children }) => {
  let trigger = [];
  let open = [];

  const [state, dispatch] = useReducer((state, action) => {
    switch (action.type) {
      case actionType.CHANGE_LAYOUT:
        return {
          ...state,
          layout: action.layout
        };
      case actionType.COLLAPSE_MENU:
        return {
          ...state,
          collapseMenu: !state.collapseMenu
        };
      case actionType.COLLAPSE_TOGGLE:
        if (action.menu.type === 'sub') {
          open = state.isOpen;
          trigger = state.isTrigger;

          const triggerIndex = trigger.indexOf(action.menu.id);
          if (triggerIndex > -1) {
            open = open.filter((item) => item !== action.menu.id);
            trigger = trigger.filter((item) => item !== action.menu.id);
          }

          if (triggerIndex === -1) {
            open = [...open, action.menu.id];
            trigger = [...trigger, action.menu.id];
          }
        } else {
          open = state.isOpen;
          const triggerIndex = state.isTrigger.indexOf(action.menu.id);
          trigger = triggerIndex === -1 ? [action.menu.id] : [];
          open = triggerIndex === -1 ? [action.menu.id] : [];
        }
        return {
          ...state,
          isOpen: open,
          isTrigger: trigger
        };
      case actionType.NAV_COLLAPSE_LEAVE:
        if (action.menu.type === 'sub') {
          open = state.isOpen;
          trigger = state.isTrigger;

          const triggerIndex = trigger.indexOf(action.menu.id);
          if (triggerIndex > -1) {
            open = open.filter((item) => item !== action.menu.id);
            trigger = trigger.filter((item) => item !== action.menu.id);
          }
          return {
            ...state,
            isOpen: open,
            isTrigger: trigger
          };
        }
        return { ...state };
      case actionType.NAV_CONTENT_LEAVE:
        return {
          ...state,
          isOpen: open,
          isTrigger: trigger
        };
      case actionType.RESET:
        return {
          ...state,
          layout: initialState.layout,
          collapseMenu: initialState.collapseMenu
        };
      default:
        throw new Error();
    }
  }, initialState);

  return (
    <Provider value={{ state, dispatch }}>
      <LiveSermonProvider>
        {children}
      </LiveSermonProvider>
    </Provider>
  );
};

ConfigProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export { ConfigContext, ConfigProvider };
