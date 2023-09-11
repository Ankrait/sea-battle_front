import React, { FC, useState, useEffect, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';

import Button from '../../../components/Button/Button';
import Input from '../../../components/Input/Input';
import { useAppDispatch, useAppSelector } from '../../../common/hooks';
import { connectGame } from '../../../store/reducers/gameSlice';
import { setErrorMes } from '../../../store/reducers/appSlice';

import styles from './HomeConnect.module.scss';

const HomeConnect: FC = () => {
	const loading = useAppSelector((state) => state.app.loading);
	const gameId = useAppSelector((state) => state.game.gameId);
	const navigate = useNavigate();
	const dispatch = useAppDispatch();
	const [name, setName] = useState('');
	const [code, setCode] = useState('');

	const inputHandlerCreator = (
		onChange: (value: string) => void,
		max: number,
		isUpperCase = false
	) => {
		return (e: ChangeEvent<HTMLInputElement>) => {
			const value = e.currentTarget.value;
			if (value.length > max) return;
			onChange(isUpperCase ? value.toUpperCase() : value);
		};
	};

	const connectGameHandler = () => {
		if (name.length > 10) {
			dispatch(setErrorMes('Максимальная длинна имени 10'));
			return;
		}

		if (code.length !== 5) {
			dispatch(setErrorMes('Код должен состоять из 5 символов'));
			return;
		}

		dispatch(connectGame({ player: name, gameId: code }));
	};

	useEffect(() => {
		if (gameId) navigate(`/game/${gameId}`);
	}, [gameId, navigate]);

	return (
		<div className={styles.wrapper}>
			<div className={styles.inputs}>
				<Input
					onChange={inputHandlerCreator(setCode, 5, true)}
					placeholder="Код игры"
					value={code}
				/>
				<Input
					onChange={inputHandlerCreator(setName, 10)}
					placeholder="Имя"
					value={name}
				/>
			</div>
			<div className={styles.buttons}>
				<Button onClick={connectGameHandler} disabled={loading} variant="success">
					Подключиться к игре
				</Button>
				<Button onClick={() => navigate('/')}>Назад</Button>
			</div>
		</div>
	);
};

export default HomeConnect;
