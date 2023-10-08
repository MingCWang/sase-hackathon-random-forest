
import './App.css'
import { useRef, forwardRef } from 'react'
import { HiArrowSmDown } from 'react-icons/hi'
import Cards from './components/Cards'
import Header from './components/Header'
import Info from './components/Info'
import ScrollToHashElement from './components/ScrollToHashElement'


import videoFile from './assets/Swing.mp4';

function App() {
	const ref = useRef(null);
	const CardsComponent = forwardRef<HTMLDivElement>((props, ref) => {
		return (
			<div ref={ref}>
				<Cards />
			</div>
		);
	});

	function handleClick() {
		ref.current.scrollIntoView({
			behavior: 'smooth',
			block: 'nearest',
			inline: 'center'
		});
	}

	return (
		<>
			<ScrollToHashElement />
			<Header />
			<div className="hero" id='home'>
				<div className="container">
					<div>
						<h1 className="logo">
						<span className="custom-color">Safe</span>Space
						</h1>
					</div> 
					<p>A space where you</p>
					<p>- Feel safe expressing your emotions</p>
					<p className='last'>- Other people relate to you </p>
					<a href="#info" className='learnMore'>Learn more</a>
				</div>
				<button className="arrowContainer" onClick={handleClick}>
					<p>Join a Safe Space</p>
					<HiArrowSmDown className="arrow" />
				</button>

				<video className="hero-video" autoPlay loop muted>
					<source src={videoFile} type="video/mp4" />
					Your browser does not support the video tag.
				</video>
			</div>
			<CardsComponent ref={ref} />
			<Info />
			
		</>
	)
}

export default App