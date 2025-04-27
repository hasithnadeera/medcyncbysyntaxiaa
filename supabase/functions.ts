
export const createSearchFunctions = `
-- Function to search patients by name
CREATE OR REPLACE FUNCTION public.search_patients_by_name(search_term TEXT)
RETURNS SETOF public.users
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT * FROM public.users 
  WHERE role = 'patient' AND name ILIKE search_term;
$$;

-- Function to search patients by ID number
CREATE OR REPLACE FUNCTION public.search_patients_by_id(id_number_param TEXT)
RETURNS SETOF public.users
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT * FROM public.users 
  WHERE role = 'patient' AND id_number = id_number_param;
$$;

-- Function to search patients by phone number
CREATE OR REPLACE FUNCTION public.search_patients_by_phone(phone_param TEXT)
RETURNS SETOF public.users
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT * FROM public.users 
  WHERE role = 'patient' AND phone_number = phone_param;
$$;
`;
