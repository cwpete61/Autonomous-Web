import { ScoutAgent } from './scout-agent';

describe('ScoutAgent — computeQualityScore()', () => {
  let agent: ScoutAgent;

  beforeEach(() => {
    agent = new ScoutAgent({
      anthropicApiKey: 'test-key',
      googlePlacesKey: 'test-key',
      googlePagespeedKey: 'test-key',
      hunterKey: 'test-key',
    });
  });

  it('should return Claude score if no PageSpeed data is present', () => {
    const analysis = { qualityScore: 75 };
    const score = agent.computeQualityScore({}, null, analysis);
    expect(score).toBe(75);
  });

  it('should blend Claude score with PageSpeed score (lower PS score = higher bad score)', () => {
    // Claude score (badness) = 50
    // PageSpeed score (performance) = 20 (meaning 80 badness)
    // Blend: (50 + 80) / 2 = 65
    const analysis = { qualityScore: 50 };
    const pagespeed = { score: 20 };
    const score = agent.computeQualityScore({}, pagespeed, analysis);
    expect(score).toBe(65);
  });

  it('should handle high performance PageSpeed scores correctly', () => {
    // Claude score (badness) = 50
    // PageSpeed score (performance) = 90 (meaning 10 badness)
    // Blend: (50 + 10) / 2 = 30
    const analysis = { qualityScore: 50 };
    const pagespeed = { score: 90 };
    const score = agent.computeQualityScore({}, pagespeed, analysis);
    expect(score).toBe(30);
  });

  it('should clamp the score between 0 and 100', () => {
    const analysisLow = { qualityScore: -10 };
    expect(agent.computeQualityScore({}, null, analysisLow)).toBe(0);

    const analysisHigh = { qualityScore: 110 };
    expect(agent.computeQualityScore({}, null, analysisHigh)).toBe(100);
  });

  it('should use default 50 if analysis provides no score', () => {
    const analysis = {};
    const score = agent.computeQualityScore({}, null, analysis);
    expect(score).toBe(50);
  });
});
