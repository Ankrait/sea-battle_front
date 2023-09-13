import React, { FC, useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { useAppSelector, useAppDispatch } from 'common/hooks';
import { setErrorMes } from 'store/reducers/appSlice';
import { clearGameData, setGameData } from 'store/reducers/gameSlice';
import {
	IGameResponse,
	GameRequestType,
	IErrorResponse,
} from 'services/services.interface';
import { gameService } from 'services/services';
import { cookies } from 'common/utils/cookies';
import { getDeckCount } from 'common/utils/base';
import { IPosition } from 'common/interfaces';
import GameFieldHead from 'components/GameFieldHead/GameFieldHead';
import GameField from 'components/GameField/GameField';
import Button from 'components/Button/Button';

import styles from './Game.module.scss';

let ws: WebSocket | null = null;
const WS_URL =
	window.location.hostname === 'localhost'
		? 'ws://localhost:8080/'
		: 'wss://b704-176-52-103-149.ngrok-free.app/';

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

	const setReadyHandler = () => {
		const request: GameRequestType = {
			event: 'READY',
			payload: {
				gameId,
				player: user,
				isReady: !isReady,
			},
		};

		ws?.send(JSON.stringify(request));
	};

	const createFieldHandler = async () => {
		const field = await gameService.getRandomField();
		const request: GameRequestType = {
			event: 'SCHEME',
			payload: {
				gameId,
				player: user,
				field,
			},
		};

		ws?.send(JSON.stringify(request));
	};

	const onHitHandler = (pos: IPosition) => {
		const request: GameRequestType = {
			event: 'HIT',
			payload: {
				gameId,
				player: user,
				hit: pos,
			},
		};

		ws?.send(JSON.stringify(request));
	};

	useEffect(() => {
		getDeckCount(userField) === 20
			? setReadyButtonDisabled(false)
			: setReadyButtonDisabled(true);
	}, [userField]);

	useEffect(() => {
		if (restGame.user) {
			cookies.set('userName', restGame.user);
		}
		try {
			ws = new WebSocket(WS_URL);

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
		} catch (e) {
			console.log(e);
		}

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
					<GameFieldHead
						userName={user}
						isReady={isReady}
						className={styles.game_field_name}
					/>
					<GameField field={userField} />
				</div>
				<div className={styles.buttons}>
					{status === 'INIT' && (
						<>
							<Button disabled={isReady} onClick={createFieldHandler}>
								Размещение
							</Button>
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
					<GameFieldHead
						userName={enemy}
						isReady={enemyIsReady}
						className={styles.game_field_name}
					/>
					<GameField
						onHitHandler={onHitHandler}
						wrapperClassName={styles.game_field}
						isEnemy
						field={enemyField}
					/>
				</div>
			</div>
		</div>
	);
};

export default Game;
