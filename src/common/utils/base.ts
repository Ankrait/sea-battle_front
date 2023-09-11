import { FieldType, IPosition } from '../../services/services.interface';

export const isCorrectShipCount = (field: FieldType[][]) => {
	let deckCount = 0;

	for (const array of field)
		deckCount += array.reduce((count, el) => (count += (el === 'SHIP' && 1) || 0), 0);

	return deckCount === 20;
};

// TODO - удалить
export const createField = (N = 10) => {
	const field: FieldType[][] = [];

	for (let i = 0; i < N; i++) {
		field.push([]);
		for (let j = 0; j < N; j++) {
			field[i].push('EMPTY');
		}
	}

	return field;
};

// TODO - удалить
const aroundDirections = [
	[0, 0],
	[0, 1],
	[0, -1],
	[-1, 0],
	[1, 0],
	[-1, 1],
	[1, -1],
	[-1, -1],
	[1, 1],
];

const isPosValid = (pos: IPosition, field: FieldType[][]) => {
	return aroundDirections.every(
		([dx, dy]) =>
			pos.y + dy >= field.length ||
			pos.y + dy < 0 ||
			pos.x + dx >= field.length ||
			pos.x + dx < 0 ||
			field[pos.y + dy][pos.x + dx] !== 'SHIP'
	);
};

const randNum = (min = 0, max = 9) => {
	return Math.floor(Math.random() * (max - min + 1)) + min;
};

class UncheckedPos {
	private positions: IPosition[] = [];

	constructor(N = 10) {
		for (let y = 0; y < N; y++) {
			for (let x = 0; x < N; x++) {
				this.positions.push({ y, x });
			}
		}
	}

	setCheckedPos(pos: IPosition) {
		aroundDirections.forEach(([dx, dy]) => {
			const indexToDelete = this.positions.findIndex(
				(el) => el.x === pos.x + dx && el.y === pos.y + dy
			);

			if (indexToDelete !== -1) this.positions.splice(indexToDelete, 1);
		});
	}

	getRandomPos() {
		return this.positions[randNum(0, this.positions.length - 1)];
	}

	length() {
		return this.positions.length;
	}

	include(pos: IPosition) {
		return this.positions.findIndex((p) => p.x === pos.x && p.y === pos.y) !== -1;
	}
}

const generateShipPos = (count: number, field: FieldType[][]) => {
	let shipPos: IPosition[] = [];
	const uncheckedPos = new UncheckedPos(field.length);

	const directions = [
		[0, 1],
		[0, -1],
		[1, 0],
		[-1, 0],
	].sort(() => Math.random() - 0.5);

	while (uncheckedPos.length() !== 0) {
		const pos = uncheckedPos.getRandomPos();

		for (const [dy, dx] of directions) {
			for (let k = 0; k < count; k++) {
				const newPos = { x: pos.x + k * dx, y: pos.y + k * dy };

				if (!uncheckedPos.include(newPos) || !isPosValid(newPos, field)) {
					uncheckedPos.setCheckedPos(newPos);
					shipPos = [];
					break;
				}

				shipPos.push(newPos);
			}

			if (shipPos.length === count) {
				return shipPos;
			}
		}
	}

	return null;
};

export const randomField = (): FieldType[][] => {
	const field: FieldType[][] = createField();
	const ships = [4, 3, 2, 1];

	for (let i = 0; i < ships.length; i++) {
		const deckCount = i + 1;
		const count = ships[i];

		for (let k = 0; k < count; k++) {
			const pos = generateShipPos(deckCount, field);
			if (!pos) {
				return randomField();
			}
			for (const { x, y } of pos) {
				field[y][x] = 'SHIP';
			}
		}
	}

	return field;
};
