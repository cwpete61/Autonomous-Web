import { OutreachAgent } from './outreach-agent';

describe('OutreachAgent — validateCompliance()', () => {
  let agent: OutreachAgent;

  beforeEach(() => {
    agent = new OutreachAgent();
  });

  it('should return valid: true for body with unsubscribe and address', () => {
    const body = 'Hello, this is a web design inquiry. unsubscribe here. 123 Main St, Austin TX';
    const result = agent.validateCompliance(body);
    expect(result.valid).toBe(true);
    expect(result.reasons).toHaveLength(0);
  });

  it('should fail if unsubscribe keyword is missing', () => {
    const body = 'Hello, this is a web design inquiry. 123 Main St, Austin TX';
    const result = agent.validateCompliance(body);
    expect(result.valid).toBe(false);
    expect(result.reasons).toContain('Missing unsubscribe or opt-out mechanism');
  });

  it('should fail if physical address is missing', () => {
    const body = 'Hello, this is a web design inquiry. unsubscribe here.';
    const result = agent.validateCompliance(body);
    expect(result.valid).toBe(false);
    expect(result.reasons).toContain('Missing physical postal address');
  });

  it('should allow "opt out" or "remove me" as unsubscribe alternatives', () => {
    expect(agent.validateCompliance('opt out 123 Main St').valid).toBe(true);
    expect(agent.validateCompliance('remove me 123 Main St').valid).toBe(true);
  });
});

describe('OutreachAgent — generateInitialEmail()', () => {
  let agent: OutreachAgent;

  beforeEach(() => {
    agent = new OutreachAgent({ anthropicApiKey: 'test-key' });
    // Mock callClaude to avoid real API calls
    jest.spyOn(agent as any, 'callClaude').mockResolvedValue({
      subjectLine: 'MOCKED SUBJECT',
      emailBody: 'MOCKED BODY',
      toneNotes: 'MOCKED TONE'
    });
  });

  it('should call Claude with lead information', async () => {
    const lead = {
      name: 'Test Biz',
      industry: 'HVAC',
      website: 'test.com',
      googleRating: 4.5,
      googleReviews: 10,
      issues: ['No SSL']
    };

    const email = await agent.generateInitialEmail(lead);
    expect(email.subjectLine).toBe('MOCKED SUBJECT');
    expect(email.emailBody).toBe('MOCKED BODY');
  });

  it('should use fallback if Claude fails', async () => {
    jest.spyOn(agent as any, 'callClaude').mockRejectedValue(new Error('API Fail'));
    
    const lead = {
      name: 'Test Biz',
      industry: 'HVAC',
      website: 'test.com',
      contactFirstName: 'John'
    };

    const email = await agent.generateInitialEmail(lead);
    expect(email.subjectLine).toBe('Quick question about test.com');
    expect(email.emailBody).toContain('Hi John');
  });
});
