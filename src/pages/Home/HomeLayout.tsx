import React, { FC } from 'react';
import { Outlet } from 'react-router-dom';

import logoImg from 'assets/img/logo.png';

import styles from './HomeLayout.module.scss';

const HomeLayout: FC = () => {
	return (
		<div className={styles.wrapper}>
			<div className={styles.image}>
				<img src={logoImg} alt="Лого" />
			</div>
			<Outlet />
		</div>
	);
};

export default HomeLayout;
