
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function usePrescriptions() {
  return useQuery({
    queryKey: ['prescriptions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('prescriptions')
        .select(`
          *,
          patient:users(
            name,
            phone_number
          )
        `)
        .eq('status', 'Pending')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    }
  });
}
