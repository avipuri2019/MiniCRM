export interface User {
  id: string;
  email: string;
  password_hash: string;
  role: 'rep' | 'manager';
  created_at: string;
}

export interface Lead {
  id: string;
  owner_id: string;
  name: string;
  company?: string;
  status: 'new' | 'working' | 'qualified' | 'disqualified';
  created_at: string;
}

export interface Account {
  id: string;
  owner_id: string;
  name: string;
  industry?: string;
  created_at: string;
  activity_count?: number;
}

export interface Activity {
  id: string;
  account_id: string;
  user_id: string;
  type: 'call' | 'email' | 'demo';
  notes?: string;
  next_follow_up?: string;
  created_at: string;
}

export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
}
