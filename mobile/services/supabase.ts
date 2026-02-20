import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = 'https://sjmvmavwndbnfvntnosu.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNqbXZtYXZ3bmRibmZ2bnRub3N1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA3MTcyOTcsImV4cCI6MjA4NjI5MzI5N30.rsoNxPJLfmTy1d03EmhUZRccv8nbhezoDAVkqUfRDS8';

export const supabase = createClient(supabaseUrl, supabaseKey);

// Authentication functions
export const registerUser = async (email: string, password: string, role: string, phoneNumber: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        role,
        phone_number: phoneNumber,
      },
    },
  });
  if (error) throw error;
  return data;
};

export const loginUser = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw error;
  return data;
};

export const forgotPassword = async (email: string) => {
  const { data, error } = await supabase.auth.resetPasswordForEmail(email);
  if (error) throw error;
  return data;
};
