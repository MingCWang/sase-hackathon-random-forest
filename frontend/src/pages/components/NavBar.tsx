import styles from './NavBar.module.css';
import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function NavBar({ id }) {

	const [sidebar, setSidebar] = useState(false);
	id = id.toUpperCase()

	function toggleSideBar() {
		setSidebar(!sidebar);
	}


	const sidebarStyle = sidebar ? styles.sidebarPage : styles.sidebarPageHidden;
	const burgerStyle = sidebar ? styles.burger : styles.burgerHidden;
	const lineTopStyle = sidebar ? styles.lineTop : styles.line;
	const lineBottomStyle = sidebar ? styles.lineBottom : styles.line;
	return (
		<>
			<button className={burgerStyle} onClick={toggleSideBar}>
				<div className={lineTopStyle}></div>
				<div className={lineBottomStyle}></div>
			</button>
			<h1 className={styles.title}>{id}</h1>

			<div className={sidebarStyle}>
				<nav>
					<ul className={styles.navbarPage}>
						{id != 'CLASSES' ? <Link to='/space/classes' className={styles.link}>Classes</Link> : null}
						{id != 'DORMLIFE' ? <Link to='/space/dormlife' className={styles.link}>Dorm Life</Link> : null}
						{id != 'FAMILY' ? <Link to='/space/family' className={styles.link}>Family</Link> : null}
						{id != 'SOCIAL' ? <Link to='/space/social' className={styles.link}>Social</Link> : null}
						{id != 'JOBS' ? <Link to='/space/jobs' className={styles.link}>Jobs</Link> : null}
						{id != 'OTHER' ? <Link to='/space/other' className={styles.link}>Other</Link> : null}
						<Link to='/' className={styles.linkHome}>Home</Link>
					</ul>

				</nav>
			</div>
		</>
	)
}