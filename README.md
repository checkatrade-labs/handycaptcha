# HandyCAPTCHA 🏠

> The first CAPTCHA service designed specifically for the home improvement industry. Verify users while showcasing your expertise.

**Note: This is a fun concept/demo project showcasing what a home improvement-themed CAPTCHA service could look like. While the demo is functional, this is not a production service. Feel free to explore the code and try it out!**

## Overview

HandyCAPTCHA is a unique CAPTCHA service that replaces traditional text recognition with home improvement challenges. Users verify their humanity by identifying common household issues like leaking taps, cracked brickwork, or faulty electrical installations.

### Why HandyCAPTCHA?

- **Industry Relevant**: Showcase your expertise while securing your forms
- **User Engagement**: Turn security into an interactive experience
- **Brand Alignment**: Perfect for construction, home improvement, and property websites
- **Educational**: Users learn to identify common household issues

## Features

### Core CAPTCHA Types

1. **Plumbing Verification**
   - Identify leaking taps
   - Spot incorrect pipe installations
   - Recognize water damage signs

2. **Construction Challenges**
   - Find cracks in brickwork
   - Identify structural issues
   - Spot unsafe scaffolding

3. **Electrical Safety**
   - Identify faulty sockets
   - Spot dangerous wiring
   - Recognize overloaded circuits

4. **General Maintenance**
   - Find signs of damp
   - Identify roof damage
   - Spot uneven flooring

### Integration Features

- Simple drop-in JavaScript widget
- React/Vue/Angular components
- Mobile-responsive design
- Customizable themes and styles
- Localization support

### Analytics Dashboard

- Success/failure rates
- Average completion time
- Most challenging issues
- User engagement metrics
- Geographic data

## Technical Architecture

### Frontend Stack

- **Framework**: Next.js with TypeScript
- **Styling**: TailwindCSS and Shadcn/ui
- **State Management**: React Context + Hooks
- **Testing**: Jest + React Testing Library

### Backend Services

- **API**: Node.js/Express
- **Database**: Postgres
- **Authentication**: JWT
- **Caching**: Redis
- **Image Processing**: Sharp
- **Hosting**: Google Cloud Platform

### API Structure

```typescript
interface CaptchaProps {
  siteKey: string;
  theme?: 'light' | 'dark';
  onVerify?: (response: CaptchaResponse) => void;
  onError?: (error: Error) => void;
  debug?: boolean;
}

interface CaptchaResponse {
  success: boolean;
  score: number;
  challenge_ts: string;
  hostname: string;
  error_codes?: string[];
}

interface Challenge {
  id: string;
  type: string;
  question: string;
  imageUrl: string;
  difficulty: 'easy' | 'medium' | 'hard';
  regions: ChallengeRegion[];
}
```

## Pricing Tiers

### Free Tier
- 1,000 verifications/month
- Basic reporting
- Standard themes
- Community support

### Pro Tier ($29/month)
- 10,000 verifications/month
- Advanced analytics
- Custom branding
- Priority support
- API access

### Enterprise Tier (Custom pricing)
- Unlimited verifications
- Custom challenge types
- Dedicated support
- SLA guarantee
- Self-hosting options

## Development Roadmap

### Phase 1: MVP (Q1 2025)
- [x] Basic CAPTCHA functionality
- [x] Developer documentation
- [x] Simple integration widget
- [x] Basic analytics

### Phase 2: Enhanced Features (Q2 2025)
- [ ] Advanced analytics dashboard
- [ ] Custom branding options
- [ ] Additional challenge types
- [ ] Mobile SDK

### Phase 3: Enterprise Features (Q3 2025)
- [ ] Self-hosting solution
- [ ] Custom challenge creation
- [ ] AI-powered difficulty adjustment
- [ ] Advanced security features

## Integration Example

```javascript
// Install
npm install handycaptcha

// Use in your React component
import { HandyCAPTCHA } from 'handycaptcha';

function ContactForm() {
  const onVerify = (response) => {
    console.log('Verification successful:', response);
  };

  return (
    <HandyCAPTCHA
      siteKey="your_site_key"
      theme="light"
      onVerify={onVerify}
    />
  );
}
```

## Getting Started

1. Sign up at [handycaptcha.com](https://handycaptcha.com/signup)
2. Create a new site and get your API keys
3. Choose your integration method
4. Add the widget to your site
5. Monitor results in your dashboard

## Security Considerations

- Multiple challenge types to prevent automation
- AI-powered fraud detection
- Rate limiting and abuse prevention
- Regular security audits
- GDPR and CCPA compliant

## Support

- Documentation: [handycaptcha.com/docs](https://handycaptcha.com/docs)
- Support: [handycaptcha.com/help](https://handycaptcha.com/help)
- Status: [handycaptcha.com/status](https://handycaptcha.com/status)
- Email: james.pain@checkatrade.com

## Contributing

We welcome contributions! Check out our issues on [GitHub](https://github.com/checkatrade-labs/handycaptcha/issues).

## License

HandyCAPTCHA is licensed under the MIT License. See [LICENSE](LICENSE) for more information.
