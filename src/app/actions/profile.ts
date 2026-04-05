'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export type ProfileData = {
  full_name?: string;
  username?: string;
  avatar_bg_color?: string;
};

export async function updateProfile(data: ProfileData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error('User not authenticated');

  const { error } = await supabase
    .from('profiles')
    .update({
      full_name: data.full_name,
      username: data.username,
      avatar_bg_color: data.avatar_bg_color,
      updated_at: new Date().toISOString()
    })
    .eq('id', user.id);

  if (error) {
    console.error('Error updating profile:', error);
    throw error;
  }

  revalidatePath('/');
}
