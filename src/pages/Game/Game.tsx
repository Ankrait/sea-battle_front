import { FC, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { useAppSelector, useAppDispatch } from 'common/hooks';
import {
	clearGameData,
	sendMessage,
	socketConnect,
	socketDisconnect,
} from 'store/reducers/gameSlice';
import { GameRequestType } from 'services/services.interface';
import { cookies } from 'common/utils/cookies';
import { IPosition } from 'common/interfaces';
import GameFieldHead from 'components/GameFieldHead/GameFieldHead';
import GameField from 'components/GameField/GameField';
import GameStatus from 'components/GameStatus/GameStatus';

import styles from './Game.module.scss';
import GameButtons from 'components/GameButtons/GameButtons';

const Game: FC = () => {
	const {
		userField,
		enemyField,
		enemy,
		isReady,
		enemyIsReady,
		gameId: stateGameId,
		user: stateUser,
	} = useAppSelector((state) => state.game);
	const { id } = useParams();
	const dispatch = useAppDispatch();

	const gameId = id || stateGameId || '';
	const user = stateUser || cookies.get('userName') || '';

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

	useEffect(() => {
		cookies.set('userName', user);

		dispatch(socketConnect({ gameId, player: user }));

		return () => {
			dispatch(socketDisconnect());
			dispatch(clearGameData());
		};
	}, [dispatch, gameId, user]);

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
				<GameButtons className={styles.buttons} />
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
