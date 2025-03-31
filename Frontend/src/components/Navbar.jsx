import React from 'react';
import styles from '../components/Navbar.module.css'; // Import the CSS Module
import logo from "../assets/cnnct.png"; 
import { useNavigate } from 'react-router-dom';
import useIsMobile from './useIsMobile';

export default function Navbar() {
  const navigate = useNavigate();
  const isMobile = useIsMobile(426);

  return (
    <>
      <header>
        <nav>
          <div className={styles['nav-container']}>
            <div className={styles['img']}>
              <img src={logo} alt="Logo" />
            </div>
            {isMobile && (
              <button
                onClick={() => navigate('/login')}
                className={styles['admin-button']}
              >
                Admin
              </button>
            )}
            <button
              onClick={() => navigate('/register')}
              className={styles['btn-sign1']}
            >
              Sign up free
            </button>
          </div>
        </nav>
      </header>
    </>
  );
}