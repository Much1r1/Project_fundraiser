import { supabase } from "./lib/supabase";

async function testAuth() {
  const { data, error } = await supabase.auth.signUp({
    email: "testuser@example.com",
    password: "supersecret",
  });
  console.log("Signup:", data, error);

  const { data: loginData, error: loginError } =
    await supabase.auth.signInWithPassword({
      email: "testuser@example.com",
      password: "supersecret",
    });
  console.log("Login:", loginData, loginError);
}

testAuth();
