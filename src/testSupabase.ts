import { supabase } from "./lib/supabase";

export async function testSupabase() {
  console.log("🔍 Testing Supabase connection...");

  try {
    const { data, error } = await supabase.from("users").select("*").limit(1);

    if (error) {
      console.error("❌ Supabase error:", error.message);
    } else {
      console.log("✅ Supabase connected! Sample data:", data);
    }
  } catch (err) {
    console.error("⚠️ Unexpected error:", err);
  }
}
