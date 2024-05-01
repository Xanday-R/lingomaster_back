import {Languages} from '../enums/languages.enum';

export interface User {
    id:number,
    email: string,
    login: string,
    native_language: Languages,
    img: string,
    password: string
}