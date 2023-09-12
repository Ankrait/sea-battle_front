import React, { FC } from 'react';
import cn from 'classnames';

import { IHtmlProps } from '../../common/interfaces';

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
	return (
		<div className={cn(styles.wrapper, className)} {...restProps}>
			{userName ? (
				<>
					{userName} - <span>{isReady ? <>Готов</> : <>Не готов</>}</span>
				</>
			) : (
				<>Ожидание...</>
			)}
		</div>
	);
};

export default GameFieldHead;
