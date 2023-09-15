import { FC } from 'react';
import cn from 'classnames';

import { useAppSelector } from 'common/hooks';

import styles from './GameStatus.module.scss';

interface IGameStatus {
	className?: string;
}

const GameStatus: FC<IGameStatus> = ({ className }) => {
	const { status, gameId, userNumber, enemy } = useAppSelector((state) => state.game);

	const message = (): JSX.Element => {
		if (!enemy) {
			return <>Код для входа: {gameId}</>;
		}

		if (status === 'INIT') {
			return <>Этап размещения</>;
		}

		if (status.includes('WIN')) {
			if (status === `WIN${userNumber}`) {
				return <div className={styles.status_win}>ПОБЕДА</div>;
			} else {
				return <div className={styles.status_lose}>ПОРАЖЕНИЕ</div>;
			}
		}

		if (status === `HIT${userNumber}`) {
			return <>Ваш ход</>;
		} else {
			return <>Ход соперника</>;
		}
	};

	return (
		<div className={cn(styles.status, className)}>
			<div className={styles.status_info}>{message()}</div>
			{/* <div className={styles.status_time}>0:00</div> */}
		</div>
	);
};

export default GameStatus;
