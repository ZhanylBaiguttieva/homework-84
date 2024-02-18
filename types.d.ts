import {Model} from "mongoose";

export interface  UserFields {
    username: string,
    password: string,
    token: string,
}

interface UserMethods {
    checkPassword(password: string): Promise<boolean>;
    generateToken():void;
}

type UserModel = Model<UserFields, {}, UserMethods>
export interface Task {
    user: string,
    title: string,
    description: string,
    status: string
}