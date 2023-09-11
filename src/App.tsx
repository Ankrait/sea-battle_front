import React from 'react';
import { Outlet } from 'react-router-dom';

import ErrorPopup from './components/ErrorPopup/ErrorPopup';

import styles from './App.module.scss';

const App = () => {
	return (
		<div className={styles.wrapper}>
			<Outlet />
			<ErrorPopup />
		</div>
	);
};

export default App;
