'use client';
import * as THREE from 'three';

export function setupRenderer(gl: THREE.WebGLRenderer) {
  // Em vez de tentar acessar o canvas diretamente, usamos o renderer (gl) que já está configurado
  gl.setPixelRatio(window.devicePixelRatio);
  gl.setSize(window.innerWidth, window.innerHeight);
  gl.shadowMap.enabled = true;
  gl.shadowMap.type = THREE.PCFSoftShadowMap;
  
  // Configurar eventos de redimensionamento na janela, não no canvas
  window.addEventListener('resize', () => {
    gl.setSize(window.innerWidth, window.innerHeight);
  });
  
  return gl;
}
