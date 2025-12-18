export interface User {
    id: number;
    email: string;
    phone?: string;
    telegram?: string;
    contact_info?: string;
}

export interface Listing {
    id: number;
    title: string;
    description: string;
    price: number;
    category: string;
    location?: string;
    item_type?: string;
    origin?: string;
    destination?: string;
    contact_info?: string;
    owner_id: number;
}

export interface Subscription {
    id: number;
    user_id: number;
    keyword: string;
    student_name: string;
}

export interface AuthResponse {
    access_token: string;
    token_type: string;
    user: User;
}
