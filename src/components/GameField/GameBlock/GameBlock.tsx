import React, { FC, useLayoutEffect, useState } from 'react';
import cn from 'classnames';

import { IHtmlProps } from 'common/interfaces';
import { FieldType } from 'services/services.interface';
import bombImg from 'assets/img/bomb.png';
import explosionImg from 'assets/img/explosion.png';

import styles from './GameBlock.module.scss';

interface IGameBlock extends IHtmlProps {
	status: FieldType;
	isEnemy?: boolean;
}

const GameBlock: FC<IGameBlock> = ({ status, isEnemy, ...restProps }) => {
	const [prevStatus, setPrevStatus] = useState<FieldType | null>(null);
	const [hitAnimationType, setHitAnimationType] = useState<
		'MISS' | 'DEAD' | 'DEAD_SHIP' | null
	>(null);

	const className = cn(styles.wrapper, {
		[styles.ship]: (status === 'SHIP' || status === 'DEAD') && !isEnemy,
		[styles.ship_dead]: status === 'DEAD_SHIP' && !isEnemy,
		[styles.ship_dead_enemy]: status === 'DEAD_SHIP' && isEnemy,
		[styles.has_hover]:
			!hitAnimationType && isEnemy && (status === 'EMPTY' || status === 'SHIP'),
	});

	useLayoutEffect(() => {
		if (prevStatus) {
			if (prevStatus === 'SHIP' && (status === 'DEAD' || status === 'DEAD_SHIP')) {
				setHitAnimationType('DEAD');
			}

			if (prevStatus === 'DEAD' && status === 'DEAD_SHIP') {
				setHitAnimationType('DEAD_SHIP');
			}

			if (prevStatus === 'EMPTY' && status === 'MISS') {
				setHitAnimationType('MISS');
			}

			setTimeout(() => {
				setHitAnimationType(null);
			}, 10000);
		}

		setPrevStatus(status);
	}, [prevStatus, status]);

	return (
		<div
			className={cn(className, {
				[styles.anim]: !!hitAnimationType,
				[styles.anim_dead]: hitAnimationType === 'DEAD_SHIP',
			})}
			{...restProps}>
			{status === 'MISS' && <div className={styles.miss}></div>}
			{status.includes('DEAD') && <div className={styles.dead}></div>}
			<div className={styles.animation}>
				{(hitAnimationType === 'DEAD' || hitAnimationType === 'MISS') && (
					<div className={styles.bomb_image}>
						<img src={bombImg} alt="bomb" />
					</div>
				)}
				{hitAnimationType === 'DEAD' && (
					<div className={styles.explosion_image}>
						<img src={explosionImg} alt="explosion" />
					</div>
				)}
			</div>
		</div>
	);
};

export default GameBlock;
