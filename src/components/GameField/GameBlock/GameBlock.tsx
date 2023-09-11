import React, { FC } from 'react';
import cn from 'classnames';

import styles from './GameBlock.module.scss';
import { FieldType } from '../../../services/services.interface';

interface IGameBlock {
	status: FieldType;
	isEnemy?: boolean;
}

const GameBlock: FC<IGameBlock> = ({ status, isEnemy }) => {
	const className = cn(styles.wrapper, {
		[styles.ship]: status === 'SHIP' && !isEnemy,
		[styles.ship_damage]: status === 'DEAD' && !isEnemy,
		[styles.has_hover]: isEnemy && status !== 'DEAD' && status !== 'MISS',
	});

	return (
		<div className={className}>
			{status === 'MISS' && <div className={styles.miss}></div>}
			{status === 'DEAD' && <div className={styles.dead}></div>}
		</div>
	);
};

export default GameBlock;
