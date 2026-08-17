import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://usyqfdeqsicrwapmeydr.supabase.co';

const supabaseKey = 'sb_publishable_BKQblLJkx03A8ttgC0dL6A_LU_ALEz3';

export const supabase = createClient(supabaseUrl, supabaseKey);
