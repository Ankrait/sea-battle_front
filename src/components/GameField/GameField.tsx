import React, { FC } from 'react';
import cn from 'classnames';

import styles from './GameField.module.scss';
import GameBlock from './GameBlock/GameBlock';
import { FieldType } from '../../services/services.interface';

interface IGameField {
	field: FieldType[][];
	isEnemy?: boolean;
	wrapperClassName?: string;
}

const GameField: FC<IGameField> = ({ field, isEnemy, wrapperClassName }) => {
	return (
		<div className={cn(wrapperClassName, styles.wrapper)}>
			{field.map((array, i) =>
				array.map((el, j) => <GameBlock key={`${i}${j}`} isEnemy={isEnemy} status={el} />)
			)}
		</div>
	);
};

export default GameField;
