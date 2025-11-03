import { Link } from 'react-router';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>Created by &nbsp;<Link target='_blank' to={`https://github.com/Relyful`}>Relyful</Link></footer>
  )
}