import React, { FC } from 'react';
import cn from 'classnames';

import { IHtmlProps } from 'common/interfaces';

import styles from './GameFieldHead.module.scss';

interface IGameFieldHead extends IHtmlProps {
	userName: string | null;
	isReady?: boolean;
}

const GameFieldHead: FC<IGameFieldHead> = ({
	userName,
	isReady,
	className,
	...restProps
}) => {
	const wrapperClassName = cn(styles.wrapper, className, {
		[styles.waiting]: !userName,
	});

	return (
		<div className={wrapperClassName} {...restProps}>
			{userName ? (
				<>
					{userName} -{' '}
					{isReady ? (
						<span className={styles.ready}>Готов</span>
					) : (
						<span className={styles.not_ready}>Не готов</span>
					)}
				</>
			) : (
				<>
					Ожидание<span className={styles.dots}>...</span>
				</>
			)}
		</div>
	);
};

export default GameFieldHead;
