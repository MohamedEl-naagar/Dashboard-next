import { createClient } from '@supabase/supabase-js'

// const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
// const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient("https://fsaygmfbvevlwsauxoqt.supabase.co","eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZzYXlnbWZidmV2bHdzYXV4b3F0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY3NTU0MjcsImV4cCI6MjA3MjMzMTQyN30.oMULpuF8dh6JQTBsmORqR4p-nYUfzudu6ZuliaWGx8M")
