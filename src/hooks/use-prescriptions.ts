
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const usePrescriptions = () => {
  return useQuery({
    queryKey: ['prescriptions', 'pending'],
    queryFn: async () => {
      try {
        // Modify the query to avoid the recursion in RLS policies
        const { data, error } = await supabase
          .from('prescriptions')
          .select(`
            id,
            medicines,
            status,
            created_at,
            patient_id,
            patients:patient_id (
              id,
              name,
              phone_number
            )
          `)
          .eq('status', 'Pending')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching prescriptions:', error);
          throw new Error(error.message);
        }

        // Transform the data to match the expected structure in your component
        const transformedData = data.map(prescription => ({
          ...prescription,
          patient: prescription.patients
        }));

        return transformedData || [];
      } catch (error) {
        console.error('Error in usePrescriptions:', error);
        throw error;
      }
    },
  });
};

export const useTodayPrescriptionStats = () => {
  return useQuery({
    queryKey: ['prescriptions', 'stats', 'today'],
    queryFn: async () => {
      // Get today's date in ISO format (YYYY-MM-DD)
      const today = new Date().toISOString().split('T')[0];
      
      // Fetch all prescriptions from today
      const { data, error } = await supabase
        .from('prescriptions')
        .select('id, status')
        .gte('created_at', `${today}T00:00:00`)
        .lte('created_at', `${today}T23:59:59`);

      if (error) {
        console.error('Error fetching today stats:', error);
        throw new Error(error.message);
      }

      // Calculate stats
      const stats = {
        total: data?.length || 0,
        pending: data?.filter(p => p.status === 'Pending').length || 0,
        issued: data?.filter(p => p.status === 'Issued').length || 0
      };

      return stats;
    },
  });
};
