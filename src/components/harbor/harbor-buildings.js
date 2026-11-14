import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import warehouse from '@/assets/models/harbor-warehouse.glb.asset.json';
import office from '@/assets/models/harbor-office.glb.asset.json';
import depot from '@/assets/models/harbor-depot.glb.asset.json';

// Reuse loaded geometry and atlas materials across the entire roadside district.
export function loadHarborBuildings(scene, isDisposed, color, styles) {
  const district = new THREE.Group();
  district.name = 'harbor-company-district';
  scene.add(district);
  const names = ['CV MR EXPRESS', 'PELNI', 'DHARMA LAUTAN', 'MAERSK', 'MSC', 'CMA CGM', 'COSCO SHIPPING', 'HAPAG-LLOYD', 'EVERGREEN'];
  const loader = new GLTFLoader();
  const signGeometry = new THREE.PlaneGeometry(15, 2.1);
  const signMaterials = names.map(name => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024; canvas.height = 128;
    const ctx = canvas.getContext('2d');
    if (!ctx) return new THREE.MeshBasicMaterial({ color: color('--harbor-ink') });
    ctx.fillStyle = styles.getPropertyValue('--harbor-model-4').trim(); ctx.fillRect(0, 0, 1024, 128);
    ctx.fillStyle = styles.getPropertyValue('--harbor-ink').trim();
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.font = '900 70px Arial';
    ctx.fillText(name, 512, 64, 950);
    const texture = new THREE.CanvasTexture(canvas); texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 4;
    return new THREE.MeshBasicMaterial({ map: texture });
  });
  const disposeModel = model => {
    model.traverse(obj => {
      obj.geometry?.dispose();
      const mats = obj.material ? (Array.isArray(obj.material) ? obj.material : [obj.material]) : [];
      mats.forEach(material => { Object.values(material).forEach(value => { if (value?.isTexture) value.dispose(); }); material.dispose(); });
    });
  };
  return Promise.all([warehouse, office, depot].map(async (asset, type) => {
    const { scene: model } = await loader.loadAsync(asset.url);
    if (isDisposed()) { disposeModel(model); return; }
    const bounds = new THREE.Box3().setFromObject(model), size = bounds.getSize(new THREE.Vector3()), center = bounds.getCenter(new THREE.Vector3());
    const scale = 21 / Math.max(size.x, size.z);
    model.scale.setScalar(scale);
    model.position.set(-center.x * scale, -bounds.min.y * scale, -center.z * scale);
    for (let i = type; i < 18; i += 3) {
      const building = new THREE.Group(), row = Math.floor(i / 9), slot = i % 9;
      building.name = `company-building-${i}`;
      building.add(model.clone(true));
      building.position.set(-120 + slot * 30, .1, -82 - row * 34);
      const sign = new THREE.Mesh(signGeometry, signMaterials[i % names.length]);
      sign.position.set(0, Math.min(size.y * scale * .7, 9), 10.6);
      building.add(sign); district.add(building);
    }
  })).finally(() => {
    // These can be unused if navigation happens before any model finishes loading.
    if (isDisposed()) { signGeometry.dispose(); signMaterials.forEach(m => { m.map?.dispose(); m.dispose(); }); }
  });
}