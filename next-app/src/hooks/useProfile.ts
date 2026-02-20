// Typical useProfile.ts content
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useUser } from './useUser';

interface Profile {
  id: string;
  first_name: string;
  last_name: string;
  role: 'buyer' | 'seller' | 'admin';
  created_at: string;
}

export function useProfile() {
  const { user } = useUser();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setProfile(null);
      setLoading(false);
      return;
    }

    const fetchProfile = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
      } else {
        setProfile(data);
      }
      setLoading(false);
    };

    fetchProfile();
  }, [user]);

  return { profile, loading };
}