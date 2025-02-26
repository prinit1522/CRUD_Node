import { IsEmail, Length } from "class-validator";

export class RegisterInput {
    @IsEmail()
    email!: string;
    
    @Length(3,50)
    name!: string;
    
    @Length(6,12)
    password!: string;
}
