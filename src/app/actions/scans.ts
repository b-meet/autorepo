'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export type Scan = {
  id: string;
  user_id: string;
  repo_url: string;
  repo_name: string;
  readme_content: string | null;
  metadata: any | null;
  created_at: string;
  updated_at: string;
};

export async function getScans() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return [];

  const { data, error } = await supabase
    .from('scans')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching scans:', error);
    return [];
  }

  return data as Scan[];
}

export async function saveScan(repoData: any, readmeContent: string, style: string, vibe: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('scans')
    .insert({
      user_id: user.id,
      repo_url: repoData.url || '',
      repo_name: repoData.name,
      readme_content: readmeContent,
      metadata: { ...repoData, selectedStyle: style, vibePrompt: vibe },
    })
    .select()
    .single();

  if (error) {
    console.error('Error saving scan:', error);
    throw error;
  }

  revalidatePath('/');
  return data as Scan;
}

export async function updateScan(id: string, name: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from('scans')
    .update({ repo_name: name, updated_at: new Date().toISOString() })
    .eq('id', id);

  if (error) {
    console.error('Error updating scan:', error);
    throw error;
  }

  revalidatePath('/');
}

export async function deleteScan(id: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from('scans')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting scan:', error);
    throw error;
  }

  revalidatePath('/');
}
