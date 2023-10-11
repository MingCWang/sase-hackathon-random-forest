import styles from './space.module.css';
import Draggable from 'react-draggable';
import FormDialog from './components/FormDialog';
import PopupForm from './components/PopupForm';
import NavBar from './components/NavBar';
// import CardDialog from './CardDialog';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { isMean } from './isMean';

export default function Space() {

	const [position, setPosition] = useState({ x: 0, y: 0 });
	const [notes, setNotes] = useState<Array<Note>>([]);
	const { id } = useParams();
	const [reply, setReply] = useState('');
	const [comments, setComments] = useState('');
	const [open, setOpen] = useState(false)
	const [dragging, setDragging] = useState(false)

	useEffect(() => {
		const getRandomPosition = (max) => {
			return Math.floor(Math.random() * max);
		};

		const randomX = getRandomPosition(window.innerWidth - 400); // Adjust width
		const randomY = getRandomPosition(window.innerHeight - 100); // Adjust height
		// console.log(randomX, randomY)
		setPosition({ x: randomX, y: randomY });
	}, []);

	interface Note {
		topic: string;
		note: string;
		id: string;
	}

	async function handleSubmit(event: React.FormEvent<HTMLFormElement>, topic: string, note: string) {
		event.preventDefault();

		const noteBullyingDetected = await isMean(note);
		const replyBullyingDetected = await isMean(reply);
		const commentsBullyingDetected = await isMean(comments);

		if (noteBullyingDetected || replyBullyingDetected || commentsBullyingDetected) {
			toast.error('The content you entered is considered bullying or mean. Please refrain from such content.');
		} else {
			setNotes([...notes, {
				topic: topic,
				note: note,
				reply: reply,
				comments: comments,
				id: crypto.randomUUID()
			}]);
			setReply('');
			setComments('');
		}
	}



	const handleStart = () => {
		setDragging(true);
	};

	const handleStop = () => {
		setTimeout(function () { setDragging(false) }, 500);
		if (!dragging) {
			setOpen(!open);
		}
	};

	const handleClickOpen = () => {
		if (!dragging) {
			setOpen(true);
		}
	};

	const handleClose = async (event) => {
		event.preventDefault();

		const replyBullyingDetected = await isMean(reply);
		const commentsBullyingDetected = await isMean(comments);

		console.log(replyBullyingDetected, commentsBullyingDetected);

		if (replyBullyingDetected || commentsBullyingDetected) {
			toast.error('The content you entered in the reply or comments is considered bullying or mean. Please refrain from such content.');
		} else {
			setOpen(false);
			setReply('');
			setComments('');
		}
	};


	return (
		<>
			<NavBar id={id} />
			<div>
				<ToastContainer />
				{
					notes.map((card) => (
						<div key={card.id} >
							{
								open ? (
									<PopupForm
										card={card}
										handleClose={handleClose}
										handleSubmit={handleSubmit}
										reply={reply}
										setReply={setReply}
										comments={comments}
										setComments={setComments}
									/>
								) : (
									<Draggable onDrag={handleStart} onStop={handleStop} defaultPosition={position}>
										<div className={styles.notes} onClick={handleClickOpen}>
											<p className={styles.topic}>{card.topic}</p>
										</div>
									</Draggable>
								)
							}
						</div >
					))
				}
			</div >
			<FormDialog handleSubmit={handleSubmit} />
		</>
	);
}
