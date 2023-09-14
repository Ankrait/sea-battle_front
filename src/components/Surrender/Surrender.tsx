import React, { FC, useState } from 'react';

import Button from 'components/Button/Button';
import SurrenderPopup from './SurrenderPopup/SurrenderPopup';

import styles from './Surrender.module.scss';

interface ISurrender {
	onSurrenderHandler: () => void;
}

const Surrender: FC<ISurrender> = ({ onSurrenderHandler }) => {
	const [isPopupOpen, setPopupOpen] = useState(false);

	return (
		<>
			<Button variant="error" onClick={() => setPopupOpen(true)}>
				Сдаться
			</Button>
			{isPopupOpen && (
				<SurrenderPopup
					onSurrenderHandler={onSurrenderHandler}
					popupCloseHandler={() => setPopupOpen(false)}
				/>
			)}
		</>
	);
};

export default Surrender;
