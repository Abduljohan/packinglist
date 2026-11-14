export function harborLighting(mode: string | undefined): {
  night: boolean;
  sunVisible: boolean;
  lampsOn: boolean;
  hemisphereIntensity: number;
  directionalIntensity: number;
  skyToken: string;
};