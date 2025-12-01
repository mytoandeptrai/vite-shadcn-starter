import type { FC, PropsWithChildren } from "react";
import type { EMedia } from "@/constant";

export type FCC<P = {}> = FC<PropsWithChildren<P>>;

export type TOptional<T> = T | undefined;

export interface IMedia {
	id?: string;
	url: string;
	type?: EMedia;
	file?: File | null;
}

export interface IAxiosResponse<T = unknown> {
	meta: IMeta;
	data: T;
}

export interface IMeta {
	code: number;
	message: string | string[];
	exception: string;
	path: string;
}