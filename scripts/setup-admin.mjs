import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://tkwqshhsmegirqmmjuyv.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRrd3FzaGhzbWVnaXJxbW1qdXl2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA2NTE1OTIsImV4cCI6MjEwNjIyNzU5Mn0.thF4wKT62uoOpTc6Sndaz_64bV24S4e2g3uG4QzoD9A";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function run() {
  console.log("Signing up user...");
  const { data, error } = await supabase.auth.signUp({
    email: 'lumeadmin@gmail.com',
    password: 'lumedocesadmin',
  });

  if (error) {
    console.error("Error signing up:", error);
    // If user already exists, it will throw an error or just return the user if confirm email is off.
  }

  const userId = data?.user?.id;
  console.log("User ID:", userId);

  if (!userId) {
    console.log("Could not get user ID. Attempting to log in to get it...");
    const { data: loginData } = await supabase.auth.signInWithPassword({
      email: 'lumeadmin@gmail.com',
      password: 'lumedocesadmin',
    });
    if (loginData?.user?.id) {
      console.log("Got user ID via login:", loginData.user.id);
      await insertRole(loginData.user.id);
    }
  } else {
    await insertRole(userId);
  }
}

async function insertRole(userId) {
  console.log("Inserting admin role for user", userId);
  const { error } = await supabase.from('user_roles').insert([
    { user_id: userId, role: 'admin' }
  ]);
  
  if (error) {
    console.error("Error inserting role:", error);
  } else {
    console.log("Admin role inserted successfully.");
  }
}

run();
