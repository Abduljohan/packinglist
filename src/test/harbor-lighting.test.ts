import { describe, expect, it } from 'vitest';
import { harborLighting } from '../components/harbor/harbor-lighting.js';

describe('harbor day and night rules', () => {
  it('shows the sun in day mode', () => {
    expect(harborLighting('day').sunVisible).toBe(true);
    expect(harborLighting('day').lampsOn).toBe(false);
  });
  it('turns the lamps on and hides the sun at night', () => {
    expect(harborLighting('night').lampsOn).toBe(true);
    expect(harborLighting('night').sunVisible).toBe(false);
  });
  it('uses a darker sky and lower ambient illumination at night', () => {
    expect(harborLighting('night').skyToken).toBe('--harbor-night-sky');
    expect(harborLighting('night').hemisphereIntensity).toBeLessThan(harborLighting('day').hemisphereIntensity);
  });
});