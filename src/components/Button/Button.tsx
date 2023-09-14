import React, { DetailedHTMLProps, FC, ButtonHTMLAttributes } from 'react';
import cn from 'classnames';

import styles from './Button.module.scss';

interface IButton
	extends DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> {
	variant?: 'default' | 'success' | 'error';
}

const Button: FC<IButton> = ({
	className,
	variant,
	children,
	disabled,
	...restProps
}) => {
	const buttonClassName = cn(
		styles.button,
		className,
		disabled || 
		{
			[styles.default]: variant === 'default' || !variant,
			[styles.success]: variant === 'success',
			[styles.error]: variant === 'error',
		}
	);

	return (
		<button disabled={disabled} className={buttonClassName} {...restProps}>
			{children}
		</button>
	);
};

export default Button;
