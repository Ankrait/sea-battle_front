import React, { FC } from 'react';
import { useNavigate } from 'react-router-dom';

import Button from 'components/Button/Button';

import styles from './HomeMain.module.scss';

const HomeMain: FC = () => {
	const navigate = useNavigate();

	return (
		<div className={styles.wrapper}>
			<Button onClick={() => navigate('/create')}>Создать</Button>
			<Button onClick={() => navigate('/connect')}>Подключиться</Button>
		</div>
	);
};

export default HomeMain;
