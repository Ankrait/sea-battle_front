import React, { FC, useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { useAppSelector, useAppDispatch } from '../../common/hooks';
import GameField from '../../components/GameField/GameField';
import Button from '../../components/Button/Button';
import { isCorrectShipCount, randomField } from '../../common/utils/base';
import { setErrorMes } from '../../store/reducers/appSlice';
import { clearGameData, setGameData } from '../../store/reducers/gameSlice';
import {
	IGameResponse,
	GameRequestType,
	IErrorResponse,
} from '../../services/services.interface';
import { cookies } from '../../common/utils/cookies';

import styles from './Game.module.scss';

let ws: WebSocket | null = null;

const Game: FC = () => {
	const {
		userNumber,
		userField,
		isReady,
		enemy,
		enemyField,
		enemyIsReady,
		status,
		...restGame
	} = useAppSelector((state) => state.game);
	const { id } = useParams();
	const navigate = useNavigate();
	const dispatch = useAppDispatch();

	const [isReadyButtonDisabled, setReadyButtonDisabled] = useState(true);

	const gameId = restGame.gameId || id || '';
	const user = restGame.user || cookies.get('userName') || '';

	const setReadyHandler = () => {};

	const createFieldHandler = () => {
		const request: GameRequestType = {
			event: 'SCHEME',
			payload: {
				gameId,
				player: user,
				field: randomField(),
			},
		};

		try {
			let count = 1000000;
			console.time('rf');
			while (count > 0) {
				randomField();
				count--;
			}
			console.timeEnd('rf');
		} catch (e) {
			console.error(e);
		}

		ws?.send(JSON.stringify(request));
	};

	useEffect(() => {
		isCorrectShipCount(userField)
			? setReadyButtonDisabled(false)
			: setReadyButtonDisabled(true);
	}, [userField]);

	useEffect(() => {
		if (restGame.user) {
			cookies.set('userName', restGame.user);
		}

		ws = new WebSocket('ws://localhost:8080/');
		ws.onmessage = (e: MessageEvent<string>) => {
			const data = JSON.parse(e.data) as IGameResponse | IErrorResponse;
			console.log(data);

			if ('message' in data) {
				dispatch(setErrorMes(data.message));
				return;
			}

			dispatch(setGameData(data));
		};

		ws.onopen = () => {
			console.log('ws open');

			const request: GameRequestType = {
				event: 'CONNECTION',
				payload: {
					gameId,
					player: user,
				},
			};

			ws?.send(JSON.stringify(request));
		};

		ws.onclose = () => {
			console.log('ws close');
		};

		return () => {
			ws?.close();
			dispatch(clearGameData());
		};
	}, [dispatch, gameId, user]);

	return (
		<div className={styles.wrapper}>
			<div className={styles.status}>
				<div className={styles.status_info}>
					{!enemy ? (
						<>Код для входа: {gameId}</>
					) : status === 'INIT' ? (
						<>Этап размещения</>
					) : status === 'END' ? (
						<>Конец игры</>
					) : status === `HIT${userNumber}` ? (
						<>Ваш ход</>
					) : (
						<>Ход соперника</>
					)}
				</div>
				<div className={styles.status_time}>0:00</div>
			</div>
			<div className={styles.game_wrapper}>
				<div className={styles.game_field}>
					<div className={styles.game_field_name}></div>
					<GameField field={userField} />
				</div>
				<div className={styles.buttons}>
					{status === 'INIT' && (
						<>
							<Button onClick={createFieldHandler}>Размещение</Button>
							<Button
								disabled={isReadyButtonDisabled}
								onClick={setReadyHandler}
								variant={isReady ? 'error' : 'success'}>
								{isReady ? <>Не готов</> : <>Готов</>}
							</Button>
						</>
					)}
					<div className={styles.button_exit}>
						{status.includes('HIT') ? (
							<Button variant="error">Сдаться</Button>
						) : (
							<Button onClick={() => navigate('/')}>Выход</Button>
						)}
					</div>
				</div>
				<div className={styles.game_field}>
					<div className={styles.game_field_name}></div>
					<GameField wrapperClassName={styles.game_field} isEnemy field={enemyField} />
				</div>
			</div>
		</div>
	);
};

export default Game;
