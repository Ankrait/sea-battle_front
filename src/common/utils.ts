import { FieldType, IPosition } from '../services/services.interface';

export const isCorrectShipCount = (field: FieldType[][]) => {
	let result = 0;

	for (const array of field)
		for (const el of array)
			if (el === 'SHIP') {
				result++;
			}

	return result === 20;
};

// TODO - удалить
export const createField = (N = 10) => {
	const array: FieldType[][] = [];

	for (let i = 0; i < N; i++) {
		array.push([]);
		for (let j = 0; j < N; j++) {
			array[i].push('EMPTY');
		}
	}

	return array;
};

// TODO - удалить
const isPosValid = (pos: IPosition[], field: FieldType[][]) => {
	const directions = [
		[-1, 0],
		[1, 0],
		[0, -1],
		[0, 1],
		[-1, 1],
		[1, -1],
		[-1, -1],
		[1, 1],
		[0, 0],
	];

	for (const p of pos) {
		const isValid = directions.every(
			([dx, dy]) =>
				p.y + dy > 9 ||
				p.y + dy < 0 ||
				p.x + dx > 9 ||
				p.x + dx < 0 ||
				field[p.y + dy][p.x + dx] !== 'SHIP'
		);

		if (!isValid) return false;
	}

	return true;
};

export const randomField = (): FieldType[][] => {
	const result: FieldType[][] = createField();
	const ships = [4, 3, 2, 1];

	const randNum = (min = 0, max = 9) => {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	};

	const generatePosition = (count: number): IPosition[] => {
		let position: IPosition[] = [];
		const pos = { x: randNum(), y: randNum() };

		const directions = [
			[0, 1],
			[0, -1],
			[1, 0],
			[-1, 0],
		].sort(() => Math.random() - 0.5);

		for (const [dy, dx] of directions) {
			for (let k = 0; k < count; k++) {
				position.push({ x: pos.x + k * dx, y: pos.y + k * dy });
			}
			if (
				position.length === count &&
				position[count - 1].x >= 0 &&
				position[count - 1].x <= 9 &&
				position[count - 1].y >= 0 &&
				position[count - 1].y <= 9 &&
				isPosValid(position, result)
			) {
				break;
			}
			position = [];
		}

		if (position.length === count) {
			return position;
		} else {
			return generatePosition(count);
		}
	};

	ships.forEach((count, i) => {
		for (let k = 0; k < count; k++) {
			const pos = generatePosition(i + 1);
			for (const { x, y } of pos) {
				result[y][x] = 'SHIP';
			}
		}
	});

	return result;
};
