import React, { FC, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from 'common/hooks';
import { setErrorMes } from 'store/reducers/appSlice';
import { createGame } from 'store/reducers/gameSlice';
import { cookies } from 'common/utils/cookies';
import Button from 'components/Button/Button';
import Input from 'components/Input/Input';

import styles from './HomeCreate.module.scss';

const HomeCreate: FC = () => {
	const loading = useAppSelector((state) => state.app.loading);
	const gameId = useAppSelector((state) => state.game.gameId);
	const navigate = useNavigate();
	const dispatch = useAppDispatch();
	const [name, setName] = useState('');

	const createGameHandler = () => {
		if (name.length > 10) {
			dispatch(setErrorMes('Максимальная длинна имени 10'));
			return;
		}

		dispatch(createGame({ player: name }));
	};

	useEffect(() => {
		if (gameId) navigate(`/game/${gameId}`);
	}, [gameId]);

	useEffect(() => {
		setName(cookies.get('userName') || '');
	}, []);

	return (
		<div className={styles.wrapper}>
			<div className={styles.inputs}>
				<Input
					onChange={(e) => setName(e.currentTarget.value)}
					placeholder="Имя"
					value={name}
				/>
			</div>
			<div className={styles.buttons}>
				<Button disabled={loading} onClick={createGameHandler} variant="success">
					Создать игру
				</Button>
				<Button onClick={() => navigate('/')}>Назад</Button>
			</div>
		</div>
	);
};

export default HomeCreate;
