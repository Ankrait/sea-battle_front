import { FieldType } from '../../services/services.interface';

export const getDeckCount = (field: FieldType[][]) => {
	let deckCount = 0;

	for (const array of field)
		deckCount += array.reduce((count, el) => (count += (el === 'SHIP' && 1) || 0), 0);

	return deckCount;
};
