
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

/**
 * Checks if the current user is authenticated as a doctor
 * @returns {Promise<boolean>} Returns true if the user is authenticated as a doctor
 */
export const checkDoctorAccess = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { authorized: false, message: "Please login to access the dashboard" };
    }

    // Get user profile including role
    const { data, error } = await supabase.rpc('get_user_profile', {
      user_id: user.id
    });

    if (error) {
      console.error("Error fetching user data:", error);
      return { authorized: false, message: "Could not verify your access" };
    }

    if (!data || data.length === 0 || data[0].role !== 'doctor') {
      return { authorized: false, message: "Unauthorized access. This area is for doctors only." };
    }

    return { authorized: true, userData: data[0] };
  } catch (error) {
    console.error("Error in checkDoctorAccess:", error);
    return { authorized: false, message: "An unexpected error occurred" };
  }
};

/**
 * Custom hook to check doctor access and redirect if unauthorized
 * @returns {Object} Object containing authorization status and doctor data
 */
export const useDoctorAuth = () => {
  const navigate = useNavigate();
  
  const checkAccess = async () => {
    const authResult = await checkDoctorAccess();
    
    if (!authResult.authorized) {
      toast.error(authResult.message);
      navigate('/login');
      return null;
    }
    
    return authResult.userData;
  };
  
  return { checkAccess };
};
