export function harborLighting(mode) {
  const night = mode === 'night';
  return {
    night,
    sunVisible: !night,
    lampsOn: night,
    hemisphereIntensity: night ? .38 : .95,
    directionalIntensity: night ? .28 : 1.5,
    skyToken: night ? '--harbor-night-sky' : '--harbor-model-13',
  };
}