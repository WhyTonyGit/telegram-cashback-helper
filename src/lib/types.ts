export interface Bank {
  id: string;
  name: string;
  slug: string;
  logo_url: string;
  color: string;
}

export interface Category {
  id: string;
  name: string;
  emoji: string;
  slug: string;
}

export interface Cashback {
  category_id: string;
  percent: number;
}

export interface UserCard {
  id: string;
  label: string;
  bank: Bank;
  cashback: Cashback[];
}

export interface CardRecommendation {
  id: string;
  label: string;
  bank: Bank;
  cashback: Cashback[];
  percent: number | null;
}

export interface Recommendation {
  rank: number;
  card_id: string;
  label: string;
  bank: {
    name: string;
    logo_url: string;
    color: string;
  };
  percent: number | null;
}

export interface RecommendResponse {
  category: Category;
  results: Recommendation[];
}
