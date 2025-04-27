
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

export function useTodayPrescriptionStats() {
  return useQuery({
    queryKey: ['prescriptions-stats-today'],
    queryFn: async () => {
      const today = new Date().toISOString().split('T')[0];
      
      // Get all prescriptions from today
      const { data: todayPrescriptions, error: todayError } = await supabase
        .from('prescriptions')
        .select('status')
        .gte('created_at', today)
        .lte('created_at', today + 'T23:59:59');

      if (todayError) throw todayError;

      const total = todayPrescriptions?.length || 0;
      const pending = todayPrescriptions?.filter(p => p.status === 'Pending').length || 0;
      const issued = todayPrescriptions?.filter(p => p.status === 'Issued').length || 0;

      return {
        total,
        pending,
        issued
      };
    }
  });
}
