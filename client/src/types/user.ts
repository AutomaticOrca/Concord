export interface PhotoDto {
  id: number;
  url?: string;
  isMain: boolean;
}

export interface MemberDto {
  id: number;
  userName: string;
  age: number;
  photoUrl?: string;
  knownAs?: string;
  created: string;
  lastActive: string;
  gender?: string;
  introduction?: string;
  interests?: string;
  lookingFor?: string;
  city?: string;
  country?: string;
  photos?: PhotoDto[];
}

export interface MemberUpdateDto {
  introduction?: string;
  lookingFor?: string;
  interests?: string;
  city?: string;
  country?: string;
}

export interface UserParams {
  gender?: string;
  minAge?: number;
  maxAge?: number;
  pageNumber?: number;
  pageSize?: number;
  orderBy?: string;
}

export interface Pagination {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalCount: number;
}
