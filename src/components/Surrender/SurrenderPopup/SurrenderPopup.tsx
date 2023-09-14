import React, { FC, MouseEvent, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

import Button from 'components/Button/Button';

import styles from './SurrenderPopup.module.scss';

interface ISurrenderPopup {
	onSurrenderHandler: () => void;
	popupCloseHandler: () => void;
}

const SurrenderPopup: FC<ISurrenderPopup> = ({
	onSurrenderHandler,
	popupCloseHandler,
}) => {
	const bgRef = useRef<HTMLDivElement>(null);

	const agreeHandler = () => {
		popupCloseHandler();
		onSurrenderHandler();
	};

	const bgClickHandler = (e: MouseEvent<HTMLDivElement>) => {
		if (e.target === bgRef.current) {
			popupCloseHandler();
		}
	};

	useEffect(() => {
		document.body.style.overflow = 'hidden';

		return () => {
			document.body.style.overflow = 'auto';
		};
	}, []);

	return createPortal(
		<div ref={bgRef} onClick={bgClickHandler} className={styles.wrapper}>
			<div className={styles.content}>
				<div className={styles.text}>Вы хотите отдать победу?</div>
				<div className={styles.buttons}>
					<Button variant="error" onClick={agreeHandler}>
						ДА
					</Button>
					<Button variant="success" onClick={popupCloseHandler}>
						НЕТ
					</Button>
				</div>
			</div>
		</div>,
		document.body as HTMLElement
	);
};

export default SurrenderPopup;
