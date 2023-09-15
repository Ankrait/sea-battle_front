import { FC, useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { useAppSelector, useAppDispatch } from 'common/hooks';
import {
	clearGameData,
	sendMessage,
	socketConnect,
	socketDisconnect,
} from 'store/reducers/gameSlice';
import { GameRequestType } from 'services/services.interface';
import { gameService } from 'services/services';
import { cookies } from 'common/utils/cookies';
import { getDeckCount } from 'common/utils/base';
import { IPosition } from 'common/interfaces';
import GameFieldHead from 'components/GameFieldHead/GameFieldHead';
import GameField from 'components/GameField/GameField';
import Button from 'components/Button/Button';
import Surrender from 'components/Surrender/Surrender';
import GameStatus from 'components/GameStatus/GameStatus';

import styles from './Game.module.scss';

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

		dispatch(sendMessage(request));
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

		dispatch(sendMessage(request));
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

		dispatch(sendMessage(request));
	};

	const surrenderHandler = () => {
		const request: GameRequestType = {
			event: 'SURRENDER',
			payload: {
				gameId,
				player: user,
			},
		};

		dispatch(sendMessage(request));
	};

	useEffect(() => {
		getDeckCount(userField) === 20
			? setReadyButtonDisabled(false)
			: setReadyButtonDisabled(true);
	}, [userField]);

	useEffect(() => {
		cookies.set('userName', user);

		dispatch(socketConnect({ gameId, player: user }));

		return () => {
			dispatch(socketDisconnect());
			dispatch(clearGameData());
		};
	}, []);

	return (
		<div className={styles.wrapper}>
			<GameStatus className={styles.status} />
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
							<Surrender onSurrenderHandler={surrenderHandler} />
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
