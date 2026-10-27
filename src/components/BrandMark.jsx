import { logoMark } from '../utils/brandAssets.js';

// The clinic mark. The file lives in public/, so replacing it changes every header.
export default function BrandMark({ size = 32 }) {
  return <img className="brand-mark" src={logoMark} alt="" width={size} height={size} style={{ height: size, width: 'auto' }} />;
}
