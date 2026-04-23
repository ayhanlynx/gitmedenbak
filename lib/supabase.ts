import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ykoinlcqripdyouuckkn.supabase.co'
const supabaseKey = 'sb_publishable_Y4bfmj-TeA50kyBaG0R8Lw_cLC-uehx'

export const supabase = createClient(supabaseUrl, supabaseKey)