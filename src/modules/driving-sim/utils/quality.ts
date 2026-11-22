export type Quality = 'high' | 'low';

/**
 * Picks the render quality. Software rasterisers (no GPU) get the low preset: no shadows,
 * no MSAA, 0.7x pixel ratio, slower mirrors. `?quality=high|low` in the URL overrides the detection.
 */
export function detectQuality(): Quality {
  const override = new URLSearchParams(window.location.search).get('quality');
  if (override === 'high' || override === 'low') return override;
  try {
    const gl = document.createElement('canvas').getContext('webgl2');
    const info = gl?.getExtension('WEBGL_debug_renderer_info');
    const renderer = gl && info ? String(gl.getParameter(info.UNMASKED_RENDERER_WEBGL)) : '';
    gl?.getExtension('WEBGL_lose_context')?.loseContext();
    return /swiftshader|llvmpipe|software/i.test(renderer) ? 'low' : 'high';
  } catch {
    return 'high';
  }
}
