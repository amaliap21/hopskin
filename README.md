# OrbiTB - Tuberculosis Treatment Adherence System

OrbiTB is an integrated digital system that uses daily monitoring, reminders, and decision support to help patients adhere to their tuberculosis treatment. The system combines medication adherence tracking, computer vision verification, symptom monitoring, and mental health support to improve treatment outcomes.

## Overview

OrbiTB shows how to improve treatment adherence and patient support during tuberculosis therapy in a workable and scalable way. The platform:

- **Supports patients** in sustaining long-term treatment adherence with minimal daily burden
- **Selectively engages caregivers** only when early behavioral or symptom-based warning signs emerge  
- **Enables healthcare workers** to prioritize care through structured, risk-based stratification rather than routine monitoring alone

By integrating these roles within a hierarchical escalation framework, OrbiTB balances patient autonomy with safety oversight, reduces preventable treatment interruptions, and strengthens continuity of care between clinical visits, particularly in resource-constrained settings.

## Key Features

### For Patients
- 💊 **Medication Reminders** - Daily alerts at predetermined medication schedule times
- 📸 **Visual Verification** - Camera-based proof of adherence using computer vision
- 🩺 **Symptom Check-ins** - Daily tracking of TB symptoms and treatment side effects
- 🧠 **Mental Health Monitoring** - Track mood, stress, motivation, and treatment burden
- 📊 **Progress Tracking** - View adherence rates, streaks, and supportive messages
- 💬 **Supportive Feedback** - Encouraging messages based on adherence patterns

### For Caregivers
- 🔔 **Smart Notifications** - Receive alerts only when patients show warning signs
- 👥 **Patient Monitoring** - Track adherence and well-being of assigned patients
- ⚠️ **Early Detection** - Get notified of concerning symptoms or disengagement risks

### For Healthcare Workers
- 📈 **Risk Dashboard** - View risk-stratified patient lists prioritized by need
- 🎯 **Decision Support** - AI-powered recommendations for intervention
- 📋 **Structured Monitoring** - Track adherence, symptoms, and mental health trends
- 🔄 **Escalation Management** - Manage notifications for missed doses and high-risk patients

## Technology Stack

- **Backend**: Django 4.2+ with Python
- **Database**: Supabase (PostgreSQL) or SQLite for development
- **Frontend**: React Native with Expo Go
- **API**: Django REST Framework
- **AI/CV**: Computer vision for medication verification (mock implementation included)
- **Authentication**: Django session authentication + token auth ready

## Installation

### Prerequisites
- Python 3.8+
- Node.js 16+ and npm
- Supabase account (optional, SQLite used by default)

### Backend Setup

1. Clone the repository:
```bash
git clone https://github.com/amaliap21/hopskin.git
cd hopskin
```

2. Install Python dependencies:
```bash
pip install -r requirements.txt
```

3. Configure environment variables (optional for Supabase):
```bash
cp .env.example .env
# Edit .env with your Supabase credentials
```

4. Run migrations:
```bash
python manage.py migrate
```

5. Create a superuser:
```bash
python manage.py createsuperuser
```

6. Start the development server:
```bash
python manage.py runserver
```

The backend will be available at `http://localhost:8000`

### Frontend Setup (Mobile App)

1. Navigate to mobile directory:
```bash
cd mobile
```

2. Install dependencies:
```bash
npm install
```

3. Start Expo:
```bash
npm start
```

4. Use Expo Go app on your phone to scan the QR code, or press:
   - `a` for Android emulator
   - `i` for iOS simulator (Mac only)
   - `w` for web browser

## Configuration

### Supabase Database Setup

1. Create a Supabase project at [supabase.com](https://supabase.com)

2. Get your database credentials from Project Settings > Database

3. Update `.env` file:
```
DATABASE_URL=postgresql://<username>:<password>@<host>:<port>/<database>
```

4. Run migrations to create tables in Supabase:
```bash
python manage.py migrate
```

## API Endpoints

### Authentication
- `POST /api-auth/login/` - Login
- `POST /api-auth/logout/` - Logout

### User Management
- `GET /api/profiles/` - Get user profiles
- `GET /api/profiles/{id}/` - Get specific profile

### Medication Management
- `GET /api/schedules/` - List medication schedules
- `POST /api/schedules/` - Create medication schedule
- `GET /api/intakes/` - List medication intakes
- `GET /api/intakes/pending/` - Get today's pending intakes
- `POST /api/intakes/{id}/verify/` - Verify intake with image
- `GET /api/intakes/adherence_stats/` - Get adherence statistics

### Health Check-ins
- `POST /api/symptoms/` - Submit symptom check-in
- `GET /api/symptoms/` - List symptom check-ins
- `POST /api/mental-health/` - Submit mental health check-in
- `GET /api/mental-health/` - List mental health check-ins

### Notifications
- `GET /api/notifications/` - List notifications
- `POST /api/notifications/{id}/mark_read/` - Mark as read
- `POST /api/notifications/mark_all_read/` - Mark all as read

### Risk Assessment (Healthcare Workers Only)
- `GET /api/risk-assessment/dashboard/` - Get patient risk dashboard

## User Roles

### Patient
- Log medication intake with camera verification
- Complete daily symptom and mental health check-ins
- View adherence statistics and supportive messages
- Receive medication reminders

### Caregiver
- Monitor assigned patients
- Receive alerts for concerning symptoms or missed doses
- View patient adherence and well-being data

### Healthcare Worker
- Access risk-stratified dashboard
- Monitor multiple patients
- Receive intervention recommendations
- Manage escalations

## Computer Vision Verification

The system uses computer vision to verify medication intake:

1. **Medication Detection** - Identifies pills/tablets in the image
2. **Face Detection** - Confirms patient's face is present
3. **Position Verification** - Validates medication is positioned near mouth
4. **Confidence Scoring** - Provides confidence levels for verification

**Note**: The current implementation includes a mock CV module. For production, integrate actual trained computer vision models using TensorFlow, PyTorch, or YOLO.

## Risk Assessment

OrbiTB calculates risk scores based on:

- **Adherence Risk** (40% weight) - Percentage of missed doses
- **Symptom Risk** (30% weight) - Severity of reported symptoms
- **Mental Health Risk** (30% weight) - Disengagement indicators

Risk levels:
- **High** (≥60): Immediate intervention required
- **Medium** (30-59): Monitor closely
- **Low** (<30): Routine monitoring

## Escalation System

1. **Medication scheduled** → Reminder sent 15 minutes before
2. **Scheduled time reached** → Alert sent to patient
3. **60 minutes after scheduled time** → Escalation to caregiver
4. **High-risk symptoms detected** → Immediate alert to healthcare worker

## Development

### Project Structure
```
hopskin/
├── backend/          # Django settings and config
├── orbitb/           # Main OrbiTB app
│   ├── models.py     # Database models
│   ├── views.py      # API views
│   ├── serializers.py # API serializers
│   ├── cv_utils.py   # Computer vision utilities
│   └── admin.py      # Django admin config
├── mobile/           # React Native Expo app
│   ├── App.js        # Main app component
│   └── ...           # React Native components
├── manage.py         # Django management script
└── requirements.txt  # Python dependencies
```

### Running Tests
```bash
python manage.py test orbitb
```

### Admin Interface
Access Django admin at `http://localhost:8000/admin/` to manage:
- User profiles and roles
- Medication schedules
- Check-in data
- Notifications

## Security Considerations

1. **Authentication**: All API endpoints require authentication
2. **Role-based Access**: Users can only access their own data or managed patients
3. **Image Data**: Verification images should be stored securely
4. **HTTPS**: Use HTTPS in production
5. **Environment Variables**: Never commit secrets to version control

## Future Enhancements

- Actual trained CV models for medication verification
- Push notifications for mobile app
- SMS/WhatsApp integration for reminders
- Multi-language support
- Offline mode for mobile app
- Data export for clinical analysis
- Integration with electronic health records (EHR)

## Contributing

This project was developed for healthcare innovation and TB treatment adherence improvement. Contributions are welcome!

## License

MIT License

## Acknowledgments

OrbiTB demonstrates a practical and scalable approach to improving treatment adherence and patient support during tuberculosis therapy through the integration of software development and artificial intelligence techniques.