import { FC, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import cn from 'classnames';

import { useAppDispatch, useAppSelector } from 'common/hooks';
import { GameRequestType } from 'services/services.interface';
import { gameService } from 'services/services';
import { sendMessage } from 'store/reducers/gameSlice';
import { getDeckCount } from 'common/utils/base';
import Button from 'components/Button/Button';
import Surrender from 'components/Surrender/Surrender';

import styles from './GameButtons.module.scss';

interface IGameButtons {
	className?: string;
}

const GameButtons: FC<IGameButtons> = ({ className }) => {
	const { gameId, status, isReady, user, userField } = useAppSelector(
		(state) => state.game
	);
	const navigate = useNavigate();
	const dispatch = useAppDispatch();
	const [isReadyButtonDisabled, setReadyButtonDisabled] = useState(true);

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

	return (
		<div className={cn(styles.buttons, className)}>
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
	);
};

export default GameButtons;
