export interface RegisterDto {
    username: string;
    knownAs: string;
    gender: string;
    dateOfBirth: string;
    city: string;
    country: string;
    password: string;
}

export interface LoginDto {
    username: string;
    password: string;
}

export interface UserDto {
    username: string;
    token: string;
    knownAs: string;
    gender: string;
    photoUrl?: string;
}
