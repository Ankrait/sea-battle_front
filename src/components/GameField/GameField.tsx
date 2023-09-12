import React, { FC } from 'react';
import cn from 'classnames';

import { FieldType } from '../../services/services.interface';
import { IPosition } from '../../common/interfaces';
import GameBlock from './GameBlock/GameBlock';

import styles from './GameField.module.scss';

interface IGameField {
	field: FieldType[][];
	isEnemy?: boolean;
	wrapperClassName?: string;
	onHitHandler?: (pos: IPosition) => void;
}

const GameField: FC<IGameField> = ({
	field,
	isEnemy,
	wrapperClassName,
	onHitHandler,
}) => {
	return (
		<div className={cn(wrapperClassName, styles.wrapper)}>
			{field.map((array, i) =>
				array.map((el, j) => {
					const isClickable =
						onHitHandler &&
						isEnemy &&
						(field[i][j] === 'SHIP' || field[i][j] === 'EMPTY');

					return (
						<GameBlock
							key={`${i}${j}`}
							onClick={isClickable ? () => onHitHandler({ x: j, y: i }) : undefined}
							isEnemy={isEnemy}
							status={el}
						/>
					);
				})
			)}
		</div>
	);
};

export default GameField;
