import { logoMark } from '../utils/brandAssets.js';

// The clinic mark. The file lives in public/, so replacing it changes every header.
export default function BrandMark() {
  return <img className="brand-mark" src={logoMark} alt="" width="34" height="34" />;
}
