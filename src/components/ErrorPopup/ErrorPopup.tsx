import React, { FC, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import cn from 'classnames';

import { useAppDispatch, useAppSelector } from 'common/hooks';
import { setErrorMes } from 'store/reducers/appSlice';

import styles from './ErrorPopup.module.scss';

const ErrorPopup: FC = (): JSX.Element => {
	const dispatch = useAppDispatch();
	const [isOpen, setIsOpen] = useState(false);
	const { errorMes } = useAppSelector((state) => state.app);

	const handlePopupClose = (): void => {
		setIsOpen(false);
		setTimeout(() => {
			dispatch(setErrorMes(''));
		}, 300);
	};

	useEffect(() => {
		let timer: NodeJS.Timeout;

		if (errorMes) {
			setIsOpen(true);
			timer = setTimeout(() => {
				handlePopupClose();
			}, 5000);
		}

		return () => clearTimeout(timer);
	}, [errorMes]);

	return createPortal(
		<div
			onClick={handlePopupClose}
			className={cn(styles.wrapper, { [styles.show]: isOpen })}>
			{errorMes}
		</div>,
		document.querySelector('body') as HTMLElement
	);
};

export default ErrorPopup;
