import {useState, useCallback} from 'react';


export interface UseModalReturnType<T = void, R = void> {
	show: boolean;
	open: (data?: T, callback?: (result: R) => void) => void;
	close: () => void;
	data: T | null;
	resolve: ((result: R) => void) | null;
}

export function useModal<T = void, R = void>(): UseModalReturnType<T, R> {
	const [show, setShow] = useState(false);
	const [data, setData] = useState<T | null>(null);
	const [resolve, setResolve] = useState<((result: R) => void) | null>(null);


	const open = useCallback((value?: T, callback?: (result: R) => void) => {
		setData(value ?? null);
		setResolve(() => callback ?? null);
		setShow(true);
	}, []);

	const close = useCallback(() => {
		setShow(false);
		setResolve(null);
		setData(null);
	}, []);

	return {show, open, close, data, resolve};
}
