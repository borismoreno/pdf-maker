export class LoginDto {
    email: string;
    password: string;
}
export class LoginResponseDto {
    token: string;
    user: UserResponseDto;
}

export class UserResponseDto {
    _id: string;
    rol: string;
    estado: boolean;
    nombre: string;
    email: string;
    empresa: string;
    rucEmpresa: string;
    pagoRegistrado: boolean;
}
export class RefreshTokenDto {
    refresh_token: string;
}
export class RefreshTokenResponseDto {
    access_token: string;
}