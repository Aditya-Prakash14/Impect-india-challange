-- Impact India Challenge Registration Database Schema
-- This file contains the SQL schema for creating the necessary tables in Supabase

-- Create teams table
CREATE TABLE IF NOT EXISTS public.teams (
    id BIGSERIAL PRIMARY KEY,
    team_name VARCHAR(255) NOT NULL UNIQUE,
    team_email VARCHAR(255) NOT NULL UNIQUE,
    team_phone VARCHAR(20) NOT NULL,
    registration_status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create team_members table
CREATE TABLE IF NOT EXISTS public.team_members (
    id BIGSERIAL PRIMARY KEY,
    team_id BIGINT NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    year VARCHAR(50) NOT NULL,
    college VARCHAR(255) NOT NULL,
    is_leader BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_teams_email ON public.teams(team_email);
CREATE INDEX IF NOT EXISTS idx_teams_created_at ON public.teams(created_at);
CREATE INDEX IF NOT EXISTS idx_team_members_team_id ON public.team_members(team_id);
CREATE INDEX IF NOT EXISTS idx_team_members_email ON public.team_members(email);
CREATE INDEX IF NOT EXISTS idx_team_members_is_leader ON public.team_members(is_leader);

-- Create a trigger to update the updated_at column automatically
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply the trigger to both tables
CREATE TRIGGER update_teams_updated_at 
    BEFORE UPDATE ON public.teams 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_team_members_updated_at 
    BEFORE UPDATE ON public.team_members 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Add constraints to ensure data integrity
ALTER TABLE public.team_members 
ADD CONSTRAINT check_email_format 
CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');

ALTER TABLE public.teams 
ADD CONSTRAINT check_team_email_format 
CHECK (team_email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');

-- Add constraint to ensure exactly one team leader per team
CREATE UNIQUE INDEX IF NOT EXISTS idx_one_leader_per_team 
ON public.team_members(team_id) 
WHERE is_leader = TRUE;

-- Add constraint to ensure exactly 4 members per team
CREATE OR REPLACE FUNCTION check_team_member_count()
RETURNS TRIGGER AS $$
BEGIN
    IF (SELECT COUNT(*) FROM public.team_members WHERE team_id = NEW.team_id) >= 4 THEN
        RAISE EXCEPTION 'A team cannot have more than 4 members';
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER check_team_member_count_trigger
    BEFORE INSERT ON public.team_members
    FOR EACH ROW EXECUTE FUNCTION check_team_member_count();

-- Create a view for team statistics
CREATE OR REPLACE VIEW public.team_stats AS
SELECT 
    t.id,
    t.team_name,
    t.team_email,
    t.registration_status,
    t.created_at,
    COUNT(tm.id) as member_count,
    json_agg(
        json_build_object(
            'name', tm.name,
            'email', tm.email,
            'phone', tm.phone,
            'year', tm.year,
            'college', tm.college,
            'is_leader', tm.is_leader
        ) ORDER BY tm.is_leader DESC, tm.created_at
    ) as members
FROM public.teams t
LEFT JOIN public.team_members tm ON t.id = tm.team_id
GROUP BY t.id, t.team_name, t.team_email, t.registration_status, t.created_at
ORDER BY t.created_at DESC;

-- Row Level Security (RLS) policies
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;

-- Policy for teams table - allow read access to all, insert for authenticated users
CREATE POLICY "Allow public read access to teams" ON public.teams
    FOR SELECT USING (true);

CREATE POLICY "Allow authenticated insert to teams" ON public.teams
    FOR INSERT WITH CHECK (true);

-- Policy for team_members table - allow read access to all, insert for authenticated users
CREATE POLICY "Allow public read access to team_members" ON public.team_members
    FOR SELECT USING (true);

CREATE POLICY "Allow authenticated insert to team_members" ON public.team_members
    FOR INSERT WITH CHECK (true);

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON public.teams TO anon, authenticated;
GRANT ALL ON public.team_members TO anon, authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;

-- Insert sample data for testing (optional)
-- Uncomment the following lines if you want to insert sample data

/*
INSERT INTO public.teams (team_name, team_email, team_phone, registration_status) VALUES
('Sample Team 1', 'team1@example.com', '+1234567890', 'confirmed'),
('Sample Team 2', 'team2@example.com', '+1234567891', 'pending');

INSERT INTO public.team_members (team_id, name, email, phone, year, college, is_leader) VALUES
(1, 'John Doe', 'john@example.com', '+1234567890', '3rd Year', 'Example University', true),
(1, 'Jane Smith', 'jane@example.com', '+1234567891', '3rd Year', 'Example University', false),
(1, 'Bob Johnson', 'bob@example.com', '+1234567892', '2nd Year', 'Example University', false),
(1, 'Alice Brown', 'alice@example.com', '+1234567893', '4th Year', 'Example University', false);
*/

-- Create a function to get registration statistics
CREATE OR REPLACE FUNCTION get_registration_stats()
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    SELECT json_build_object(
        'total_teams', (SELECT COUNT(*) FROM public.teams),
        'confirmed_teams', (SELECT COUNT(*) FROM public.teams WHERE registration_status = 'confirmed'),
        'pending_teams', (SELECT COUNT(*) FROM public.teams WHERE registration_status = 'pending'),
        'total_participants', (SELECT COUNT(*) FROM public.team_members),
        'registrations_today', (SELECT COUNT(*) FROM public.teams WHERE DATE(created_at) = CURRENT_DATE),
        'registrations_this_week', (SELECT COUNT(*) FROM public.teams WHERE created_at >= date_trunc('week', CURRENT_DATE))
    ) INTO result;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Create a function to generate registration ID
CREATE OR REPLACE FUNCTION generate_registration_id(team_id_param BIGINT)
RETURNS TEXT AS $$
BEGIN
    RETURN 'IIC-' || LPAD(team_id_param::TEXT, 6, '0');
END;
$$ LANGUAGE plpgsql;

-- Comments for documentation
COMMENT ON TABLE public.teams IS 'Stores team registration information for Impact India Challenge';
COMMENT ON TABLE public.team_members IS 'Stores individual team member information';
COMMENT ON COLUMN public.teams.registration_status IS 'Status of team registration: pending, confirmed, cancelled';
COMMENT ON COLUMN public.team_members.is_leader IS 'Indicates if this member is the team leader';
COMMENT ON VIEW public.team_stats IS 'Aggregated view of teams with their members';
COMMENT ON FUNCTION get_registration_stats() IS 'Returns overall registration statistics';
COMMENT ON FUNCTION generate_registration_id(BIGINT) IS 'Generates a formatted registration ID for a team';
