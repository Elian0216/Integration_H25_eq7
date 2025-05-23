import React from 'react'
import styles from './FlammeChargement.module.css'

// Icone de chargement lors de la génération du graphique d'analyse
const FlammeChargement = () => {
  return (
    <div className="relative flex items-center justify-center">
      <div className={`${styles.animateFlicker} absolute bottom-2/3 w-12 h-12 bg-orange-400 rounded-full shadow-lg`} style={{ animationDelay: '0.2s' }}></div>
      <div className={`${styles.animateFlicker} absolute bottom-2/3 w-6 h-6 bg-yellow-300 rounded-full shadow-lg`} style={{ animationDelay: '0.4s'}}></div>
      <div className={`${styles.animateFlicker} absolute bottom-2/3 w-2 h-2 bg-white rounded-full shadow-lg`} style={{ animationDelay: "0.6s" }}></div>
    </div>
  );
}

export default FlammeChargement
