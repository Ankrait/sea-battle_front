import React, { FC } from 'react';
import cn from 'classnames';

import { IHtmlProps } from 'common/interfaces';
import { FieldType } from 'services/services.interface';

import styles from './GameBlock.module.scss';

interface IGameBlock extends IHtmlProps {
	status: FieldType;
	isEnemy?: boolean;
}

const GameBlock: FC<IGameBlock> = ({ status, isEnemy, ...restProps }) => {
	const className = cn(styles.wrapper, {
		[styles.ship]: (status === 'SHIP' || status === 'DEAD') && !isEnemy,
		[styles.ship_dead]: status === 'DEAD_SHIP' && !isEnemy,
		[styles.ship_dead_enemy]: status === 'DEAD_SHIP' && isEnemy,
		[styles.has_hover]: isEnemy && (status === 'EMPTY' || status === 'SHIP'),
	});

	return (
		<div className={className} {...restProps}>
			{status === 'MISS' && <div className={styles.miss}></div>}
			{status.includes('DEAD') && <div className={styles.dead}></div>}
		</div>
	);
};

export default GameBlock;
