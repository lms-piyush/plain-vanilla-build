
export interface SessionFormData {
  title: string;
  description: string;
  session_number: number;
  session_date: string;
  start_time: string;
  end_time: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'upcoming';
  notes: string;
}

export const createInitialFormData = (): SessionFormData => ({
  title: '',
  description: '',
  session_number: 1,
  session_date: '',
  start_time: '',
  end_time: '',
  status: 'upcoming',
  notes: '',
});
