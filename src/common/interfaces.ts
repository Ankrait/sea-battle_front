import { DetailedHTMLProps, AllHTMLAttributes } from 'react';

export interface IHtmlProps<E extends HTMLElement = HTMLDivElement>
	extends DetailedHTMLProps<AllHTMLAttributes<E>, E> {}

export interface IPosition {
	x: number;
	y: number;
}
