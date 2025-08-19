# Impact India Challenge - Supabase Setup Guide

This guide will help you set up Supabase for the Impact India Challenge registration system.

## Prerequisites

1. A Supabase account (sign up at [supabase.com](https://supabase.com))
2. Basic understanding of SQL and database concepts

## Step 1: Create a New Supabase Project

1. Log in to your Supabase dashboard
2. Click "New Project"
3. Choose your organization
4. Fill in project details:
   - **Name**: Impact India Challenge
   - **Database Password**: Choose a secure password
   - **Region**: Select the closest region to your users
5. Click "Create new project"
6. Wait for the project to be set up (usually takes 1-2 minutes)

## Step 2: Configure Database Schema

1. Go to the SQL Editor in your Supabase dashboard
2. Copy the entire content of `schema.sql` file
3. Paste it into the SQL Editor
4. Click "Run" to execute the schema
5. Verify that the tables were created successfully by checking the Table Editor

## Step 3: Get Your Project Credentials

1. Go to Settings → API in your Supabase dashboard
2. Copy the following values:
   - **Project URL** (something like `https://xxxxx.supabase.co`)
   - **Project API Key** (anon/public key)

## Step 4: Update Registration JavaScript

1. Open `register.js` file
2. Replace the placeholder values with your actual Supabase credentials:

```javascript
const SUPABASE_URL = 'https://your-project-id.supabase.co';
const SUPABASE_ANON_KEY = 'your-anon-key-here';
```

## Step 5: Test the Registration System

1. Open `register.html` in your browser
2. Fill out the registration form with test data
3. Submit the form
4. Check your Supabase Table Editor to verify the data was inserted

## Database Schema Overview

### Tables Created

1. **teams**
   - `id`: Primary key (auto-increment)
   - `team_name`: Unique team name
   - `team_email`: Team contact email (unique)
   - `team_phone`: Team contact phone
   - `registration_status`: pending/confirmed/cancelled
   - `created_at` & `updated_at`: Timestamps

2. **team_members**
   - `id`: Primary key (auto-increment)
   - `team_id`: Foreign key to teams table
   - `name`: Member's full name
   - `email`: Member's email
   - `phone`: Member's phone number
   - `year`: Academic year/status
   - `college`: Institution name
   - `is_leader`: Boolean flag for team leader
   - `created_at` & `updated_at`: Timestamps

### Constraints and Features

- Each team must have exactly 4 members
- Each team can have only one leader
- Email validation for both team and member emails
- Automatic timestamp updates
- Row Level Security (RLS) enabled
- Indexes for performance optimization

## Step 6: Configure Row Level Security (Optional)

The schema includes basic RLS policies that allow:
- Public read access to view teams and members
- Authenticated insert access for new registrations

For production, you might want to create more restrictive policies.

## Step 7: Set Up Email Notifications (Optional)

1. Go to Authentication → Settings in Supabase
2. Configure SMTP settings for email notifications
3. Create email templates for registration confirmations

## Environment Variables for Production

For production deployment, consider using environment variables:

```javascript
const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL || 'your-fallback-url';
const SUPABASE_ANON_KEY = process.env.REACT_APP_SUPABASE_ANON_KEY || 'your-fallback-key';
```

## Database Functions Available

### `get_registration_stats()`
Returns JSON with registration statistics:
```sql
SELECT get_registration_stats();
```

### `generate_registration_id(team_id)`
Generates formatted registration ID:
```sql
SELECT generate_registration_id(1); -- Returns 'IIC-000001'
```

## Monitoring and Analytics

1. Use Supabase's built-in analytics dashboard
2. Monitor registration patterns in the logs
3. Set up alerts for high registration volumes

## Backup and Security

1. **Database Backups**: Supabase automatically backs up your database
2. **API Security**: The anon key is safe for client-side use
3. **Data Validation**: All validation happens both client-side and database-side

## Troubleshooting

### Common Issues

1. **CORS Errors**: Make sure your domain is allowed in Supabase settings
2. **RLS Policies**: If queries fail, check Row Level Security policies
3. **Schema Updates**: Use migrations for schema changes in production

### Error Handling

The registration form includes comprehensive error handling:
- Network connectivity issues
- Validation errors
- Database constraint violations
- Duplicate registrations

## Testing Checklist

- [ ] Database schema created successfully
- [ ] Test team registration works
- [ ] Duplicate team names are rejected
- [ ] Duplicate emails are rejected
- [ ] Team member count constraint works (max 4 members)
- [ ] Team leader constraint works (exactly 1 leader)
- [ ] Registration ID generation works
- [ ] Email validation works
- [ ] Phone number validation works

## Production Deployment Notes

1. **Domain Configuration**: Add your production domain to Supabase allowed origins
2. **Environment Variables**: Use proper environment variable management
3. **SSL Certificate**: Ensure your site uses HTTPS
4. **Performance**: Monitor query performance and add indexes as needed
5. **Scaling**: Supabase automatically scales, but monitor usage

## Support

For Supabase-specific issues:
- Documentation: [docs.supabase.com](https://docs.supabase.com)
- Community: [github.com/supabase/supabase/discussions](https://github.com/supabase/supabase/discussions)
- Support: Available through Supabase dashboard

For this project's registration system:
- Check the browser console for JavaScript errors
- Verify network requests in browser dev tools
- Test with different browsers and devices
