import React, { useState } from 'react';

// --- CUSTOM RETRO SVGS ---
const UserIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor" xmlns="http://www.w3.org/2000/svg" shapeRendering="crispEdges" style={{ marginRight: '6px', verticalAlign: 'middle', marginBottom: '2px' }}>
    <rect x="5" y="2" width="4" height="4" />
    <rect x="3" y="7" width="8" height="5" />
  </svg>
);

const SysIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor" xmlns="http://www.w3.org/2000/svg" shapeRendering="crispEdges" style={{ marginRight: '6px', verticalAlign: 'middle', marginBottom: '2px' }}>
    <rect x="2" y="2" width="10" height="7" fill="none" stroke="currentColor" strokeWidth="2" />
    <rect x="5" y="9" width="4" height="2" />
    <rect x="3" y="11" width="8" height="2" />
  </svg>
);

const KernelIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor" xmlns="http://www.w3.org/2000/svg" shapeRendering="crispEdges" style={{ marginRight: '6px', verticalAlign: 'middle', marginBottom: '2px' }}>
    <rect x="6" y="1" width="2" height="2" />
    <rect x="6" y="11" width="2" height="2" />
    <rect x="1" y="6" width="2" height="2" />
    <rect x="11" y="6" width="2" height="2" />
    <rect x="3" y="3" width="8" height="8" fill="none" stroke="currentColor" strokeWidth="2" />
    <rect x="6" y="6" width="2" height="2" />
  </svg>
);

const CpuIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor" xmlns="http://www.w3.org/2000/svg" shapeRendering="crispEdges" style={{ marginRight: '6px', verticalAlign: 'middle', marginBottom: '2px' }}>
    <rect x="3" y="3" width="8" height="8" fill="none" stroke="currentColor" strokeWidth="2" />
    <rect x="5" y="5" width="4" height="4" />
    <rect x="4" y="1" width="2" height="2" />
    <rect x="8" y="1" width="2" height="2" />
    <rect x="4" y="11" width="2" height="2" />
    <rect x="8" y="11" width="2" height="2" />
    <rect x="1" y="4" width="2" height="2" />
    <rect x="11" y="4" width="2" height="2" />
    <rect x="1" y="8" width="2" height="2" />
    <rect x="11" y="8" width="2" height="2" />
  </svg>
);

const GpuIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor" xmlns="http://www.w3.org/2000/svg" shapeRendering="crispEdges" style={{ marginRight: '6px', verticalAlign: 'middle', marginBottom: '2px' }}>
    <rect x="1" y="4" width="12" height="6" fill="none" stroke="currentColor" strokeWidth="2" />
    <rect x="3" y="6" width="2" height="2" />
    <rect x="9" y="6" width="2" height="2" />
  </svg>
);


const LinuxCLI: React.FC = () => {
  // 1. Set the initial ASCII art into a state variable
  const [ascii, setAscii] = useState(`⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⣀⣀⣀⣀⣀⣀⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⣴⣶⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣶⣤⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⣀⠀⠀⠀⢀⣴⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠻⣿⣿⣿⣿⣦⣄⠀⠀⠠⠰⠶⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣠⣤⣤⡤⢀⣴⣿⣿⣿⠏⠀⠋⢉⣠⣿⣿⣿⣿⣿⣿⣿⣤⣄⡀⠈⠙⢿⣿⣿⣿⣧⡀⠐⠻⣶⣶⣄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣰⣿⠟⠁⠉⢠⣾⣿⣿⡿⠁⠀⣠⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣦⣄⠈⠻⣿⣿⣿⣷⡄⠀⢀⠙⢿⡆⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢰⠟⢁⡔⠀⣠⣿⣿⣿⡿⠁⣠⣾⣿⣿⠛⣻⣿⣿⡿⠁⠹⣿⣿⣿⣿⣿⣿⣿⣦⡀⠹⣿⣿⣿⣿⡀⠈⢧⡈⢳⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡟⢠⡿⠀⢰⣿⣿⣿⡿⠁⣼⣿⣿⡿⠃⣼⣿⠏⠀⠁⣴⣆⠈⠉⠙⢿⣿⣿⣿⣿⣷⡄⢹⣿⣿⣿⣷⠀⠀⢷⡈⣧⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠐⢠⣿⠃⠀⣿⣿⣿⣿⠃⣸⣿⣿⠟⢀⣾⠿⠋⠀⢠⣾⣿⣿⣷⣄⠀⠀⠙⢿⣿⣿⣿⣷⠀⣿⣿⣿⣿⡄⢣⠘⣇⠘⡆⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣼⡟⠀⢰⣿⣿⣿⡟⢀⣿⠟⠀⠰⠛⠋⠀⢠⣾⣿⣿⣿⣿⣿⡿⠟⠂⣀⠀⠉⠙⢿⣿⡇⢸⣿⣿⣿⣇⠘⡄⢹⡀⣿⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢰⣿⡇⠀⠸⣿⣿⣿⡇⠈⠁⠀⠀⡀⠀⢀⣀⣤⣿⣿⣿⣿⣿⣿⣷⣤⣍⣉⣁⣤⣤⣀⠙⠓⠘⣿⣿⣿⣿⠀⣇⢸⣿⣿⡆⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⢰⣾⣿⠁⠀⠀⣿⣿⣿⡇⢠⣶⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣦⠀⣿⠻⣿⠛⡆⢻⠸⣿⣿⣇⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⣿⣿⠀⡆⠀⣿⣿⠙⡇⢸⣿⣿⡿⠿⠟⠋⠙⢻⣿⣿⣿⣿⣿⣿⣿⣿⠛⠙⠛⠿⢿⣿⣿⣿⠀⡟⠀⣿⠀⡇⢈⣀⠛⠛⠻⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⡀⠀⠀⠀⠀⠀⠀⠀⣀⣀⡀⠀⠀⢻⣿⡆⢁⠘⣿⣿⣇⣀⣀⣀⣠⣼⣿⣿⣿⣿⣿⣿⣿⣿⣦⣀⣀⠀⢠⣿⣿⣿⠀⠇⢰⣿⠀⡇⢠⣌⣉⣉⠓⠒⠶⠶⠤⠤⣤⣀⠀
⠀⠈⠓⠶⢄⠐⠲⠀⡄⢾⣿⣿⣿⣧⠀⠘⣿⡇⠘⠀⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡟⠀⠀⢸⣿⠀⠁⢸⣿⣿⣿⠇⢰⣀⣄⠠⠒⠉⠀⠀
⠀⠀⠀⠀⠀⠀⠘⠛⠇⠀⠹⣿⣿⣿⡄⠀⠹⣷⠀⠁⠘⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠃⠀⠀⣿⡏⠀⠀⣾⡿⠟⠋⠀⠀⠉⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⡀⠀⠉⣙⠛⠀⠀⠙⡆⠀⠀⢻⣿⣿⣿⣿⣿⣿⡿⠿⣿⠿⠿⣿⠿⣿⣿⣿⣿⣿⣿⣿⣇⢀⡾⠀⠇⠀⠀⢀⡠⠄⢀⣠⣶⡇⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⣿⣷⡆⠉⠀⠀⠀⠀⠀⠀⠀⢺⣿⣿⣿⣿⣿⣿⣿⣶⣶⣶⣶⣶⣶⣿⣿⣿⣿⣿⣿⣿⣿⡿⠁⠀⠀⠀⠀⠈⢠⣶⣿⣿⣿⣷⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⣿⣿⣿⡄⠀⠀⠸⣿⠀⠀⠀⠻⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⠟⠀⠀⠀⣾⠁⠀⣠⣿⣿⣿⣿⣿⣿⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⣿⣿⣿⣷⠀⠘⡀⢻⡀⠀⠀⠀⠈⠙⠿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⠟⠉⠀⠀⠀⠀⠀⠃⠀⢰⣿⣿⣿⠀⣿⣿⣿⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⣿⠸⣿⣿⡀⠀⣧⠘⡇⠀⠀⠀⠀⠀⠀⠀⠀⠉⠛⠿⠿⢿⣿⠿⠿⠛⠋⠁⠀⠀⠀⠀⣀⣀⡀⠀⠀⠀⢸⣿⣿⡿⢰⣿⣿⡿⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠘⣿⡀⣿⣿⣇⠀⢿⡄⠃⢸⣿⣿⠀⣄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⣠⣤⣾⡇⠈⣿⣿⣿⠀⠀⠀⢸⣿⣿⡇⢸⣿⡟⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠘⠀⣿⡇⣿⣿⣿⡆⠸⣧⠀⠀⣿⡇⠀⠀⠀⠀⠀⠀⠀⠐⣶⣶⣶⣿⣿⣿⣿⣿⡿⠋⠁⠀⣿⣿⡇⠀⠀⠀⣼⣿⣿⡇⠈⠟⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠘⠀⣿⡇⣿⣿⣿⣷⠀⢿⡀⠀⣿⣇⠀⠱⠀⠀⠀⠀⠀⠀⣿⣿⣿⣿⣿⠿⠛⢉⡠⠚⠀⢰⣿⣿⡇⠀⠀⠀⣿⣿⣿⡇⠀⠀⣠⡀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⢰⡆⠀⢹⡇⢹⣿⣿⣿⡇⠸⡇⠀⢸⣿⡄⠀⢄⣉⠛⠒⠒⠦⠤⠤⠤⠤⠒⠒⠉⣁⣤⠂⠀⣸⣿⣿⠇⢨⡰⢀⣿⣿⣿⡇⠀⣰⣿⣷⡀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⢠⣿⡇⠀⠸⡇⢸⣿⣿⣿⣿⠀⣿⠀⢸⣿⣷⠀⠘⣿⣿⡏⡠⠀⣴⠂⣤⠀⣶⠈⣆⠸⠃⠈⢠⣿⣿⣿⠀⣿⡇⢸⣿⣿⣿⡇⢠⣿⣿⣿⣧⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⢠⣿⣿⣿⠀⠀⣧⠸⣿⣿⣿⣿⡇⢸⡇⠀⣿⣿⣇⠀⠘⣿⡇⡇⢸⣿⢠⣿⠄⢿⠀⣿⠀⠀⣠⣿⣿⣿⡟⢠⣿⠃⣼⣿⣿⣿⡇⣾⣿⣿⣿⣿⣧⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⣼⣿⣿⣿⡇⠀⢸⠀⣿⣿⣿⣿⣿⠈⣿⠀⢿⣿⣿⣄⠁⢘⠀⡄⢸⣿⠈⢀⠀⢘⡀⢻⠀⣴⣿⣿⣿⣿⡇⢸⣿⣤⣿⣿⣿⣿⡇⣿⣿⠛⣿⣿⣿⣆⠀⠀⠀⠀
⠀⠀⠀⠀⢠⣿⣿⠃⣸⣿⠀⠸⡄⢻⣿⣿⣿⣿⡄⢻⡆⢸⣿⣿⣿⣿⣿⠀⠃⢈⡇⠀⢸⡄⠈⣇⠘⡆⢻⣿⣿⣿⣿⠁⣾⠇⣼⣿⣿⣿⣿⡇⣿⣿⡆⠘⣿⣿⣿⡆⠀⠀⠀
⠀⠀⠀⢀⣾⣿⡏⢀⣿⣿⡇⠀⡇⠸⣿⣿⣿⣿⣇⠸⣧⢸⣿⣿⣿⣿⡇⢸⠀⣿⠇⠀⠉⠉⠀⢿⡀⢳⠸⣿⣿⣿⣿⠀⡿⠀⣿⣿⣿⡏⢹⡇⣿⣿⣧⠀⠸⣿⣿⣿⡄⠀⠀
⠀⠀⠀⣼⣿⡿⠀⣼⣿⣿⣿⠀⢱⣶⣿⣿⣿⣿⣿⠀⣿⠈⣿⣿⣿⣿⡇⠈⠀⣿⠀⠀⠀⠀⠀⠸⡇⠸⡀⢿⣿⣿⡏⢰⠃⠀⣿⣿⣿⣧⢸⡇⣿⣿⣿⡆⠀⢹⣿⣿⣿⡀⠀
⠀⠀⢠⣿⣿⠁⢠⣿⣿⣿⣿⡄⢸⡇⢻⣿⣿⣿⣿⡆⠀⠃⣿⣿⣿⣿⠀⣾⢸⡿⢀⣤⣤⣤⣤⠀⢿⠀⡇⠸⣿⣿⡇⠘⢠⠀⣿⣿⣿⣿⢸⡇⢹⣿⣿⣷⡀⠀⢿⣿⣿⣧⠀
⠀⠀⣾⣿⠏⠀⣼⣿⣿⣿⣿⡇⢸⡇⢸⣿⣿⣿⣿⡇⠀⠀⢻⣿⣿⣿⠀⠉⢸⡇⢸⣿⣿⣿⣿⡇⠸⡇⢻⡀⢿⣿⡇⠀⠀⠀⣿⣿⣿⡇⢸⡇⣼⣿⣿⣿⣇⠀⠘⣿⣿⣿⣧
⠀⣸⣿⡟⠀⢠⣿⣿⣿⣿⣿⣿⠈⡇⠈⣿⣿⣿⣿⣷⡆⠀⢸⣿⣿⡏⢠⡇⣼⠃⠀⠀⠀⠀⠀⠀⠀⣷⠘⡇⠸⣿⡇⢀⠀⠀⣿⣿⣿⡇⠈⡇⣿⣿⣿⣿⣿⡄⢆⠸⣿⣿⣿
⢠⣿⣿⠁⡌⢸⣿⣿⣿⣿⣿⣿⠀⡇⠀⢿⣿⣿⣿⣿⡇⠀⢸⣿⣿⡇⢘⠇⣿⠀⠀⠀⠀⠀⠀⠀⠀⠸⡀⢻⠀⢿⣷⠈⠀⠀⣿⣿⣿⠇⠀⡇⣿⣿⣿⣿⣿⣷⠘⡄⢹⣿⣿
⣿⣿⠇⢸⠇⣿⣿⣿⣿⣿⣿⣿⠀⡇⠀⠸⣿⣿⣿⣿⡇⠀⢸⣿⣿⠇⣘⠀⡟⢠⣤⣤⣤⣤⣤⣴⣶⠀⡇⠸⡇⢸⣿⡀⠀⠀⢿⣿⣿⠀⠀⠃⣿⣿⣿⣿⣿⣿⡄⢹⡀⢿⣿
⠙⠿⢠⣿⠀⣿⣿⣿⣿⣿⣿⣿⡇⠀⠀⠀⢻⣿⣿⣿⠀⠀⣾⣿⣿⠀⣿⠀⡇⢸⣿⣿⣿⣿⠿⠿⠿⡇⢸⠀⢻⠈⣿⣧⠀⠀⢸⣿⡏⠠⠀⢰⣿⣿⣿⣿⣿⣿⣷⠀⢷⣸⠟
⠷⠄⠈⠋⢠⣿⣿⣿⣿⣿⣿⣿⣷⠀⠀⠀⠈⢿⣿⡟⠀⠀⣿⣿⣿⠀⠋⢀⠃⠀⠀⠀⠀⠀⠀⠀⠀⠀⠸⡇⠸⡇⢻⣿⣷⡄⠀⣿⠃⠀⠀⢸⣿⣿⣿⣿⣿⣿⣿⣇⠈⠀⠲
⣦⠀⠀⠀⢸⣿⣿⣿⣿⣿⣿⣿⣿⣧⠀⢰⡄⠈⢻⠇⠀⢸⣿⣿⣿⠸⡇⢸⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢿⠀⢧⠈⣿⣿⣷⡄⠘⢠⡆⢀⣿⣿⣿⣿⣿⣿⣿⣿⡟⠀⠀⠀
⠉⠀⠀⠀⠸⣿⣿⣿⣿⣿⣿⣿⣿⣿⣇⠈⢿⣦⡈⠀⣠⣿⣿⣿⡟⢠⠇⠘⠀⣤⣤⣤⣤⣤⣤⣤⣤⣴⡆⠸⡇⢸⡄⢹⣿⣿⡷⠀⣿⣧⣼⣿⣿⣿⣿⣿⡿⠟⢉⣤⠂⠀⠀
⠀⠀⠀⠀⠲⢤⣉⠛⠻⠿⣿⣿⣿⣿⣿⣶⣼⣿⣷⣀⣹⣿⣿⣿⡇⣼⠀⣿⠀⠛⠛⠛⠛⠋⠋⠉⠉⠉⠉⠀⢿⠈⣧⠈⣿⣿⣿⣿⣿⣿⣿⣿⠿⠟⠋⣁⣤⠶⠋⣀⠴⠀⠀
⠀⠀⠀⠀⠐⠂⠌⠉⠓⠒⠦⠤⠍⠉⠉⠙⠛⠛⠛⠻⠿⠿⠿⠿⠇⠿⠀⠿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠸⠇⠹⠄⠹⠿⠿⠿⠟⠋⠉⠤⠶⠚⠋⠉⠤⠔⠊⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀`.trim());

  // 2. Track whether the user is currently editing it
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div style={{
      backgroundColor: '#1e1e2e',
      color: '#cdd6f4',
      padding: '15px',
      fontFamily: 'Courier Prime, monospace',
      height: '100%',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <div style={{ color: '#f9e2af', marginBottom: '15px', fontWeight: 'bold' }}>
        hi!@FakeOS:~$ hi<span className="blinking-cursor" style={{ color: '#cdd6f4' }}>_</span>
      </div>

      <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>

        {/* 3. Render either a Textarea (if editing) or the Div (if viewing) */}
        {isEditing ? (
          <textarea
            aria-label='deds'
            value={ascii}
            onChange={(e) => setAscii(e.target.value)}
            onBlur={() => setIsEditing(false)}
            autoFocus
            style={{
              backgroundColor: '#11111b',
              color: '#f5c2e7',
              fontSize: '5px',
              lineHeight: '5px',
              border: '1px dashed #f5c2e7',
              outline: 'none',
              fontFamily: 'Courier Prime, monospace',
              whiteSpace: 'pre',
              width: '250px',
              height: '200px',
              resize: 'both'
            }}
          />
        ) : (
          <div
            onClick={() => setIsEditing(true)}
            title="Click to Edit ASCII"
            style={{
              color: '#f5c2e7',
              whiteSpace: 'pre',
              fontSize: '5px',
              lineHeight: '5px',
              textShadow: '0 0 2px rgba(245, 194, 231, 0.4)',
              cursor: 'pointer' // Shows the user they can click it
            }}>
            {ascii}
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '14px', fontWeight: 'bold' }}>
          <div><span style={{ color: '#f38ba8' }}><UserIcon /> User   {'>'}</span> hi!</div>
          <div><span style={{ color: '#a6e3a1' }}><SysIcon /> OS     {'>'}</span> FakeOS</div>
          <div><span style={{ color: '#89b4fa' }}><KernelIcon /> Kernel {'>'}</span> 4.20.69</div>
          <div><span style={{ color: '#89dceb' }}><CpuIcon /> CPU    {'>'}</span> AMD 8</div>
          <div><span style={{ color: '#fab387' }}><GpuIcon /> GPU    {'>'}</span> NVIDIA 3</div>
        </div>
      </div>
    </div>
  );
};

export default LinuxCLI;