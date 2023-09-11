import React, { forwardRef, DetailedHTMLProps, InputHTMLAttributes } from 'react';

import cn from 'classnames';

import styles from './Input.module.scss';

interface IInput
	extends DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
	wrapperClassName?: string;
	error?: string;
}

const Input = forwardRef<HTMLInputElement, IInput>(
	(
		{ error, wrapperClassName, className, placeholder, ...restProps },
		ref
	): JSX.Element => {
		return (
			<div className={cn(styles.wrapper, wrapperClassName)}>
				<input
					className={cn(styles.input, className, { [styles.error]: !!error })}
					placeholder={placeholder}
					ref={ref}
					{...restProps}
				/>
				{placeholder && <span className={styles.placeholder}>{placeholder}</span>}
				{error && <p className={styles.errorMes}>{error}</p>}
			</div>
		);
	}
);

export default Input;
